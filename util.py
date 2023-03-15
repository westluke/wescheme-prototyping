from flask import Flask, render_template, request, Response, session, redirect
from flask_caching import Cache
from google.cloud import datastore
import random
import time

BASE_62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
KEY_FILE = "secretkey"
GMAIL_EXT = "@gmail.com"
KEY_LENGTH = 10
CLIENT_ID = "239382796313-gr5fodbdqpb7uotgpffrdelkgna1gqel.apps.googleusercontent.com"
PROJECT_ID = "wescheme-prototyping"
BATCH_SIZE = 1000
TOKEN_LENGTH = 20

client = datastore.Client(PROJECT_ID)

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}

cache = Cache(config=config)
app = Flask(__name__)
cache.init_app(app)

# Generate new random keys with:
# $ python -c 'import secrets; print(secrets.token_hex())'
def load_secret_key():
    with open(KEY_FILE, 'r') as f:
        app.secret_key = f.read()

# Returns (formatted_email, nickname)
def format_email(email):
    if GMAIL_EXT not in email:
        new_email = email + GMAIL_EXT
    return (new_email, email)

def randtoken():
    return "".join(random.choices(BASE_62_CHARS, k=TOKEN_LENGTH))

def get_mime(fp):
    if fp.endswith(".css"):
        return "text/css"
    elif fp.endswith(".js"):
        return "text/javascript"
    elif fp.endswith(".html.jinja") or fp.endswith(".html"):
        return "text/html"
    elif fp.endswith(".png"):
        return "image/png"
    elif fp.endswith(".svg"):
        return "image/svg"
    else:
        return "text/plain"

def epoch_time():
    return int(time.time() * 1000)

'''
Full program response format:
{
    "owner":"luke_west@alumni.brown.edu@gmail.com",
    "isSourcePublic":false,
    "notes":"",
    "author":"luke_west@alumni.brown.edu@gmail.com",
    "source":
        {
            "src":"(define x \"This is Program 0\")\n(display x)",
            "name":"Unknown"
        },
    "published":false,
    "title":"prog0",
    "permissions":[],
    "provides":[],
    "modified":1677714854460,
    "id":6556339543736320,
    "sharedAs":[],
    "publicId":"PHDTctEsLh"
}
'''
