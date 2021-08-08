import flask
import datetime
import flask_praetorian
import mongoengine
from .aws_connect import get_file, put_file

"https://www.youtube.com/watch?v=2Gln1VDpHCA"

# Activating virtual environment: source .venv/bin/activate

app = flask.Flask(__name__)
guard = flask_praetorian.Praetorian()
app.config["SECRET_KEY"] = "top secret"
app.config["JWT_ACCESS_LIFESPAN"] = {"hours": 24}
app.config["JWT_REFRESH_LIFESPAN"] = {"days": 30}
PASSWORD = "jjzfivePassword"
DB_NAME = "user-entry"
DB_URI = f"mongodb+srv://jjzfive:{PASSWORD}@infinote-main-cluster.w4wq3.mongodb.net/{DB_NAME}?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE"
# add on end: &ssl_cert_reqs=CERT_NONE
mongoengine.connect(host=DB_URI)


class Entry(mongoengine.Document):
    name = mongoengine.StringField(required=True)
    registered_date = mongoengine.DateTimeField(default=datetime.datetime.now)
    tags = mongoengine.ListField()

    meta = {
        'alias': 'core',
        "collection": "entries"
    }


class User(mongoengine.Document):
    firstname = mongoengine.StringField(required=True)
    email = mongoengine.StringField(required=True)
    username = mongoengine.StringField(required=True)
    password = mongoengine.StringField(required=True)
    roles = mongoengine.StringField(required=True)
    is_active = mongoengine.BooleanField(default=True, server_default="true")
    registered_date = mongoengine.DateTimeField(default=datetime.datetime.now)
    entry_ids = mongoengine.ListField()

    meta = {
        'alias': 'core',
        "collection": "users"
    }

    @property
    def rolenames(self):
        try:
            return self.roles.split(",")
        except Exception:
            return []

    @classmethod
    def lookup(cls, username):
        return cls.objects(username=username).first()

    @classmethod
    def identify(cls, id):
        return cls.objects().get_or_404(id=id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.is_active


guard.init_app(app=app, user_class=User)


def create_new_user(firstname, email, username, password, roles):
    if not User.objects(username=username):
        user = User(firstname=firstname, email=email, username=username,
                    password=guard.hash_password(password), roles=roles)
        user.save()
        return user
    else:
        return User.objects(username=username).first()


def search_for_user_by_username(username):
    user = User.objects(username=username).first()
    return user


def update_user(user_id):
    return User.objects(id=user_id).first()


def find_entries_for_user(user):
    query = Entry.objects(id__in=user.entry_ids).all()
    entries = list(query)
    return entries


def get_entry(entry_id):
    return Entry.objects(id=entry_id).first()


def new_entry(user, name, tags=None):
    entry = Entry()
    entry.name = name
    if tags is not None:
        for tag in tags:
            entry.tags.append(tag)
    # Must save before referencing note.id
    entry.save()
    account = search_for_user_by_username(user.username)
    account.entry_ids.append(entry.id)
    account.save()
    return entry


def change_entry_tags(entry_id, tags, append=False):
    # Tags should be a list. Obviously.
    entry = Entry.objects(id=entry_id).first()
    if not append:
        entry.tags = []
    for tag in tags:
        entry.tags.append(tag)
    entry.save()
    return entry


def delete_entry_tags(entry_id):
    entry = Entry.objects(id=entry_id).first()
    entry.tags = []
    entry.save()
    return entry


user = create_new_user(firstname="Joe", email="jjzfive@gmail.com",
                       username="jjzfive", password="password", roles="admin")
# user = search_for_user_by_username("jjzfive")
# entry = new_entry(user=user, name="First journal entry",tags = ['first', 'coding'])
entry = change_entry_tags("610f23a8854312536f6b9989", [
                          'gosh', 'darn', 'you'], append=True)
user = update_user(user.id)
entries = find_entries_for_user(user)

# Use enumerate to extract index and object from EmbeddedDocumentList
note_dict = {}
for idx, entry in enumerate(entries):
    print(f"{idx + 1}. {entry.name}: {entry.tags}. Id={entry.id}")
    note_dict[idx] = {"name": entry.name, "text": entry.tags}
