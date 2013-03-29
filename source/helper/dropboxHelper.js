
function dropboxHelper() {}

  dropboxHelper.client = {};

  dropboxHelper.connect = function(callbackSuccess, callbackError) { 
    var _this = this;
    var client = new Dropbox.Client({
      key: "lpeVNiL3tbA=|x788bF+1BPiRNPVBsEVpNQMzzXxnRQvH+i19rNMJ+Q==", sandbox: true
    });
    if (!Helper.browser()) {
      client.authDriver(new Dropbox.Drivers.Cordova({
        receiverUrl: "https://dl.dropbox.com/u/1429945/MySongBook/index.html",
        rememberUser: true}));
    } else {      
      client.authDriver(new Dropbox.Drivers.Popup({
        receiverUrl: "https://dl.dropbox.com/u/1429945/MySongBook/index.html",
        rememberUser: true}));
    }
    this.log(client)
    client.authenticate(function(error, client) {
      this.log(client)
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
    dropboxHelper.client.readFile(file, function(error, data, Stat) {
      if (error) {
        callbackError(dropboxHelper.showError(error));
      } else {
        callbackSuccess(data, file, Stat.modifiedAt);  // data has the file's contents
      }
    });
  };
  
  dropboxHelper.writeFile = function(file, content, songt, callbackSuccess, callbackError) { 
    dropboxHelper.client.writeFile(file, content, function(error, Stat) {
      if (error) {
        callbackError(dropboxHelper.showError(error));
      } else {
        callbackSuccess(Stat.modifiedAt, file, content, songt);
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
