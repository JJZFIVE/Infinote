import boto3
from models import User, Entry

# Setup boto3 client
ACCESS_KEY = "AKIAX6C2X4DBYI5XFIXQ"
SECRET_KEY = "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"
client = boto3.client("s3", aws_access_key_id=ACCESS_KEY,
                      aws_secret_access_key=SECRET_KEY, region_name="us-east-1")


# FILE PATH: USERID/ENTRYID.mp3
# Put file into S3
def boto3_put_file(user_id, entry_id, data):
    USER_ID = str(User.objects(id=user_id).first().id)
    ENTRY_ID = str(Entry.objects(id=entry_id).first().id)
    response = client.put_object(
        ACL="private", Body=data, Bucket="infinote-audio-files", Key=f"{USER_ID}/{ENTRY_ID}")
    print("Put file into S3", response)
    return response


def boto3_get_file(key):
    # Get item from bucket
    response_new = client.get_object(
        Bucket="infinote-audio-files", Key=key)
    data = response_new["Body"].read()
    return data


def boto3_delete_file(key):
    client.delete_object(Bucket="infinote-audio-files", Key=key)
