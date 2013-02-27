
function dropboxHelper() {}

  dropboxHelper.client = {};

  dropboxHelper.connect = function(callbackSuccess, callbackError) { 
    var _this = this;
    var client = new Dropbox.Client({
      key: "lpeVNiL3tbA=|x788bF+1BPiRNPVBsEVpNQMzzXxnRQvH+i19rNMJ+Q==", sandbox: true
    });
    if (!Helper.browser()) {
      client.authDriver(new Dropbox.Drivers.Cordova({
        rememberUser: true}));
    } else {      
      client.authDriver(new Dropbox.Drivers.Popup({
        receiverUrl: "https://dl.dropbox.com/u/1429945/MySongBook/index.html",
        rememberUser: true}));
    }      
    client.authenticate(function(error, client) {
      if (error) {
        callbackError(_this.showError(error));
      } else {
        _this.client = client;
        client.getUserInfo(function(error, userInfo) {
          if (error) {
            callbackError(_this.showError(error));
          } else {
            enyo.log(userInfo.name + $L(" connected to Dropbox"));
            callbackSuccess();
          }
        });
      }
    });
  };

  dropboxHelper.showError = function(error) {
    switch (error.status) {
    case 401:
      return "The user token expired.";

    case 404:
      return "The file or folder you tried to access is not in the user's Dropbox.";

    case 507:
      return "The user is over their Dropbox quota.";

    case 503:
      return "Too many API requests.";

    case 400:
      return "Bad input parameter";
      
    case 403:
      return "Bad OAuth request.";
      
    case 405: 
      return "Request method not expected";
    
    default:
      return "An error occured! Please refresh the library";
    }
  };

  dropboxHelper.readDir = function(callbackSuccess, callbackError) { 
    dropboxHelper.client.readdir("/", function(error, entries) {
      if (error) {
        callbackError(dropboxHelper.showError(error));
      } else {
        callbackSuccess(entries);
      }  
    });
  };
  
  dropboxHelper.readFile = function(file, callbackSuccess, callbackError) { 
    dropboxHelper.client.readFile(file, function(error, data) {
      if (error) {
        callbackError(dropboxHelper.showError(error));
      } else {
        callbackSuccess(data, file);  // data has the file's contents
      }
    });
  };
  
  dropboxHelper.writeFile = function(file, content, songt, callbackSuccess, callbackError) { 
    dropboxHelper.client.writeFile(file, content, function(error, stat) {
      if (error) {
        callbackError(dropboxHelper.showError(error));
      } else {
        callbackSuccess(stat.revisionTag, file, content, songt);
      }
    });
  };
  
  dropboxHelper.deleteFile = function(file, callbackSuccess, callbackError) { 
    dropboxHelper.client.remove(file, function(error, status) {
      if (error) {
        callbackError(dropboxHelper.showError(error));
      } else {
        callbackSuccess(status, file);  
      }
    });
  };
  
  dropboxHelper.signOut = function(callbackSuccess) {
    var _this = this;
    return this.client.signOut(function(error) {
      if (error) {
        enyo.log(dropboxHelper.showError(error));
      } else {
        callbackSuccess();
      }
    });
  };
