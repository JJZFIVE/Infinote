import boto3
from api import User, Entry
import mongoengine

# Setup boto3 client
ACCESS_KEY = "AKIAX6C2X4DBYI5XFIXQ"
SECRET_KEY = "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"
client = boto3.client("s3", aws_access_key_id=ACCESS_KEY,
                      aws_secret_access_key=SECRET_KEY, region_name="us-east-1")


# FILE PATH: USERID/ENTRYID.mp3
# Put file into S3
def put_file(user_id, entry_id):
    USER_ID = str(User.objects(id=user_id).first().id)
    ENTRY_ID = str(Entry.objects(id=entry_id).first().id)
    with open("testpodcast.mp3", "rb") as f:
        data = f.read()
    response = client.put_object(
        ACL="private", Body=data, Bucket="infinote-audio-files", Key=f"{USER_ID}/{ENTRY_ID}.mp3")
    print("Put file into S3", response)


def get_file(key):
    # Get item from bucket
    response_new = client.get_object(
        Bucket="infinote-audio-files", Key=key)
    data = response_new["Body"].read()
    with open("testpodcastRETURNED.mp3", "wb") as f:
        f.write(data)
