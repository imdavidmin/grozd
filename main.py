from flask import Flask, send_from_directory, request
from data import getDashboardData

app = Flask(__name__)


@app.route("/")
def index():
    return send_from_directory('static/', 'index.html')


@app.route('/api/data/dashboard')
def rtn():
    return getDashboardData(), {'Access-Control-Allow-Origin': '*'}


@app.route('api/data/query')
def rtn():
    result = getQuery(request.args)
    return result['msg'], result['code'], {'Access-Control-Allow-Origin': '*'}


def getQuery(args):
    dfrom = args.get('from')
    dto = args.get('to')
    interval = args.get('interval')

# @app.route("/<path:subpath>")
# def serve(subpath):
#     print(subpath)
#     return send_from_directory('static/', path=subpath)
