import mongoengine
import datetime


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


class UserForJWTToken:
    def __init__(self, id, roles):
        self.id = id
        self.roles = roles

    @property
    def rolenames(self):
        try:
            return self.roles.split(",")
        except Exception:
            return []

    @property
    def identity(self):
        return self.id
