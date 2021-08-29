import flask
import flask_praetorian
import flask_cors
import datetime
import json
import boto3

app = flask.Flask(__name__)
guard = flask_praetorian.Praetorian()
app.config["SECRET_KEY"] = "top secret"
app.config["JWT_ACCESS_LIFESPAN"] = {"hours": 24}
app.config["JWT_REFRESH_LIFESPAN"] = {"days": 30}
cors = flask_cors.CORS()


@app.route("/api", methods=["POST"])
def home():
    """
    # SAVE THIS ALL
    ret2 = flask.request.files
    my_file = ret2['filename'].read()
    with open("formdata.txt", "wb") as f:
        f.write(my_file)
    """

    ret = flask.request.form.get('username')
    print(ret)

    """
    # SAVE THIS ALL
    ACCESS_KEY = "AKIAX6C2X4DBYI5XFIXQ"
    SECRET_KEY = "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"
    client = boto3.client("s3", aws_access_key_id=ACCESS_KEY,
                          aws_secret_access_key=SECRET_KEY, region_name="us-east-1")
    USER_ID = "testUserID"
    ENTRY_ID = "testEntryID"
    response = client.put_object(
        ACL="private", Body=my_file, Bucket="infinote-audio-files", Key=f"{USER_ID}/{ENTRY_ID}.m4a")
    print("Put file into S3", response)

    response_new = client.get_object(
        Bucket="infinote-audio-files", Key=f"{USER_ID}/{ENTRY_ID}.m4a")
    data = response_new["Body"].read()
    with open("DDID222.m4a", "wb") as f:
        f.write(data)
    """
    return {"message": "message"}


# Run the example
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
