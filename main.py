from flask import Flask, send_from_directory
from data import getDashboardData

app = Flask(__name__)


@app.route("/")
def index():
    return send_from_directory('static/', 'index.html')


@app.route("/<path:subpath>")
def serve(subpath):
    print(subpath)
    return send_from_directory('static/', path=subpath)


@app.route('/api/data/dashboard')
def rtn():
    return getDashboardData(), {'Access-Control-Allow-Origin': '*'}
