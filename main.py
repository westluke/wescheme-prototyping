from flask import Flask, render_template, request, Response, session, redirect
from google.cloud import datastore
from google.oauth2 import id_token
from google.auth.transport import requests
from datetime import datetime as datetime


app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

client = datastore.Client("wescheme-prototyping")

# datastore_client = datastore.Client()
# firebase_request_adapter = requests.Request()

def get_mime(fp):
    if fp.endswith(".css"):
        return "text/css"
    elif fp.endswith(".js"):
        return "text/javascript"
    elif fp.endswith(".html.jinja") or fp.endswith(".html"):
        return "text/html"
    else:
        return "text/plain"

@app.route("/")
def root():
    return render_template("index.html.jinja", logged_in=('idinfo' in session))

@app.route("/codemirror5/<path:cm_filepath>")
def get_cm_file(cm_filepath):
    with app.open_resource(f"codemirror5/{cm_filepath}", 'r') as f:
        return Response(f.read(), mimetype=get_mime(cm_filepath))

@app.route("/node_modules/google-closure-library/<path:goog_filepath>")
def get_goog_file(goog_filepath):
    with app.open_resource(f"node_modules/google-closure-library/{goog_filepath}", 'r') as f:
        return Response(f.read(), mimetype=get_mime(goog_filepath))

@app.route("/login", methods=["GET", "POST"])
def login():

    print(request.cookies)
    print(request.form)

    try:
        idinfo = id_token.verify_oauth2_token(request.form['credential'], requests.Request(), "239382796313-gr5fodbdqpb7uotgpffrdelkgna1gqel.apps.googleusercontent.com")
        session['idinfo'] = idinfo
        print(idinfo)
    except Exception as e:
        print(f"verification failed! exception: {e}")

    return redirect("/")

# @app.route("/about")
# def about():
#     # print("HEREERREREE")
#     return render_template("about.html.jinja")

# @app.route("/*")
# def ugh():
    

def viewmaker(page):
    return lambda: render_template(page + ".html.jinja")

for page in ["about", "contact", "privacy", "copyright"]:
    app.add_url_rule("/" + page, endpoint=page, view_func=viewmaker(page))

@app.route("/openEditor")
def open_editor():
    flags=[]
    ctx={}

    if 'idinfo' in session:
        flags.append('logged_in')
        ctx['name'] = session['idinfo']['name']

    if 'publicId' in request.args:
        flags.append('remix')
        ctx['public_id'] = request.args['publicId']

    return render_template("open-editor.html.jinja", flags=flags, ctx=ctx)

@app.route("/saveProject", methods=["POST"])
def save_project():
    # Need to do token double submission stuff to guard against CSRF, check SaveProjectServlet

    if not 'idinfo' in session:
        return ""

    # This key is incomplete, Datastore will automatically generate an Id upon insertion
    key = client.key("Program")

    # Emmanuel needs to enable the Firestore API, tell him that tmrw.

    form = request.form
    print(form)

    prog = datastore.Entity(key)
    prog.update({
        'title': request.form['title'],
        'code': request.form['code'],
        'token': request.form['token'],
        'after_luke': True,
        'public': True,
        'deleted': False,
        'srcs': [],
        'owner': session['idinfo']['name'],
        'time': datetime.now(),
        'published': False,
        'backlink': "",
        'mostRecentShare': datetime.now(),
        'notes': ""
    })

    client.put(prog)
    return ""

@app.route("/console")
def console():
    return render_template("open-editor.html.jinja", flags=flags, ctx=ctx)

@app.route("/clone-project")
def clone_project():
    pass

@app.route("/delete-project")
def delete_project():
    pass

@app.route("/image-proxy")
def image_proxy():
    pass

@app.route("/list-projects")
def list_projects():
    pass

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
    app.run(host="127.0.0.1", port=8080, debug=True)
