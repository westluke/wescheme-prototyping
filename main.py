from flask import Flask, render_template, request, Response, session, redirect
from google.cloud import datastore
from google.oauth2 import id_token
from google.auth.transport import requests
from datetime import timedelta, UTC, datetime as datetime

import random
import time
import xml.etree.ElementTree as ET

BASE_62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
KEY_FILE = "secretkey"
GMAIL_EXT = "@gmail.com"
KEY_LENGTH = 10
CLIENT_ID = "239382796313-gr5fodbdqpb7uotgpffrdelkgna1gqel.apps.googleusercontent.com"
PROJECT_ID = "wescheme-prototyping"
BATCH_SIZE = 100

client = datastore.Client(PROJECT_ID)
random.seed()
app = Flask(__name__)

# Generate new random keys with:
# $ python -c 'import secrets; print(secrets.token_hex())'
def load_secret_key():
    with open(KEY_FILE, 'r') as f:
        app.secret_key = f.read()

load_secret_key()

# Returns (formatted_email, nickname)
def format_email(email):
    if GMAIL_EXT not in email:
        new_email = email + GMAIL_EXT
    return (new_email, email)

def genkey():
    while True:
        publicId = "".join(random.choices(BASE_62_CHARS, k=KEY_LENGTH))
        query = client.query(kind='Program')
        query.add_filter('publicId_', '=', publicId)
        query_iter = query.fetch(limit=1)

        page = next(query_iter.pages)
        projs = list(page)

        if not projs: return publicId

def get_program_by_id(id_num):
    return client.get(client.Key('Program', id_num))

def get_mime(fp):
    if fp.endswith(".css"):
        return "text/css"
    elif fp.endswith(".js"):
        return "text/javascript"
    elif fp.endswith(".html.jinja") or fp.endswith(".html"):
        return "text/html"
    else:
        return "text/plain"

def logged_in():
    now = datetime.now(UTC)
    ret = (('id_info' in session)
        and ('datetime' in session)
        and (session['datetime'] < now)
        and (now - session['datetime'] < timedelta(seconds=300)))
    if not ret: session.clear()
    return ret

@app.route("/")
def root():
    return render_template("index.html.jinja", logged_in=logged_in())

@app.route("/codemirror5/<path:cm_filepath>")
def get_cm_file(cm_filepath):
    with app.open_resource(f"codemirror5/{cm_filepath}", 'r') as f:
        return Response(f.read(), mimetype=get_mime(cm_filepath))

@app.route("/node_modules/google-closure-library/<path:goog_filepath>")
def get_goog_file(goog_filepath):
    with app.open_resource(f"node_modules/google-closure-library/{goog_filepath}", 'r') as f:
        return Response(f.read(), mimetype=get_mime(goog_filepath))

@app.route("/login", methods=["GET", "POST"])
#Need to carry around an encrypted id token, but how
def login():
    print(request.cookies)
    print(request.form)
    try:
        id_info = id_token.verify_oauth2_token(request.form['credential'], requests.Request(), CLIENT_ID)
        session['id_info'] = id_info
        session['datetime'] = datetime.now(UTC)
        print(id_info)
    except Exception as e:
        print(f"verification failed! exception: {e}")
    return redirect("/")

def viewmaker(page):
    return lambda: render_template(page + ".html.jinja")

for page in ["about", "contact", "privacy", "copyright"]:
    app.add_url_rule("/" + page, endpoint=page, view_func=viewmaker(page))

@app.route("/openEditor")
def open_editor():
    flags=[]
    ctx={}

    if logged_in():
        flags.append('logged_in')
        ctx['name'] = session['id_info']['name']

    if 'publicId' in request.args:
        flags.append('remix')
        ctx['public_id'] = request.args['publicId']

    if 'pid' in request.args:
        flags.append('pid')
        ctx['pid'] = request.args['pid']

    return render_template("open-editor.html.jinja", flags=flags, ctx=ctx)

# Need to do token double submission stuff to guard against CSRF, check SaveProjectServlet
# Emmanuel needs to enable the Firestore API, tell him that tmrw.
# Firestore in datastore mode
# Just use prototyping project I already have
# Get saving/loading of programs done 
# Ok the java impl treats names really weirdly. Realyl really weirdly. So be careful to match that exactly, even though it's bad.
# Ok so it's using the java builtins (HTTPResponse) to set cookies, but it has its own methods for retrieving them, which doesn't make much sense, but fine.
# I need to make sure I can retrieve all past saved programs, and be able to handle every kind of google sign-in.
# But that's not too bad actually.
# Only tricky case should be with custom domains, right. I mean, that impl sucks for so many reasons, but I can manage it...
# Actually wait, since deleted google email addresses can never be reused there shouldn't be any danger, right?
# Yeah, no, just preserve the behavior
# It's SourceCode we need, not ObjectCode. I think ObjectCode is useless now.
# In the Java, the SourceCode list in Program is automatically populated due to ancestry relationships
# Ugh ok they're duplicating work. Both the publicId and the primary key id are unique. whyyyyyy
# Alright well now, I need to know the format the site is expcting for program xml.
# Ok well the xml is just from the Program, not SourceCode. so that part's easy.
# Oh and LoadProject returns JSON bc of course it does why the fuck not
# Yeah no ObjectCode unused, Emmanuel removed it like 8 years ago.
# Copying and pasting sample responses for litsprojects and loadprojects:

