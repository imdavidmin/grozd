import pandas
from sqlalchemy import create_engine, DateTime
import requests
import datetime
from flask import Flask

app = Flask(__name__)

print('<event> Initialised.')


@app.route('/')
@app.route('/__space/v0/actions')
@app.route('/<path:path>')
def fetch(**args):
    DATA_ENDPOINT = "https://api.ethgasstation.info/api/fee-estimate"
    DB_CONNECTION_STRING = "postgresql://worker:v2_3z7vi_p2JBRtSyvrpQzEUzgcBUdvb@db.bit.io:5432/imdavidmin/grozd"

    print('<event> Handler')

    dtype = {
        "TS": DateTime
    }

    try:
        print('<event> Reading pricing from endpoint')
        response = requests.get(DATA_ENDPOINT)

        if response.status_code != 200:
            print('Data endpoint did not return an OK response')
            return 'Data endpoint did not return an OK response', 500

        data = response.json()
    except:
        return 'Error accessing data endpoint', 500

    engine = create_engine(DB_CONNECTION_STRING, echo=True, pool_pre_ping=True)
    columns = ['timestamp', 'base', 'fast', 'instant', 'standard', 'block_id']
    values = [
        pandas.to_datetime(datetime.datetime.now()),
        data['baseFee'],
        data['gasPrice']['fast'],
        data['gasPrice']['instant'],
        data['gasPrice']['standard'],
        data['blockNumber']
    ]
    print(f'''Inserting new row with values:{values}''')

    # Return SQL query as a pandas dataframe
    with engine.connect() as db:
        print('<event> Database connection established')

        df = pandas.DataFrame([values], columns=columns)
        df.to_sql('pricing', engine, if_exists='append',
                  index=False, dtype=dtype)

    return df.head().to_json(), 200, {"content-type": "application/json"}
