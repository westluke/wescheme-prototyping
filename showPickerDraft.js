

    // where is the focus?
    var editor = a ? this.defn : this.interactions.prompt.textContainer;

    // login keys
    var clientId = plt.config.CLIENT_ID;

    // Replace with your own project number from console.developers.google.com.
    // See "Project number" under "IAM & Admin" > "Settings"
    var appId = plt.config.APP_ID;

    // Scope to use to access user's Drive items.
    var scope = 'https://www.googleapis.com/auth/drive.file';

    var pickerApiLoaded = false;
    var oauthToken;

    // Use the Google API Loader script to load the google.picker script.
    function loadPicker() {
        client = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: scope,
            callback: (authResult) => {
                // console.log(authResult);
                if (authResult && !authResult.error) {
                    oauthToken = authResult.access_token;
                    gapi.load('picker', {'callback': onPickerApiLoad});
                } else {
                    alert("There was an error authenticating.  Please make sure you're still logged in to Google.");
                }
                // oauthToken = response;
                // console.log(oauthToken);
            }
        });

        client.requestAccessToken();
    }

    function onPickerApiLoad() {
        pickerApiLoaded = true;
        // console.log("onPickerAPILoad");
        createPicker();
    }

    function handleAuthResult(authResult) {
        // console.log(authResult);
        if (authResult && !authResult.error) {
            oauthToken = authResult.access_token;
            createPicker();
        } else {
            alert("There was an error authenticating.  Please make sure you're still logged in to Google.");
        }
    }

    // Create and render a Picker object for searching images.
    function createPicker() {
        // console.log("before oauthToken check")
        if (pickerApiLoaded && oauthToken) {
            // console.log("here");
            // console.log("secondhere");
            // console.log(oauthToken);
            var view = new google.picker.View(google.picker.ViewId.DOCS);
            view.setMimeTypes("image/png,image/jpeg,image/jpg,image/webp");
            var picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                .setAppId(appId)
                .setOAuthToken(oauthToken)
                .addView(view)
                .addView(new google.picker.DocsUploadView())
                .setDeveloperKey(plt.config.API_KEY)
                .setCallback(pickerCallback)
                .build();
            // console.log(picker);
            picker.setVisible(true);
        }
    }

    // A simple callback implementation.
    function pickerCallback(data) {
        // console.log("asdhj")
        if (data.action == google.picker.Action.PICKED) {
            var doc = data[google.picker.Response.DOCUMENTS][0];
            var url = doc[google.picker.Document.URL];

            var permissions_body = {
                'role': 'reader',
                'type': 'anyone',
                'value': 'default',
                'withLink': true
            };

            gapi.client.load('drive', 'v2', setPermissionsAndInsertCode.bind(this, doc.id, permissions_body));
        }
    }

    // Setting the image permissions for anyone having
    // the link.
    function setPermissionsAndInsertCode(fileId, body) {
        var request = gapi.client.drive.permissions.insert({
            'fileId': fileId,
            'resource': body
        });

        request.execute(function(resp) { });

        // Insert the generated code for producing the image in the 
        // definitions console.
        var code = editor.getCode();
        var curPos = editor.getCursorStartPosition();
        var preCursorCode = code.slice(0, curPos);
        var postCursorCode = code.slice(curPos, code.length);
        var pathToImg = "\"https://drive.google.com/uc?export=download&id=" + fileId + "\"";
        editor.setCode(preCursorCode + "(image-url "+ pathToImg +")"+postCursorCode);
    }

    loadPicker();
