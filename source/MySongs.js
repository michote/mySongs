// #################
//
// Copyright (c) 2012 Micha Reischuck
//
// MySongBook is available under the terms of the MIT license. 
// The full text of the MIT license can be found in the LICENSE file included in this package.
//
// #################

enyo.Scroller.touchScrolling = true;

enyo.kind({
  name: "mySongs",
  fit: true,
  realtimeFit: true,
  // Properties
  pathCount: {"a": [], "b": []},
  errorList: [],
  dirPath: "/media/internal/MySongBook/",
  newSong: false,
  textSrce: "",
  published: {
    dataList: {},
    libraryList: {"content": []},
    savedLists: [],
    customList: false,
    searchList: {"content": []},
    css: undefined,
    currentList: "libraryList",
    currentIndex: undefined
  },
  components: [
    // Layout
    {kind: "Panels", name:"infoPanels", classes:"enyo-fit", arrangerKind: "CollapsingArranger", draggable: false, realtimeFit: true, components: [
      {kind: "Panels", name:"mainPanels", classes:"app-panels inner-panels", arrangerKind: "CollapsingArranger", draggable: false, realtimeFit: true, components: [
        {name: "songListPane", kind: "SongList"},
        {name:"viewPane", kind: "ViewPane"}
      ]},
      {name: "sidePane", kind: "SidePane"}
    ]},
    {name: "newSongDialog", kind: "onyx.Popup", style: "padding: 1rem;", centered: true, modal: true, floating: true, scrim: true, components: [
      {kind: "FittableRows", style: "padding: .5rem; background-color: rgba(255, 255, 255, 0.5)", components: [
        {content: $L("New song"), tag: 'b', style: "font-size: 1.2rem;"},
        {tag: 'br'},
        {kind: "onyx.InputDecorator", style: "width: 14.75rem; margin-top: .5rem;", components: [
          {name: "songName", kind: "onyx.Input", placeholder: $L("Enter songname"), style: "width: 100%;"}, //onchange: "createSong"},
        ]},
        {name: "songErrorContent", style: "color: #fff; padding: .5rem; background-color: #9E0508; border-radius: .5rem; margin-top: .5rem;", showing: false},
        {components: [
          {kind: "onyx.Button", classes: "onyx-negative", style: "margin: .5rem 0 0;", content: $L("Cancel"), ontap: "closeCreateSong"},
          {kind: "onyx.Button", classes: "onyx-affirmative", style: "margin: .5rem 0 0 .5rem;", content: $L("Save"), ontap: "createSong"}
        ]}
      ]}
    ]}
  ],

  create: function() {
    this.inherited(arguments);
    this.connectToDropbox();
    this.getPreferences();
    enyo.log("platform", enyo.platform);
  },
  
  connectToDropbox: function() {
    this.$.songListPane.$.readFiles.setContent($L("Connecting..."));
    this.$.songListPane.$.readProgress.setMax(3);
    this.$.songListPane.$.readProgress.animateProgressTo(1);
    this.$.songListPane.$.listPane.setIndex(0);
    var success = enyo.bind(this, this.readDirectory);
    var error = enyo.bind(this, this.connectError);
    setTimeout(dropboxHelper.connect(success, error), 50);
  },
  
  connectError: function(error) {
    this.$.songListPane.showError($L("Connection error: ") + error);
  },
  
  dropboxError: function(error) {
    this.$.songListPane.showError($L("Dropbox error: ") + error);
  },
  
  // Dropbox Logout
  signOut: function() {
    var success = enyo.bind(this, this.signOutSuccess);
    setTimeout(dropboxHelper.signOut(success), 50);
  },
  
  signOutSuccess: function() {
    this.$.viewPane.$.preferences.setDropboxClient(false); // Hide Logout Button 
    this.$.songListPane.$.listPane.setIndex(6);
    enyo.log("successfully logged out from Dropbbox");
  },
  
  // Refresh Library
  refreshLibrary: function() {
    this.libraryList.content = [];
    this.$.songListPane.goToSync();
    this.readDirectory();
  },
  
  // Reading files in Dropbox App-Folder
  readDirectory: function() {
    enyo.log("reading app directory...");
    this.$.viewPane.$.preferences.setDropboxClient(true); // Show Logout Button 
    this.$.songListPane.$.readProgress.animateProgressTo(2);
    var success = enyo.bind(this, this.handleDropboxfiles);
    var error = enyo.bind(this, this.dropboxError);
    setTimeout(dropboxHelper.readDir(success, error), 10);
  },
  
  handleDropboxfiles: function(files) {
    this.$.songListPane.$.readProgress.animateProgressTo(3);
    var success = enyo.bind(this, this.gotFile);
    var error = enyo.bind(this, this.dropboxError);
    if (files.length === 0) {
      enyo.log("no files in Dropbox: first use?");
      this.$.songListPane.$.listPane.setIndex(5);
    } else {
      enyo.log(files.length + " files to parse ...");
      this.$.songListPane.$.readProgress.setProgress(0);
      this.$.songListPane.$.readProgress.setMax(files.length+1);
      this.$.songListPane.$.readFiles.setContent($L("Reading Files..."));
      
      for (i = 0; i < files.length; i++) {
        if (files[i].split('.').pop() === 'xml') { // only parse xml-files
          this.pathCount.a.push(i);
          setTimeout(dropboxHelper.readFile(files[i], success, error), 10);
        }
      }
    }
  },
  
  //~ gotTxt: function (inSender, inResponse) {
    //~ this.textSrce = inResponse;
    //~ //enyo.job.stop("readTimeOut");
  //~ },
  //~ 
  //~ gotTxtFailure: function(inSender, inResponse, inRequest) {
    //~ this.textSrce = "";
  //~ },
  
  gotFile: function(data, file) {
    var xml = ParseXml.parse_dom(data);
    if (ParseXml.get_titles(xml)) { // check for valid title before adding to library
      //~ var a = {"file": file, "xml": xml, "title": ParseXml.get_titles(xml)[0].title};
      this.dataList[file] = xml;
      var a = {"file": file, "title": ParseXml.get_titles(xml)[0].title};
      this.libraryList.content.push(a);
    }
    // only refresh and sort once
    this.pathCount.b.push(1);
    this.$.songListPane.$.readProgress.animateProgressTo(this.pathCount.a.length);
    if (this.pathCount.b.length === this.pathCount.a.length) {
      this.sortAndRefresh();
    }
  },
   
  // Sort Library alphabetically
  sortByTitle: function (a,b) {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  },
  
  sortAndRefresh: function(file) {
    this.libraryList.content.sort(this.sortByTitle);
    // Switch to libraryPane
    this.$.songListPane.goToLibrary();
    this.$.songListPane.$.library.setValue(true);
    // select file when given
    if (file) {
      enyo.log("file to select", file);
      for (i in this.libraryList.content) {
        if (this.libraryList.content[i].file === file) {
          this.openSong(i);
          break;
        }
      }
    } else if (this.currentIndex >= 0) {
      this.openSong(this.currentIndex);
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
    enyo.log("open song:", this[this.currentList].content[index].file);
    this.$.viewPane.$.songViewPane.setFirst(true);
    this.$.viewPane.$.songViewPane.setFile(this[this.currentList].content[index].file);
    this.$.viewPane.$.songViewPane.start();
    //~ this.$.viewPane.$.songViewPane.setXml(this[this.currentList].content[index].xml);
    this.$.songListPane.$[(this.currentList === "searchList") ? "libraryList" : this.currentList].select(index);
    this.$.viewPane.$.songViewPane.$.viewScroller.setScrollTop(0);
    this.$.viewPane.$.viewPanels.setIndex(1);
    !Helper.phone() || this.$.mainPanels.setIndex(1);
  },
  
  currentIndexChanged: function() {
    if (this.currentIndex >= 0) {
      this.openSong(this.currentIndex);
    } else {
      this.$.songListPane.$[this.currentList].refresh();
    }
  },
  
  // ### Preferences ###
  getPreferences: function () {
    if (Helper.getItem("css")) {
      this.setFont(Helper.getItem("css"));
      this.$.sidePane.setCss(Helper.getItem("css"));
    }
    this.customList = Helper.getItem("customList");
    if (Helper.getItem("savedLists")) {
      this.savedLists = Helper.getItem("savedLists");
    }
    enyo.log("got Prefs: css:", Helper.getItem("css"), "customList:", Helper.getItem("customList"), "savedLists:", Helper.getItem("savedLists"));
  },
  
  saveLists: function () {
    Helper.setItem("savedLists", this.savedLists);
    Helper.setItem("customList", this.customList);
    enyo.log("saved: savedLists:", this.savedLists, "customList:", this.customList);
  },
  
  saveCss: function(inCss) {
    Helper.setItem("css", inCss);
    enyo.log("saved: css", inCss);
  },
  
  // Adjust Font
  setFont: function(css) {
    if (css) {
      var size = (css.size * 4 * Helper.ratio() + 100) + "%";
      var space = (css.space * 8 + 100) + "%";
      enyo.log("set font css: size:", size, "space:", space);
      this.$.viewPane.$.songViewPane.$.lyric.applyStyle("font-size", size);
      this.$.viewPane.$.songViewPane.$.lyric.applyStyle("line-height", space);
      this.$.viewPane.$.songViewPane.setElWidth(css.size);
      this.$.viewPane.$.songViewPane.lyricDataSet();
      this.$.viewPane.$.help.$.helpContent.applyStyle("font-size", size);
    }
  },
  
  // ### XML-writing stuff ###
  
  // Writing files
  writeXml: function(file, content, songt) {
    enyo.log("write file", file, songt);
    var success = enyo.bind(this, this.writeFileSuccess);
    var error = enyo.bind(this, this.dropboxError);
    setTimeout(dropboxHelper.writeFile(file, content, songt, success, error), 10);
  },
  
  writeFileSuccess: function(revision, file, content, songt) {
    enyo.log("File saved as revision " + revision);
    if (this.newSong) {
      enyo.log("append", file, "to librarylist and select it");
      this.libraryList.content.push({'file': file, 'title': songt});
      this.dataList[file] = ParseXml.parse_dom(content);
      this.sortAndRefresh(file);
      this.newSong = false;
      // open for editing
      this.$.viewPane.$.viewPanels.setIndex(3);
      this.$.viewPane.$.editToaster.setXml(this.dataList[file]);
      this.$.viewPane.$.editToaster.setFile(file);
    } else {
      enyo.log(file, "changed");
      for (i in this.libraryList.content) {
        if (this.libraryList.content[i].file === file && songt !== this.libraryList.content[i].title) {
          enyo.log("title changed");
          this.libraryList.content[i].title = songt;
          break;
        } else if (this.libraryList.content[i].file === file) {
          break;
        }
      }
      this.dataList[file] = ParseXml.parse_dom(content);
      this.sortAndRefresh(file);
    }
  },

  // Create Song
  openCreateSong: function() {
    this.$.newSongDialog.show();
    this.$.songName.setValue("");
    this.$.songErrorContent.setContent("");
    this.$.songErrorContent.hide();
    this.$.songName.focus();
  },
  
  closeCreateSong: function() {
    this.$.newSongDialog.hide();
  },
  
  createSong: function() {
    var songt = this.$.songName.getValue();
    var file = songt.replace(/\s+/g, "_") + ".xml";   //' ' -> '_'
    var e = false;
    this.$.songErrorContent.hide();
    enyo.log("file:", file);
    var l = this.libraryList.content;
    for (i in l) {
      if (l[i].file === file || l[i].file === file.toLowerCase()) {
        enyo.log("lfile:", this.libraryList.content[i].file);
        this.$.songErrorContent.setContent($L("Name already exist"));
        this.$.songErrorContent.show();
        e = true;
      }
    }
    if (!e) {  // songt.xml does not exits.
      enyo.log("file anlegen");
      this.writeXml(file, WriteXml.create(songt), songt);  // write file skeleton
      this.newSong = true;
      this.$.newSongDialog.hide();
    }
  }
    
      // is there a .txt file to use
      //~ var txtPath = songt + ".txt";   // allow spaces in txt file names 
      //~ this.$.getTxt.setUrl(this.dirPath + txtPath);
      //~ this.$.getTxt.call();  // file content to this.textSrce
      //~ enyo.job("readTimeOut", enyo.bind(this, "createSongCont", path, songt), 1000); // wait up to 1 sec for text file.
    //~ }
  //~ },
  //~ 
  //~ createSongCont: function(path, songt) {
    //~ if (this.textSrce !== "") {
      //~ this.writeXml(path, convLyrics(this.textSrce));  // write txt file contents
    //~ } else {  
      //~ this.writeXml(file, WriteXml.create(songt));  // write file skeleton
    //~ }
    //~ this.newSong = {"file": file};
    //~ this.$.newSongDialog.hide();
  //~ }
});
