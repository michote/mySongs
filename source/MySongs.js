// #################
//
// Copyright (c) 2012-2013 Micha Reischuck and John Carragher
//
// mySongs is available under the terms of the MIT license. 
// The full text of the MIT license can be found in the LICENSE file included in this package.
//
// #################

enyo.Scroller.touchScrolling = true;
//~ enyo.setLogLevel(0); // The default log level is 99. enyo.log/this.log will output if the level is 20 or above, enyo.warn at 10, and enyo.error at 0.

enyo.kind({
  name: "mySongs",
  fit: true,
  realtimeFit: true,
  // Properties
  pathCount: {"a": [], "b": []},
  newSong: false,
  textSrce: "",
  online: undefined,
  databaseOn: false,
  silent: false,
  published: {
    dataList: {},
    libraryList: {"content": []},
    savedLists: {"data": [], "sync": null, "modified": null},
    customList: false,
    searchList: {"content": []},
    css: undefined,
    currentList: "libraryList",
    sync: "auto",
    currentIndex: undefined,
    dropboxDate: 0,
    db: undefined
  },
  components: [
    {kind: "Signals", ondeviceready: "deviceReadyHandler"},
    // Layout
    {kind: "Panels", name: "infoPanels", classes: "enyo-fit", arrangerKind: "CollapsingArranger", draggable: false, realtimeFit: true, components: [
      {kind: "Panels", name: "mainPanels", onTransitionFinish: "doResizeLyrics", classes: "app-panels inner-panels", arrangerKind: "CollapsingArranger", draggable: false, realtimeFit: true, narrowFit: false, components: [
        {name: "songListPane", kind: "SongList"},
        {name: "viewPane", kind: "ViewPane", style: "height: 100%;"}
      ]},
      {name: "sidePane", kind: "SidePane", style: "height: 100%;"}
    ]},
    {name: "newSongDialog", kind: "onyx.Popup", style: "padding: 1rem;", centered: true, modal: true, floating: true, scrim: true, components: [
      {kind: "FittableRows", style: "padding: .5rem; background-color: rgba(255, 255, 255, 0.5)", components: [
        {kind: "FittableColumns", style: "width: 100%;", components: [
          {content: $L("New song"), tag: 'b', fit: true, style: "font-size: 1.2rem;"},
          {kind: "onyx.Button", style: "color: #fff;", content: $L("Import"), ontap: "openImportSong"}
        ]},
        {kind: "onyx.InputDecorator", style: "width: 14.75rem; margin-top: .5rem;", components: [
          {name: "songName", kind: "onyx.Input", placeholder: $L("Enter songname"), style: "width: 100%;"} //onchange: "createSong"},
        ]},
        {components: [
          {kind: "onyx.Button", classes: "onyx-negative", style: "margin: .5rem 0 0;", content: $L("Cancel"), ontap: "closeCreateSong"},
          {kind: "onyx.Button", classes: "onyx-affirmative", style: "margin: .5rem 0 0 .5rem;", content: $L("Save"), ontap: "createSong"}
        ]}
      ]}
    ]},

  ],
  
  // respond to phonegap deviceready event
  deviceReadyHandler: function() {
    this.log("phonegap deviceready");
    if (!enyo.platform.webos) { // webos testing
      this.connect();
      var ol = enyo.bind(this, this.isOnline);
      document.addEventListener("offline", ol, false);
      document.addEventListener("online", ol, false);
    }
  },
  
  create: function() {
    this.inherited(arguments);
    this.getPreferences();
    // online status
    this.online = navigator.onLine;
    this.log("online:", this.online);
    // creating Database
    if (!enyo.platform.firefox) { // not Firefox
      this.databaseOn = true;
      this.createComponent({ 
        name: "mySongsDbase", 
        kind: "onecrayon.Database",
        database: 'ext:ms_database',
        version: '',
        estimatedSize: 5000000,
        debug: true,
        owner: this
      });
    }
    // Connect to Dropbox
    if (Helper.browser()) {
      var ol = enyo.bind(this, this.isOnline);
      window.addEventListener("offline", ol, false);
      window.addEventListener("online", ol, false);
      this.connect();
    }
    this.log("database on", this.databaseOn);
    if (this.databaseOn) {
      this.openMyDatabase();
    }
  },
  
  rendered: function() {
    this.inherited(arguments);
    this.log();
    if (navigator.splashscreen && enyo.platform.android) {
      setTimeout(function() {navigator.splashscreen.hide();}, 800);
    }
  },

  isOnline: function(x) {
    this.log("now", x.type);
    this.online = (x.type === "online");
    if (this.online && (this.sync === "auto")) {
      this.log("upload offline changes to Dropbox");
      this.silent = true;
      var success = enyo.bind(this, this.connect);
      setTimeout(success, 2000);
    }
  },
  
  connect: function() {
    this.log("sync prefs: ", this.sync);
    if ((this.sync !== "manual") && this.online) {
      if (dropboxHelper.client.uid) {
        this.readDirectory(); 
      } else {
        this.connectToDropbox();
      }
    } else if (this.databaseOn) {
      this.initDatabaseRead();
    }
  },

  connectToDropbox: function() {
    this.log("Connecting to Dropbox, please confirm the popup if any");
    if (!this.silent) {
      this.$.songListPane.$.readFiles.setContent($L("Connecting..."));
      this.$.songListPane.$.readProgress.setMax(3);
      this.$.songListPane.$.readProgress.animateProgressTo(1);
      this.$.songListPane.$.listPane.setIndex(0);
    } else {
      this.$.songListPane.$.searchSpinner.show();
    }
    var success = enyo.bind(this, this.readDirectory);
    var error = enyo.bind(this, this.connectError);
    setTimeout(function() {dropboxHelper.connect(success, error);}, 20);
  },
  
  // Refresh Library
  refreshLibrary: function() {
    this.log("refreshing library ...");
    this.libraryList.content = [];
    this.$.songListPane.$.library.setDisabled(true);
    this.$.songListPane.$.library.setValue(true);
    this.$.songListPane.$.list.setDisabled(true);
    this.$.songListPane.goToSync();
    if (this.online) {
      this.connect();
    } else if (this.databaseOn) {
      this.readFilesFromDatabase();
    }
  },
  
  connectError: function(error) {
    this.$.songListPane.showError($L("Connection error: ") + error);
    enyo.error("Connection error: ", error);
    this.$.songListPane.goToLibrary();
    this.$.songListPane.$.library.setValue(false);
    this.online = false;
  },
  
  dropboxError: function(error) {
    this.$.songListPane.showError($L("Dropbox error: ") + error);
    enyo.error("Dropbox error: ", error);
    this.$.songListPane.goToLibrary();
    this.$.songListPane.$.library.setValue(false);
  },
  
  // Dropbox Logout
  signOut: function() {
    this.log("signing out from dropbox ...");
    var success = enyo.bind(this, this.signOutSuccess);
    dropboxHelper.signOut(success);
  },
  
  signOutSuccess: function() {
    this.log();
    this.$.viewPane.$.preferences.setDropboxClient(false); // Hide Logout Button 
    this.$.songListPane.$.listPane.setIndex(6);
    this.log("successfully logged out from Dropbbox");
  },
  
  openMyDatabase: function() {
    this.log();
    this.db = this.$.mySongsDbase;
    //this.db.query('DROP TABLE IF EXISTS "songs"');
    //this.db.query('DROP TABLE IF EXISTS "changes"');
    this.db.query("SELECT COUNT(*) FROM 'songs';" , {
      onError: enyo.bind(this, function(error){
        this.log("Error: ("+error.message+") Need to create tables from JSON now");     
        this.db.setSchema(
          [
            {
              "table": "songs",
              "columns": [
                { 
                  "column": "filename",
                  "type": "TEXT",
                  "constraints": ["PRIMARY KEY"]
                },
                {
                  "column": "title",
                  "type": "TEXT"
                },
                {
                  "column": "xml",
                  "type": "TEXT"
                },
                {
                  "column": "date",
                  "type": "INTEGER"
                }
              ]
            },
            {
              "table": "changes",
              "columns": [
                { 
                  "column": "filename",
                  "type": "TEXT",
                  "constraints": ["PRIMARY KEY"]
                },
                {
                  "column": "action",
                  "type": "TEXT"
                }
              ]
            }
          ]
        );  
      })
    });
  },
  
  dbError: function() {
    this.log();
    //this.$.songListPane.showError($L("Database error: "));
    this.$.songListPane.goToLibrary();
    this.$.songListPane.$.library.setValue(false);
  },
  
  //Reading files in database
  initDatabaseRead: function() {   // no Dropbox
    this.log();
    this.$.songListPane.$.readFiles.setContent($L("Connecting..."));
    this.$.songListPane.$.readProgress.setMax(3);
    this.$.songListPane.$.readProgress.animateProgressTo(1);
    this.$.songListPane.$.listPane.setIndex(0);
    this.libraryList.content = [];
    this.readFilesFromDatabase();
  },
  
  readFilesFromDatabase: function() {
    this.log("reading filenames from database...");
    this.pathCount.a = [];
    this.pathCount.b = [];
    this.libraryList.content = [];
    this.$.songListPane.$.readProgress.animateProgressTo(2);
    var sqlObj = this.db.getSelect("songs", ["filename"]);
    var success = enyo.bind(this, this.handleDatabaseFiles);
    var error = enyo.bind(this, this.dbError);
    this.db.query(sqlObj, {"onSuccess": success, "onError": error}); // how many songs?
  },

  handleDatabaseFiles: function(select) {
    this.$.songListPane.$.readProgress.animateProgressTo(3);
    if (select.length === 0) {
      this.log("no files in Database: first use?");
      this.$.songListPane.$.listPane.setIndex(5);
    } else {
      this.log(select.length + " files to parse ...");
      this.$.songListPane.$.readProgress.setProgress(0);
      this.$.songListPane.$.readProgress.setMax(select.length+1);
      this.$.songListPane.$.readFiles.setContent($L("Reading files..."));
      for (i = 0; i < select.length; i++) {
        if (select[i].filename.split('.').pop() === 'xml') { // only parse xml-files
          this.pathCount.a.push({"idx":i, "file": select[i].filename});
          this.log("reading dbase file", i+1, "of", select.length);
          var sqlObj = this.db.getSelect("songs", '', {"filename": select[i].filename});
          var success = enyo.bind(this, this.gotDatabaseFile);
          var error = enyo.bind(this, this.dbFileNotRead);
          this.db.query(sqlObj, {"onSuccess": success, "onError": error});
        }
      }
    }
  },
  
  gotDatabaseFile: function(select) {
    this.log();
    var file = select[0].filename;
    var title = select[0].title;
    var data = select[0].xml;
    this.log("Got database file");  
    var xml = ParseXml.parse_dom(data);
    this.dataList[file.toLowerCase()] = xml;
    var a = {"file": file, "title": title};
    this.log(file, "parsed");
    this.libraryList.content.push(a);
    this.fileDone(a.title);    
  },
  
  dbFileNotRead: function() {
    this.log("Error reading database file");
  },
  
  // Reading files in Dropbox App-Folder
  readDirectory: function() {
    this.log();
    this.pathCount.a = [];
    this.pathCount.b = [];
    if (!this.silent) {
      this.libraryList.content = [];
      this.log("reading app directory...");
      this.$.songListPane.$.readProgress.animateProgressTo(2);
    } else {
      this.$.songListPane.$.searchSpinner.show();
    }
    this.$.viewPane.$.preferences.setDropboxClient(true); // Show Logout Button 
    var success = enyo.bind(this, this.handleDropboxfiles);
    var error = enyo.bind(this, this.dropboxError);
    dropboxHelper.readDir(success, error);
  },
  
  handleDropboxfiles: function(files, modified) {
    this.log();
    if (!this.silent) {
      this.$.songListPane.$.readProgress.animateProgressTo(3);
    }  
    if (files.length === 0) {
      this.log("no files in Dropbox: first use?");
      this.$.songListPane.$.listPane.setIndex(5);
    } else {
      this.log(files.length + " files to parse ...");
      if (!this.silent) {
        this.$.songListPane.$.readProgress.setProgress(0);
        this.$.songListPane.$.readProgress.setMax(files.length+1);
        this.$.songListPane.$.readFiles.setContent($L("Reading Files..."));
      }
      var success = enyo.bind(this, this.gotDropboxFile);
      var successlist = enyo.bind(this, this.gotListFile);
      var error = enyo.bind(this, this.dropboxError);
      for (i = 0; i < files.length; i++) {
        if (files[i].split('.').pop() === 'xml') { // only parse xml-files
          this.pathCount.a.push({"idx":i, "file": files[i]});
          this.log("parsing dropbox file", i+1, "of", files.length, files[i]);
          dropboxHelper.readFile(files[i], success, error);
        } else if (files[i] === 'lists.json') {
          dropboxHelper.readFile(files[i], successlist, error);
        }
      }
    }
  },
  
  gotDropboxFile: function(data, file, modified) {
    this.log(modified);
    var xml = ParseXml.parse_dom(data);
    if (ParseXml.get_titles(xml)) { // check for valid title before adding to library
      this.dataList[file.toLowerCase()] = xml;
      var a = {"file": file, "title": ParseXml.get_titles(xml)[0].title};
      if (!this.silent) {
        this.libraryList.content.push(a);
      }
      if (this.databaseOn) {
        var modDate = xml.childNodes[0].attributes["modifiedDate"].value;
        var dropboxFileObj = {"filename": file, "title": a.title, "xml": data,"date": Date.parse(modDate)}; 
        var sqlObj = this.db.getSelect("songs", '', {"filename": file});
        var success = enyo.bind(this, this.processDbRecord, dropboxFileObj);
        this.log("attempting to read db file : " + file);
        this.db.query(sqlObj, {"onSuccess": success});
      } else {
        this.fileDone(a.title);
      }
    }
  },
  
  processDbRecord: function(dboxFileObj, result) {
    // result[] contains the database record corresponsing to dboxFileObj
    this.log();
    if (result.length !== 0) {
      this.log(dboxFileObj.filename);
      var success = enyo.bind(this, this.fileDone, result[0].title);
      if (result[0].date < dboxFileObj.date) {
        // dropbox file newer
        if (this.silent) {  // was offline
          this.updateLibraryData(dboxFileObj);
        }
        this.log("Upating database from Dropbox file ", dboxFileObj.filename);
        var error = enyo.bind(this, this.dbfileNotUpdated, dboxFileObj.filename);
        var sqlObj = this.db.getUpdate("songs", dboxFileObj, {"filename": dboxFileObj.filename});
        this.db.query(sqlObj, {"onSuccess": success, "onError": error});
      } else if (result[0].date > dboxFileObj.date) {
        // dropbox file older
        this.log("Upating dropbox with newer ", result[0].filename);
        var error = enyo.bind(this, this.dropboxError);
        dropboxHelper.writeFile(result[0].filename, result[0].xml, result[0].title, success, error);
        this.dataList[result[0].filename.toLowerCase()] = ParseXml.parse_dom(result[0].xml);
      } else if (result[0].date === dboxFileObj.date) {
        this.fileDone(dboxFileObj.title);  // same date or not in database
      }
    } else {
      this.log("Extra Dropbox file ", dboxFileObj.filename);
      var sqlObj = this.db.getSelect("changes", '', {"filename": dboxFileObj.filename, "action": "deleted"});
      var success = enyo.bind(this, this.checkDbDelete, dboxFileObj);
      this.db.query(sqlObj, {"onSuccess": success});
    }
  },

  updateLibraryData: function(dboxFileObj) {
    this.log("Upating library from Dropbox file", dboxFileObj.filename);
    for (i in this.libraryList.content) {
      if (this.libraryList.content.file === dboxFileObj.filename) {
        this.libraryList.content.title = dboxFileObj.title;  // title may have changed
      break;
      }
    }
    this.dataList[dboxFileObj.filename.toLowerCase()] = ParseXml.parse_dom(dboxFileObj.xml);
  },

  checkDbDelete: function(dboxFileObj, select) {
    // select[] contains any changes.deleted entry for the extra dropbox file
    this.log();
    if (select.length !== 0) {
      this.log(dboxFileObj.filename, " was deleted offline, deleting from Dropbox");
      var success = enyo.bind(this, this.removeFromLibrary, dboxFileObj.filename);
      var error = enyo.bind(this, this.dropboxError);
      dropboxHelper.deleteFile(dboxFileObj.filename, success, error);
    } else {
      this.log(dboxFileObj.filename, " created externally, being added to the database");
      if (this.silent) {  // if was offline need to add to the library
        this.log("and library");
        this.libraryList.content.push({'file': dboxFileObj.filename, 'title': dboxFileObj.title});
        this.dataList[dboxFileObj.filename.toLowerCase()] = ParseXml.parse_dom(dboxFileObj.xml);
      }
      var success = enyo.bind(this, this.fileDone, dboxFileObj.filename);
      var modDate = dboxFileObj.xml.slice(dboxFileObj.xml.indexOf("modifiedDate")+14);
      modDate = modDate.substring(0,modDate.indexOf('"',1));
      dboxFileObj.date = Date.parse(modDate);
      this.db.insertData({"table": "songs", data: dboxFileObj}, {"onSuccess": success});
    }
  },
  
  removeFromLibrary: function(file) {
    this.log(file);
    var i = 0;
    while (i < this.libraryList.content.length) {
      if (this.libraryList.content[i].file === file) {
        this.libraryList.content.splice(i,1);
        this.pathCount.a.splice(i,1);
        this.pathCount.b.splice(i,1);
        break;
      }  
    i++;
    }
    var success = enyo.bind(this, this.checkAllDone);
    var sqlObj = this.db.getDelete("changes", {"filename": file});
    this.db.query(sqlObj, {"onSuccess": success});
  },
  
  dbfileNotUpdated: function(file) {
    this.log(file);
  },
  
  fileDone: function(songt) {
    this.pathCount.b.push(1);
    this.log(this.pathCount.b.length, songt);
    if (!this.silent) {
      this.$.songListPane.$.readProgress.animateProgressTo(this.pathCount.b.length);
    }
    this.checkAllDone();
  },

  checkAllDone: function() {
    this.log(this.pathCount.b.length, this.pathCount.a.length);
    if (this.pathCount.b.length === this.pathCount.a.length) {  // loaded all files from source
      this.sortAndRefresh();
      if (this.online && this.databaseOn) { // update the database
        // get dbase entries (filename, title, xml, date)
        var sqlObj = this.db.getSelect("songs", '');
        var success = enyo.bind(this, this.doExtraDbFiles);
        this.db.query(sqlObj, {"onSuccess": success});
      }
    }
  },
  
  doExtraDbFiles: function(select) {
    // select[] is all dbase files
    for (i in select) { 
      var found = false; 
      for (j in this.pathCount.a) { // each dropbox file
        if (select[i].filename === this.pathCount.a[j].file) {
          found = true;
        }
      }
      if (!found) { //extra db file 
        // dbase file not in dropbox is it in changes table as created
        var sqlObj = this.db.getSelect("changes", '', {"filename": select[i].filename, "action": "created"});
        var success = enyo.bind(this, this.checkDbCreate, select[i]);
        this.db.query(sqlObj, {"onSuccess": success});
      }
    }
  },
  
  checkDbCreate: function(dbFile, select) {
    // select[] is changes.created record for the extra database file
    this.log();
    if (select.length !== 0) {
      this.log(dbFile.filename, " was created offline, adding to Dropbox");
      var error = enyo.bind(this, this.dropboxError);
      var success = enyo.bind(this, this.dboxFileAdded, dbFile);
      dropboxHelper.writeFile(dbFile.filename, dbFile.xml, dbFile.title, success, error);
    } else {
      this.log(dbFile.filename, " was not created offline, deleting from database");
      var success = enyo.bind(this, this.sortAndRefresh);
      var sqlObj = this.db.getDelete("songs", {"filename": dbFile.filename});
      this.db.query(sqlObj, {"onSuccess": success});
    }  
  },

  dboxFileAdded: function(dbFile) {
    this.log();
    if (!this.silent) {  // if was offline was already added to the library
      this.libraryList.content.push({'file': dbFile.filename, 'title': dbFile.title});
      this.dataList[dbFile.filename.toLowerCase()] = ParseXml.parse_dom(dbFile.xml);
    }
    var success = enyo.bind(this, this.sortAndRefresh);
    var sqlObj = this.db.getDelete("changes", {"filename": dbFile.filename});
    this.db.query(sqlObj, {"onSuccess": success});
  },
    
  // Sort Library alphabetically
  sortByTitle: function (a,b) {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1;
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return 1;
    }
    return 0;
  },
  
  sortAndRefresh: function(file) {
    this.log();
    this.libraryList.content.sort(this.sortByTitle);
    // Switch to libraryPane
    this.$.songListPane.goToLibrary();
    this.$.songListPane.$.library.setDisabled(false);
    this.$.songListPane.$.list.setDisabled(false);
    this.$.songListPane.$.library.setValue(true);
    this.$.songListPane.$.searchSpinner.hide();
    // select file when given
    var fi;
    if (file) {
      this.log("file to select", file);
      for (i in this.libraryList.content) {
        if (this.libraryList.content[i].file === file) {
          fi = i;
          this.currentIndex = i;
          break;
        }
      }
    } else if (this.currentIndex) {
      fi = this.currentIndex;
    }
    if (fi && this.silent) {
      this.$.songListPane.$.libraryList.scrollToRow(fi);
      this.$.songListPane.$[(this.currentList === "searchList") ? "libraryList" : this.currentList].select(fi);
    } else if (fi) {
      this.log(fi);
      this.$.songListPane.$[(this.currentList === "searchList") ? "libraryList" : this.currentList].select(fi);
      this.$.songListPane.$.libraryList.scrollToRow(fi);
      this.openSong(fi);
    }
  },
  
  findIndex: function() {
    for (i in this.libraryList.content) {
      if (this.searchList.content.length > 0 && this.currentIndex >= 0 && this.libraryList.content[i].file === this.searchList.content[this.currentIndex].file) {
        this.setCurrentIndex(i);
        break;
      }
    }
  },
  
  // Open Song
  openSong: function(index) {
    this.log("open song: ", this[this.currentList].content[index].file);
    //~ this.$.songListPane.$[(this.currentList === "searchList") ? "libraryList" : this.currentList].select(index);
    this.$.viewPane.$.songViewPane.setFirst(true);
    this.$.viewPane.$.songViewPane.setFile(this[this.currentList].content[index].file);
    this.$.viewPane.$.songViewPane.start();
    this.$.viewPane.$.songViewPane.$.viewScroller.setScrollTop(0);
    this.$.viewPane.$.viewPanels.setIndex(1);
    this.handleSidepane();
    !Helper.phone() || this.$.mainPanels.setIndex(1);
  },
  
  handleSidepane: function() {
    this.log("sidepane: ", this.$.sidePane.$.Pane.getIndex());
    switch(this.$.sidePane.$.Pane.getIndex()) {
      case 1: if (this.$.infoPanels.getIndex() === 1) {
                this.$.viewPane.$.songViewPane.showInfo();
              }
              break;
              
      case 2: break;
      
      default:
        this.$.infoPanels.setIndex(0);
    }
  },
  
  currentIndexChanged: function() {
    this.log(this.currentIndex);
    this.silent = false;  // changed song, so okay
    if (this.currentIndex >= 0) {
      this.$.songListPane.$[(this.currentList === "searchList") ? "libraryList" : this.currentList].select(this.currentIndex);
      this.openSong(this.currentIndex);
    } else {
      this.$.songListPane.$[this.currentList].refresh();
    }
  },
  
  // ### Preferences ###
  getPreferences: function () {
    this.log();
    if (Helper.getItem("css")) {
      this.setFont(Helper.getItem("css"));
      this.$.sidePane.setCss(Helper.getItem("css"));
    }
    this.customList = Helper.getItem("customList");
    if (Helper.getItem("savedLists")) {
      this.savedLists = Helper.getItem("savedLists");
    }
    this.log("got Prefs: css: ", Helper.getItem("css"), "customList: ", Helper.getItem("customList"), "savedLists: ", Helper.getItem("savedLists"));
  },
  
  gotListFile: function(data, file, modified) {
    enyo.warn("list file modified:", modified);
    enyo.warn("local list synced:", this.savedLists.sync);
    enyo.warn("local list modified:", this.savedLists.modified);
    if (this.savedLists.sync) {
    } else {
      this.saveLists();
      // TODO: check dates 
      // If modification newer than Dropboxfile sync changes to dropbox
      //~ this.saveLists();
      // if older overwrite local changes with dropbox-data
      //~ this.savedLists = JSON.parse(data);
    }
    this.log("updated savedLists:", this.savedLists);
  },
  
  saveLists: function () {
    if (this.online) {
      var success = enyo.bind(this, this.writeListSuccess);
      var error = enyo.bind(this, this.dropboxError);
      dropboxHelper.writeFile("lists.json", JSON.stringify(this.savedLists, null, 2), null, success, error);
    } else {
      this.savedLists.sync = false;
      Helper.setItem("savedLists", this.savedLists);
    }
  },
  
  writeListSuccess: function(modified) {
    this.log("List saved at " + modified);
    this.savedLists.sync = true;
    this.savedLists.modified = modified;
    Helper.setItem("savedLists", this.savedLists);
    Helper.setItem("customList", this.customList);
    this.log("saved: savedLists: ", this.savedLists, "customList: ", this.customList);
    this.log("saved lists to file");
  },
  
  saveCss: function(inCss) {
    Helper.setItem("css", inCss);
    this.log("saved: css", inCss);
  },
  
  // Adjust Font
  setFont: function(css) {
    if (css) {
      var size = (css.size * 10 * Helper.ratio() + 80) + "%";
      var space = (css.space * 8 + 100) + "%";
      this.log("set font css: size: ", size, "space: ", space);
      this.$.viewPane.$.songViewPane.$.lyric.applyStyle("font-size", size);
      this.$.viewPane.$.songViewPane.$.lyric.applyStyle("line-height", space);
      this.$.viewPane.$.songViewPane.lyricDataSet();
      this.$.viewPane.$.help.$.helpContent.applyStyle("font-size", size);
    }
  },
  
  // ### XML-writing stuff ###
  
  // Writing update file
  dbWriteXml: function(file, content, date, songt) {
    this.log("database write file", file);
    var dbRec = {"filename": file, "title": songt, "xml": content, "date": date};
    var success = enyo.bind(this, this.dbStoreRec, file, content, date, songt, dbRec);
    var sqlObj = this.db.getSelect("songs", ["filename"], {"filename": file});
    this.db.query(sqlObj, {"onSuccess": success});  // a record created?
  },

  dbStoreRec: function(file, content, date, songt, dbRec, result) {
    var success = enyo.bind(this, this.dbWriteToChanges, 0, file, content, songt);
    if (result.length === 0) {  //record not previous stored 
      this.db.insertData(
        {"table": "songs", 
          data: {
            "filename": file,
            "title": songt,
            "xml": content, 
            "date": date
          }
        }, 
        {"onSuccess": success}
      );
    } else { // record exists
      var sqlObj = this.db.getUpdate("songs", dbRec, {"filename": file});
      this.db.query(sqlObj, {"onSuccess": success});
    }  
  },
  
  dbWriteToChanges: function(rev, file, content, songt) {
    // if no Dropbox write created to changes table and update program data
    if (!this.online) {
      this.log(file);
      var sqlObj = this.db.getDelete("changes", {"filename": file});
      this.db.query(sqlObj);
      var success = enyo.bind(this, this.writeFileSuccess, rev, file, content, songt);
      this.db.insertData({"table": "changes", data: {"filename": file, "action": "created"}}, {"onSuccess": success});
    }
  },
  
  writeXml: function(file, content, songt) {
    this.log("dropbox write file", file);
    var success = enyo.bind(this, this.writeFileSuccess);
    var error = enyo.bind(this, this.dropboxError);
    dropboxHelper.writeFile(file, content, songt, success, error);
  },
  
  writeFileSuccess: function(modified, file, content, songt) {
    this.log("File saved at " + modified);
    this.$.infoPanels.setIndex(0);
    if (this.newSong) {
      this.log("append", file, "to librarylist and select it");
      this.libraryList.content.push({'file': file, 'title': songt});
      this.dataList[file.toLowerCase()] = ParseXml.parse_dom(content);
      this.sortAndRefresh(file);
      this.newSong = false;
      this.$.viewPane.$.songViewPane.openEdit(); // open for editing
    } else {
      this.log(file, "changed");
      for (i in this.libraryList.content) {
        if (this.libraryList.content[i].file === file && songt !== this.libraryList.content[i].title) {
          this.log("title changed");
          this.libraryList.content[i].title = songt;
          break;
        } else if (this.libraryList.content[i].file === file) {
          break;
        }
      }
      this.dataList[file.toLowerCase()] = ParseXml.parse_dom(content);
      this.sortAndRefresh(file);
    }
  },

  // Create Song
  openCreateSong: function() {
    this.$.newSongDialog.show();
    this.$.songName.setValue("");
    this.$.songName.focus();
  },
  
  closeCreateSong: function() {
    this.$.newSongDialog.hide();
  },
  
  openImportSong: function() {
    this.$.infoPanels.setIndex(1);
    this.$.sidePane.showImport();
    this.$.newSongDialog.hide();
  },
  
  testFilename: function(file) {
    var x = this.dataList;
    var y = true;
    while (y) {
      if (x[file.toLowerCase()]) {
        this.log("filename already exist: ", file);
        var z = file.match(/\(([0-9]+)\)/);
        if (z && parseInt(z[1],10) > 0) {
          file = file.replace(z[0], "("+(parseInt(z[1],10)+1)+")");
        } else {
          file = file.substring(0, file.length-4) + "(1).xml";
        }
      } else {
        y = false;
      }
    }
    return file;
  },
  
  importError: function(file) {
    this.$.songListPane.showError($L("Error in importing: ") + file);
    this.$.infoPanels.setIndex(0);
  },
  
  importSong: function(song) {
    this.log();
    this.newSong = true;
    var songt = ParseXml.get_titles(ParseXml.parse_dom(song))[0];
    if (songt && songt.title) {
      var file = songt.title.replace(/\s+/g, "_").replace(/,/g , "") + ".xml";   //' ' -> '_'
      file = this.testFilename(file);
      this.log("create imported file: ", file);
      this.writeXml(file, song, songt.title);
    } else {
      this.importError(song);
    }
  },
  
  createSong: function() {
    var songt = this.$.songName.getValue();
    var file = songt.replace(/\s+/g, "_") + ".xml";   //' ' -> '_'
    file = this.testFilename(file);
    this.log("create file: ", file);
    this.newSong = true;
    // Try txt file
    if (this.online) {
      var success = enyo.bind(this, this.gotTxtFile, file, songt);
      var error = enyo.bind(this, this.contCreateSong, file, songt, "");
      dropboxHelper.readFile(songt + ".txt", success, error);
    } else {
      this.contCreateSong(file, songt, "");
    }
  },

  gotTxtFile: function(filenm, songt, data, file) {
    this.log(file);
    if (data) {
      this.contCreateSong(filenm, songt, data);
    } else {
      this.contCreateSong(filenm, songt, "");
    }
  },
  
  contCreateSong: function(file, songt, data) {
    this.log(songt);
    if (data === "") {
      var xml = WriteXml.create(songt);
    } else {
      var xml = convLyrics(data);
    }
     // write file skeleton database file
    var modDate = xml.slice(xml.indexOf("modifiedDate")+14);
    modDate = modDate.substring(0,modDate.indexOf("Z")+1);
    this.dbWriteXml(file, xml, Date.parse(modDate), songt);
    if (this.online) {
      this.writeXml(file, xml, songt);  // write file skeleton dropbox
    }
    this.$.newSongDialog.hide();
  },
  
  // Delete file
  deleteFile: function(file) {
    this.log("delete ", file);
    this.file = file;
    if (this.online) {
      var error = enyo.bind(this, this.dropboxError);
      var success = enyo.bind(this, this.deleteFromDbase);
      setTimeout(function() {dropboxHelper.deleteFile(file, success, error);}, 10);
    } else {
      this.deleteFromDbase();
    }
    // TODO: Check if File is in savedLists and remove it there as well 
  },
  
  deleteFromDbase: function() {
    var error = enyo.bind(this, this.dbError);
    var success = enyo.bind(this, this.deleteUpdateChanges, this.file);
    var sqlObj = this.db.getDelete("songs", {"filename": this.file});
    this.db.query(sqlObj, {"onSuccess": success, "onError": error});
  },

  deleteUpdateChanges: function(filename) {
    // if dropBox off make changes entry
    if (!this.online) {
      var error = enyo.bind(this, this.dbError);
      var success = enyo.bind(this, this.deleteSuccess);
      var sqlObj = this.db.getDelete("changes", {"filename": this.file});
      this.db.query(sqlObj);
      this.db.insertData({"table":"changes", data: {"filename": filename, "action":"deleted"}}, {"onSuccess": success, "onError": error});
    } else {
      this.deleteSuccess();
    }
  },
  
  // delete file from library and data list
  deleteSuccess: function() {
    this.log(this.file, "deleted");
    delete this.dataList[this.file.toLowerCase()];
    for (i in this.libraryList.content) {
      if (this.libraryList.content[i].file === this.file) {
        this.libraryList.content.splice(i, 1);
        break;
      }
    }
    this.currentIndex = (this.currentIndex === this.libraryList.content.length) ? this.currentIndex-1 : this.currentIndex;
    this.log("currentIndex", this.currentIndex);
    this.$.viewPane.$.viewPanels.setIndex(1);
    this.file = undefined;
    this.sortAndRefresh();
  },

  // Resizing 
  doResizeLyrics: function() {
      this.$.viewPane.$.songViewPane.resizeLyrics();
  }
  
});
