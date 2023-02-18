from flask import Flask, send_from_directory, request
from data import getDashboardData, getQuery

app = Flask(__name__)

@app.route("/")
def index():
    return send_from_directory('static/', 'index.html')


@app.route('/api/data/dashboard')
def rtn():
    return getDashboardData(), {'Access-Control-Allow-Origin': '*'}


@app.route('/api/data/query')
def query():
    result = getQuery(request.args)
    return result['msg'], result['code'], {'Access-Control-Allow-Origin': '*'}



# @app.route("/<path:subpath>")
# def serve(subpath):
#     print(subpath)
#     return send_from_directory('static/', path=subpath)