'''

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

@app.route("/saveProject", methods=["POST"])
def save_project():
    if not logged_in():
        return ""

    # Make a key that's guaranteed unique
    prog_key = client.key('Program')
    prog = datastore.Entity(prog_key)

    form = request.form
    email, nickname = format_email(session['id_info']['email'])
    publicId = genkey()

    prog.update({
        'author_': email,
        'backlink_': "",
        'isDeleted': False,
        'isSourcePublic': False,
        'mostRecentShare_': 0,
        'owner_': email,
        'publicId_': publicId,
        'published_': False,
        'time_': time.time() * 1000,
        'title_': form['title']
    })

    # At this point, prog_key is completed with an actual id
    client.put(prog)

    src_key = client.key('Program', prog.key.id, "SourceCode")
    src = datastore.Entity(src_key)

    src.update({
        'name': form['title'],
        'src_': form['code']
    })

    client.put(src)
    return ""

# Verify token!!!
  # String passedToken = request.getParameter("idtoken");

  #  // The Console page requires a login: if you come in without the right
  #  // credentials, let's bump them to the login page.
  #  SessionManager sm = new SessionManager(); 
  #  Session s = sm.authenticate(request, response);
  #  if( s == null ) {
  #      UserService us = UserServiceFactory.getUserService();
  #      // Not logged in: we should send them off to the login page.
  #      response.sendRedirect(us.createLoginURL("/login.jsp?idtoken="+passedToken));
  #  } else {


@app.route("/console")
def console():
    if not logged_in():
        return render_template("error.html.jinja", msg="You need to log in to access this page!")

    flags=['logged_in']
    ctx={'name': session['id_info']['name']}

    if 'publicId' in request.args:
        flags.append('remix')
        ctx['public_id'] = request.args['publicId']

    return render_template("console.html.jinja", flags=flags, ctx=ctx)

@app.route("/clone-project")
def clone_project():
    pass

@app.route("/delete-project")
def delete_project():
    pass

@app.route("/image-proxy")
def image_proxy():
    pass

"""
<ProgramDigests>
    <ProgramDigest>
        <id>6556339543736320</id>
        <publicId>PHDTctEsLh</publicId>
        <title>prog0</title>
        <owner>luke_west@alumni.brown.edu@gmail.com</owner>
        <author>luke_west@alumni.brown.edu@gmail.com</author>
        <modified>1677714854460</modified>
        <published>false</published>
        <sharedAs />
    </ProgramDigest>
</ProgramDigests>
"""

def program_digest_from_entity(e):
    dig = ET.Element('ProgramDigest')
    id_xml = ET.Element('id')
    id_xml.text = str(e.key.id)
    publicId_xml = ET.Element('publicId')
    publicId_xml.text = e['publicId_']
    title_xml = ET.Element('title')
    title_xml.text = e['title_']
    owner_xml = ET.Element('owner')
    owner_xml.text = e['owner_']
    author_xml = ET.Element('author')
    author_xml.text = e['author_']
    modified_xml = ET.Element('modified')
    modified_xml.text = str(e['time_'])
    published_xml = ET.Element('published')
    published_xml.text = e['published_']
    sharedAs_xml = ET.Element('sharedAs')
    dig.extend([
        id_xml,
        publicId_xml,
        title_xml,
        owner_xml,
        author_xml,
        modified_xml,
        published_xml,
        sharedAs_xml
    ])
    return dig

# Ok there is both ObjectCode and SourceCode. Which one is right?????
@app.route("/listProjects")
def list_projects():
    # Nope this doesn't work because these aren't the primary keys. Fuck. This has to be a query.
    # key = client.Key('Program', "danny.yoo@gmail.com")

    if not logged_in():
        return ""

    query = client.query(kind='Program')
    query.add_filter('author_', '=', format_email(session['id_info']['email'])[0])
    query.order = ['-time_']
    query_iter = query.fetch(limit=BATCH_SIZE)

    page = next(query_iter.pages)
    projs = list(page)
    next_cursor = query_iter.next_page_token

    digs = ET.Element("ProgramDigests")
    for proj in projs:
        digs.append(program_digest_from_entity(proj))

    # return ET.tostring(digs)
    return Response(ET.tostring(digs), mimetype="text/xml")

    # Other missing things I just noticed:
    # I need to add back in documentation
    # I need to make sure requires can bring in the teachpacks like they do in the original.

@app.route("/load-project")
def load_project():
    pass

@app.route("/share-project")
def share_project():
    pass



"""

Potentially unnecessary according to Emmanuel

@app.route("/administrate")
def administrate():
    pass

@app.route("/run")
def run():
    pass

@app.route("/dumpFeedback")
def dumpFeedback():
    pass

@app.route("/addFeedback")
def addFeedback():
    pass

@app.route("/view")
def view():
    pass

@app.route("/logout")
def logout():
    pass

@app.route("/heartbeat")
def heartbeat():
    pass

@app.route("/createUser")
def createUser():
    pass

@app.route("/remoteAPI")
def remoteAPI():
    pass

@app.route("/keyServer")
def keyServer():
    pass
"""
            
if __name__ == "__main__":
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask"s development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host="127.0.0.1", port=8080, debug=True, use_evalex=False)
