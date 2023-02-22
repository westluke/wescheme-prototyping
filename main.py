# import datetime

from flask import Flask, render_template, request, Response
from google.cloud import datastore
from google.oauth2 import id_token
from google.auth.transport import requests
import datetime

# from google.auth.transport import requests
# from google.cloud import datastore
# import google.oauth2.id_token

app = Flask(__name__)

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
    # client = datastore.Client("wescheme-prototyping")

    # # key is one where Datastore will automatically generate an Id
    # key = client.key("Task")

    # # Create an unsaved Entity object, and tell Datastore not to index the
    # # `description` field
    # task = datastore.Entity(key, exclude_from_indexes=("description",))

    # # Apply new field values and save the Task entity to Datastore
    # task.update(
    #     {
    #         "created": datetime.datetime.now(tz=datetime.timezone.utc),
    #         "description": "asldhj",
    #         "done": False,
    #     }
    # )
    # client.put(task)
    return render_template("index.html.jinja")

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
    # print(request.method)
    # print(request.form)
    print(request.cookies)
    print(request)
    # if request.cookies.get("g_csrf_token"))
    # Firefox seems to be blocking the g_csrf_token. Not sure how to prevent that at the moment.
    # Need to narrow it down more.
    idinfo = id_token.verify_oauth2_token(request.form['g_csrf_token'], requests.Request(), "239382796313-gr5fodbdqpb7uotgpffrdelkgna1gqel.apps.googleusercontent.com")
    print(idinfo)

    # If it authenticates, issue session.
    # If authentication fails, try to do alternative authentication???
    # The alternative authentication doesn't make much sense, don't do that.


    return ""
    # if (request.method == 'POST'):
        
        
    
    
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

@app.route("/open-editor")
def open_editor():
    return render_template("open-editor.html.jinja")

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

@app.route("/save-project")
def save_project():
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

@app.route("/console")
def console():
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
