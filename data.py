from sqlalchemy import create_engine, text
from datetime import datetime, timedelta
from pandas import DataFrame, read_sql_query, Series
from flask import request
import numpy

DB_CONNECTION_STRING = "postgresql://worker:v2_3z7vi_p2JBRtSyvrpQzEUzgcBUdvb@db.bit.io:5432/imdavidmin/grozd"
engine = create_engine(DB_CONNECTION_STRING, pool_pre_ping=True)


def getDashboardData():
    lookback_days = 30
    max_records = 10000

    with engine.connect() as db:
        query = f'''
    SELECT * FROM pricing WHERE timestamp>'{datetime.now()- timedelta(days=lookback_days)}' LIMIT {max_records}
        '''
        print(f'''Sending query as follows{query}''')

        df: DataFrame = read_sql_query(text(query), db)

        # Get latest prices into "now"
        now = {}
        df.sort_values(by='timestamp', ascending=True)
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
        m = series.mean()
        return round(m, 2) if not numpy.isnan(m) else 0

    for d in range(6):
        base = []
        fast = []
        instant = []
        standard = []

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
