import flask
import datetime
import flask_praetorian
import boto3
import flask_cors
import mongoengine
import json
from aws_connect import boto3_get_file, boto3_put_file, boto3_delete_file, client
from models import User, Entry, UserForJWTToken
from db_functions import (create_new_user, search_for_user_by_username, update_user,
                          find_entries_for_user, get_entry, search_for_user_by_id, new_entry, change_entry_tags, delete_entry_tags)

# Passport is a node package API that deals with login/signup stuff. passport-google-oath-2.0

# Activating virtual environment: source .venv/bin/activate
# IMPORTANT: HASH PASSWORD BEFORE PASSING INTO CREATE_NEW_USER FUNCTION

app = flask.Flask(__name__, static_folder='../frontend/build',
                  static_url_path='')
guard = flask_praetorian.Praetorian()
app.config["SECRET_KEY"] = "top secret"
app.config["JWT_ACCESS_LIFESPAN"] = {"hours": 24}
app.config["JWT_REFRESH_LIFESPAN"] = {"days": 30}
PASSWORD = "jjzfivePassword"
DB_NAME = "user-entry"
DB_URI = f"mongodb+srv://jjzfive:{PASSWORD}@infinote-main-cluster.w4wq3.mongodb.net/{DB_NAME}?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE"
# add on end: &ssl_cert_reqs=CERT_NONE
mongoengine.connect(host=DB_URI)
guard.init_app(app=app, user_class=User)
flask_cors.CORS(app)

# Way eaiser to have this JWT token function here


def create_jwt_token(user):
    # Must create a new jwt_user class because ObjectID() isn't JSON Serializable
    jwt_user = UserForJWTToken(id=str(user.id), roles=user.roles)
    # It broke if I didn't add app_context
    with app.app_context():
        ret = {"access_token": guard.encode_jwt_token(
            jwt_user, bypass_user_check=True)}
        del jwt_user
        return ret


# Api Routes
@app.route("/api/delete-user/<username>", methods=["POST"])
@flask_praetorian.auth_required
def delete_user(username):
    del_user = User.objects(username=username).first()
    if del_user:
        del_user.delete()
        return {"message": f"Deleted user {username} successfully"}, 200
    else:
        return {"message": "Error, user not found"}, 404


@app.route("/api/sign_up", methods=["POST"])
def sign_up():
    req = flask.request.get_json(force=True)
    firstname = req.get("firstname", None)
    email = req.get("email", None)
    username = req.get("username", None)
    password = req.get("password", None)
    if User.objects(username=username).count() < 1:
        user = create_new_user(
            firstname=firstname,
            email=email,
            username=username,
            password=guard.hash_password(password),
            roles="user",
        )
        return {"message": "User created successfully!"}, 200
    else:
        # Just chose status 404 because I think it makes the most sense
        return {"message": "Could not create user"}, 404


@app.route("/api/login", methods=["POST"])
def login():
    req = flask.request.get_json(force=True)
    # Expand to ability to sign in with email as well
    username = req.get("username", None)
    password = req.get("password", None)
    user = guard.authenticate(username, password)
    ret = create_jwt_token(user)
    return ret, 200


@app.route("/api/refresh", methods=["POST"])
@flask_praetorian.auth_required
def refresh():
    old_token = flask.request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {"access_token": new_token}
    return ret, 200


@app.route("/api/get-entry-file/<username>/<entry_id>")
@flask_praetorian.auth_required
def get_entry_file(username, entry_id):
    user_id = search_for_user_by_username(username).id
    data = boto3_get_file(key=f"{user_id}/{entry_id}")
    data = str(data)
    data = data.split("base64,")
    data = data[1].rstrip("'")
    return {"test": data}


@app.route("/api/get-entries", methods=["POST"])
@flask_praetorian.auth_required
def get_entries():
    # UNFINISHED
    # This DOES NOT PULL S3 bucket info. Only Mongo info. Only first 10? 20? 50? Think # of items/page
    req = flask.request.get_json(force=True)
    user = search_for_user_by_username(req["username"])
    entries = find_entries_for_user(user)
    # Convert entries to Python array for JSON serialization
    returned_entries = []
    for idx, entry in enumerate(entries):
        returned_entries.append(
            {
                "id": str(entry.id),
                "name": entry.name,
                "registered_date": entry.registered_date,
                "tags": entry.tags
            }
        )
    return {"entries": returned_entries}


@ app.route("/api/delete-entry", methods=["DELETE"])
@flask_praetorian.auth_required
def delete_entry():
    # Takes entry id, which is stored in id tag of a delete button on the screen
    # Must delete from s3 first, then from Mongo
    req = flask.request.get_json(force=True)
    username = req["username"]
    user_id = search_for_user_by_username(username).id
    entry_id = req["entryId"]
    key = f"{user_id}/{entry_id}"
    # Delete from S3 bucket
    boto3_delete_file(key)
    # Now, delete from Mongo
    # entry_deleted = delete_entry(entry_id=entry_id)
    entry = Entry.objects(id=entry_id).first()
    if entry:
        entry.delete()
        return {"message": "Entry successfully deleted"}, 200
    else:
        return {"message": "Entry could not be found or deleted"}, 404


@app.route("/api/upload-entry/<username>/<filename>", methods=["POST"])
@flask_praetorian.auth_required
def upload_entry_test(username, filename):
    # Get the uploaded file in bytes format
    data = flask.request.get_json(force=True)
    uploaded_file = data["file"]
    # Get user id to pass to boto3
    user_id = search_for_user_by_username(username).id
    # Must create new entry before upload to generate entry id
    entry = new_entry(user_id, filename)
    entry_id = entry.id
    # Append tags, if any
    ######change_entry_tags(entry_id, tags, append=False)
    # Put the file into S3 bucket
    response = boto3_put_file(user_id, entry_id, uploaded_file)
    status_code = response["ResponseMetadata"]["HTTPStatusCode"]
    return {"response": status_code}, status_code


@app.route("/api/get-user-email/<username>")
@flask_praetorian.auth_required
def get_user_settings(username):
    user = search_for_user_by_username(username)
    email = user.email
    firstname = user.firstname
    return {"email": email, "firstname": firstname}, 200


@app.route("/api/change-password/<username>", methods=["POST"])
@flask_praetorian.auth_required
def change_password(username):
    data = flask.request.get_json(force=True)
    password = guard.hash_password(data["password"])
    user = search_for_user_by_username(username)
    # remember to hash new password
    user.password = password
    user.save()
    return {"message": "Passsword changed successfully"}, 200


@app.route("/api/email-check/<email>")
def email_check(email):
    user = User.objects(email=email).first()
    if user:
        return {"message": "exists"}, 409
    else:
        return {"message": "valid"}, 200


@app.route("/api/username-check/<username>")
def username_check(username):
    user = User.objects(username=username).first()
    if user:
        return {"message": "exists"}, 409
    else:
        return {"message": "valid"}, 200


@app.route("/api/get-entry-info-by-id/<id>")
@flask_praetorian.auth_required
def get_entry_info_by_id(id):
    entry = Entry.objects(id=id).first()
    return {"name": entry.name, "registeredDate": entry.registered_date}, 200


@app.route("/api/get-firstname/<username>")
@flask_praetorian.auth_required
def get_firstname(username):
    user = User.objects(username=username).first()
    return {"firstname": user.firstname}, 200


# Run the example
if __name__ == "__main__":
    app.run(host="0.0.0.0")
