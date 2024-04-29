from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from google.cloud import datastore
import bcrypt
import os

client = datastore.Client()

app = Flask(__name__, static_folder='build', static_url_path='/')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:3000","https://kobold-website-421221.wl.r.appspot.com", "https://areyouthebestkobold.com"])

## DEBUG MODE: Set to false for production
debug_mode = False



@app.route("/")
def index():
    return send_from_directory(app.static_folder, 'index.html')


@socketio.on('connect')
def handle_connect():
    print('Client connected to the Kobold Network, will be able to detect other coin adds.')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected from the Kobold Network.')


### CREATE AN ACCOUNT ###
@app.route("/kobolds", methods=["POST"])
def PostKobold():
    if (debug_mode):
        return ({
            "username": content["username"],
            "coin_count": 0
        }, 201)


    content = request.get_json()
    new_key = client.key("kobolds")
    new_kobold = datastore.Entity(key=new_key)

    # 400 CASE
    needed_fields = ["username", "password"]

    for needed_field in needed_fields:
        if needed_field not in content:
            return {
                "Error": "The request body is missing at least one of the required attributes"
            }, 400

    hashed_password = bcrypt.hashpw(content["password"].encode('utf-8'), bcrypt.gensalt())

    new_kobold.update({
        "username": content["username"],
        "password": hashed_password,
        "coin_count": 0
    })
    client.put(new_kobold)
    new_kobold.pop('password', None)
    new_kobold["id"] = new_kobold.key.id
    return (new_kobold, 201)


def InternalFetchHoard():
    key = client.key('TreasureHoard', 'global')
    hoard = client.get(key)
    if hoard is None:
        hoard = datastore.Entity(key=key)
        hoard['total'] = 0
        client.put(hoard)
    return hoard

@app.route("/TreasureHoard", methods=["GET"])
def GetHoard():
    if debug_mode:
        return jsonify({'total': 0})

    key = client.key('TreasureHoard', 'global')
    hoard = client.get(key)
    if hoard is None:
        hoard = datastore.Entity(key=key)
        hoard['total'] = 0
        client.put(hoard)

    return jsonify(hoard)


### GET LEADERBOARD KOBOLDS ###
@app.route("/kobolds/leaderboard", methods=["GET"])
def GetTop5Kobolds():

    if (debug_mode):
        return jsonify([
            {"username": "TopKobold1", "coin_count": 1000},
            {"username": "TopKobold2", "coin_count": 750},
            {"username": "TopKobold3", "coin_count": 500},
            {"username": "TopKobold4", "coin_count": 250},
            {"username": "TopKobold5", "coin_count": 100}
        ])

    query = client.query(kind="kobolds")
    query.order = ['-coin_count']
    results = list(query.fetch(limit=5))
    leaderboard = [{"username": r["username"], "coin_count": r["coin_count"]} for r in results]
    return jsonify(leaderboard)


### TEST KOBOLD USERNAME ###
@app.route("/kobolds/<string:username>", methods=["GET"])
def TestUsernameViability(username):
    if debug_mode:
        return {"isTaken": False}, 200

    query = client.query(kind="kobolds")
    query.add_filter("username", "=", username)
    results = list(query.fetch(limit=1))
    
    if results:
        return {"isTaken": True}, 200
    return {"isTaken": False}, 200


### LOGIN KOBOLD BY USERNAME (FROM LOGGING IN) ###
@app.route("/kobolds/login", methods=["POST"])
def LogInKobold():

    if (debug_mode):
        return {"username": "DebugKobold", "coin_count": 50}, 200

    content = request.get_json()
    username = content.get('username')
    password = content.get('password').encode('utf-8')

    if not username or not password:
        return {"Error": "Username and password are required"}, 400

    query = client.query(kind="kobolds")
    query.add_filter("username", "=", username)
    kobolds = list(query.fetch(limit=1))

    if not kobolds:
        return {"Error": "No kobold with this username exists"}, 404

    kobold = kobolds[0]
    stored_hash = kobold['password']

    # verify the provided password against the stored hash
    if bcrypt.checkpw(password, stored_hash):
        return {"username": kobold["username"], "coin_count": kobold["coin_count"]}, 200
    else:
        return {"Error": "Invalid credentials"}, 401
        


### ADD A COIN TO A KOBOLDS ACCOUNT AND THE TREASUREHOARD ###
@app.route("/kobolds" + "/<string:username>/AddCoin", methods=["PUT"])
def AddCoin(username):
    with client.transaction():
        query = client.query(kind="kobolds")
        query.add_filter("username", "=", username)
        kobolds = list(query.fetch(limit=1))

        if not kobolds:
            return {"Error": "No kobold with this username exists"}, 404

        kobold = kobolds[0]

        kobold['coin_count'] = kobold.get('coin_count', 0) + 1

        # Update the treasure hoard
        hoard = InternalFetchHoard()
        hoard['total'] += 1

        client.put_multi([kobold, hoard])

        # Ping the Kobold Network
        socketio.emit('coin_added', {'username': username}, broadcast=True)

        
    return {"Success": True}, 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
