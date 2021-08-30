from models import User, Entry, UserForJWTToken
import datetime


def create_new_user(firstname, email, username, password, roles):
    if not User.objects(username=username):
        user = User(firstname=firstname, email=email, username=username,
                    password=password, roles=roles)
        user.save()
        return user
    else:
        return User.objects(username=username).first()


def search_for_user_by_username(username):
    user = User.objects(username=username).first()
    return user


def search_for_user_by_id(user_id):
    user = User.objects(id=user_id).first()
    return user


def update_user(user_id):
    return User.objects(id=user_id).first()


def find_entries_for_user(user):
    query = Entry.objects(id__in=user.entry_ids).all()
    entries = list(query)
    return entries


def get_entry(entry_id):
    return Entry.objects(id=entry_id).first()


def new_entry(user_id, name, tags=None):
    entry = Entry()
    entry.name = name
    if tags is not None:
        for tag in tags:
            entry.tags.append(tag)
    # Must save before referencing note.id
    entry.save()
    account = search_for_user_by_id(user_id)
    account.entry_ids.append(entry.id)
    account.save()
    return entry


def change_entry_tags(entry_id, tags, append=False):
    # Tags should be a list. Obviously.
    # Tags entering are in string format (at least right now)
    entry = Entry.objects(id=entry_id).first()
    if not append:
        entry.tags = []
    tags = tags.strip()
    tags = tags.split(",")
    print(tags)
    if tags[0] != "":
        for tag in tags:
            tag = tag.strip()
            entry.tags.append(tag)
    entry.save()
    return entry


def delete_entry_tags(entry_id):
    entry = Entry.objects(id=entry_id).first()
    entry.tags = []
    entry.save()
    return entry

# Need delete user function --> buuuuuut do i?
