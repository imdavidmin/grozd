from sqlalchemy import create_engine, text
from datetime import datetime, timedelta
from pandas import DataFrame, read_sql_query, Series
from flask import request
import numpy

DB_CONNECTION_STRING = "postgresql://worker:v2_3z7vi_p2JBRtSyvrpQzEUzgcBUdvb@db.bit.io:5432/imdavidmin/grozd"
engine = create_engine(DB_CONNECTION_STRING, pool_pre_ping=True)
max_records = 10000


def getQuery(args):
    dfrom = args.get('from')
    dto = args.get('to')
    interval = args.get('interval')

    timestamp_range = f'''timestamp > \'{datetime.fromtimestamp(int(dfrom)/1000)}\'''' + \
        (f'''AND timestamp < \'{datetime.fromtimestamp(int(dto)/1000)}\'''' if dto else '')
    
    with engine.connect() as db:
        query = f''' SELECT timestamp, base FROM pricing WHERE {timestamp_range} LIMIT {max_records}'''
        df: DataFrame = read_sql_query(text(query), db)
        df.set_index(df.columns[0], inplace=True)

        rtn_df = df.resample(interval).first().fillna(0).astype(int) if interval else df
        rtn_df['ts'] = rtn_df.index.to_series().astype(int).floordiv(1000000).astype(int)

        return {
            "msg": rtn_df.T.to_dict(orient='split').get('data'),
            "code": 200
        }


def getDashboardData():
    lookback_hours = 6

    with engine.connect() as db:
        query = f'''
    SELECT * FROM pricing WHERE timestamp>'{datetime.now()- timedelta(hours=lookback_hours)}' LIMIT {max_records}
        '''
        print(f'''Sending query as follows{query}''')

        df = read_sql_query(text(query), db)

        # Get latest prices into "now"
        now = {}
        df.sort_values(by='timestamp', ascending=False)
        for col in ['base', 'fast', 'instant', 'standard']:
            now[col] = int(df.at[0, col])

        # Get time series for base
        base = df[['base', 'timestamp']].astype({'timestamp': "int64"})
        base['timestamp'] = base['timestamp'].floordiv(1000000).astype(int)

        return {
            "avg": getAvgs(df),
            "now": now,
            "base": base.transpose().to_dict(orient="split").get('data')
        }

# Calculate the average for each hour on each day


def getAvgs(df: DataFrame):
    avgs = {"base": [], "fast": [], "instant": [], "standard": []}

    def getMean(series: Series):
        m = round(series.mean(), 2)
        return 0 if numpy.isnan(m) else m

    for d in range(6):
        base, fast, instant, standard = [], [], [], []

        for h in range(23):
            filtered = df[
                (df['timestamp'].dt.day_of_week == d) &
                (df['timestamp'].dt.hour == h)
            ]
            base.append(getMean(filtered['base']))
            fast.append(getMean(filtered['fast']))
            instant.append(getMean(filtered['instant']))
            standard.append(getMean(filtered['standard']))

        avgs['base'].append(base)
        avgs['fast'].append(fast)
        avgs['instant'].append(instant)
        avgs['standard'].append(standard)

    return avgs
