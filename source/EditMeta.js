enyo.kind({
  name: "EditMeta",
  kind: "FittableRows",
  classes: "enyo-fit",
  single: ["released", "copyright", "publisher", "key", "tempo", "transposition", "verseOrder", "duration"],
  titleCount: 1,
  authorCount: 1,
  songbookCount: 1,
  commentCount: 1,
  published: {
    metadata: {},
    button: [],
    file: undefined
  },
  components: [
    {kind: "enyo.Scroller", fit: true, classes: "michote-scroller", horizontal: "hidden", components: [
      {name: "box", kind:"FittableRows", classes:"box-center", components:[
        {name: "titlebox", kind: "onyx.Groupbox", components:[
          {kind: "onyx.GroupboxHeader", content: $L("title")},
          {name: "titlehflex1", kind: "FittableColumns", components:[
            {kind: "onyx.InputDecorator", fit: true, components: [
              {name: "title1", kind: "Input", hint: $L("title")}
            ]},
            {kind: "onyx.InputDecorator", style: "width: 5rem;", components: [
              {name: "titlelang1", kind: "Input", placeholder: ""}
            ]},
          ]}
        ]},
        {name: "authorbox", kind: "onyx.Groupbox", components:[
          {kind: "onyx.GroupboxHeader", content: $L("author")},
          {name: "authorhflex1", kind: "FittableColumns", components:[
            {kind: "onyx.InputDecorator", fit: true, components: [
              {name: "author1", kind: "Input", placeholder: $L("author")}
            ]},
            {kind: "onyx.PickerDecorator", classes: "author-picker", components: [
              {style: "width: 100%; background: none; border: none;"},
              {name: "authorSwitch1", kind: "onyx.Picker", onSelect: "onchange_author", components: [
                {name: "null1", content: "", value: "", active: true},
                {name: "words1", content: $L("words"), value: "words"},
                {name: "music1", content: $L("music"), value: "music"},
                {name: "translation1", content: $L("translation"), value: "translation"}
              ]}
            ]},
            {name: "authorDrawer1", orient: "h", kind: "onyx.Drawer", open: false, components: [
              {kind: "onyx.InputDecorator", style: "width: 3.875rem;", components: [
                {name: "authorlang1", kind: "Input", placeholder: ""}
              ]}
            ]}
          ]}
        ]},
        {kind: "onyx.Groupbox", components:[
          {kind: "onyx.GroupboxHeader", content: $L("copyright")},
          {kind: "FittableColumns", components:[
            {content: $L("release date") + ":", style: "padding: .25rem .5rem; line-height: normal; width: 5.5rem;", classes: "editlabel"},
            {kind: "onyx.InputDecorator", style: "max-width: 20%;", components: [
              {name: "released", kind: "Input", placeholder: $L("release date")}
            ]},
            {content: $L("copyright holder") + ":", style: "padding: .25rem .5rem; line-height: normal; width: 5.5rem;", classes: "editlabel"},
            {kind: "onyx.InputDecorator", fit: true, components: [
              {name: "copyright", kind: "Input", placeholder: $L("copyright holder")}
            ]}
          ]},
          {kind: "FittableColumns", components:[
            {content: $L("publisher") + ":", style: "width: 7.5rem;", classes: "editlabel"},
            {kind: "onyx.InputDecorator", fit: true, components: [
              {name: "publisher", kind: "Input", placeholder: $L("publisher")}
            ]}
          ]},
        ]},
        {name: "songbookbox", kind: "onyx.Groupbox", components:[
          {kind: "onyx.GroupboxHeader", content: $L("infos")},
          {kind: "FittableColumns", components:[
            {content: $L("transposition") + ":", style: "width: 8.5rem;", classes: "editlabel"},
            {kind: "onyx.InputDecorator", style: "max-width: 20%", components: [
              {name: "transposition", kind: "Input", placeholder: $L("transposition")}
            ]},
            {content: $L("key") + ":", style: "width: 4.5rem;", classes: "editlabel"},
            {kind: "onyx.InputDecorator", fit: true, components: [
              {name: "key", kind: "Input", placeholder: $L("key")}
            ]}
          ]},
          {kind: "FittableColumns", components:[
            {content: $L("duration") + ":", style: "width: 8.5rem;", classes: "editlabel"},
            {kind: "onyx.InputDecorator", style: "max-width: 20%", components: [
              {name: "duration", kind: "Input", placeholder: $L("duration")}
            ]},
            {content: $L("tempo") + ":", style: "width: 4.5rem;", classes: "editlabel"},
            {kind: "onyx.InputDecorator", fit: true, components: [
              {name: "tempo", kind: "Input", placeholder: $L("tempo")}
            ]}
          ]},
          {kind: "FittableColumns", fit: true, components:[
            {content: $L("verseorder") + ":", style: "width: 7rem;", classes: "editlabel"},
            {kind: "onyx.InputDecorator", fit: true, components: [
              {name: "verseOrder", kind: "Input", placeholder: $L("verseorder")},
            ]}
          ]},
          {name: "versehflex", kind: "FittableColumns", style: "text-align:center; padding: .25rem;"},
          {name: "songbookhflex1", kind: "FittableColumns", components:[
            {content: $L("songbook") + ":", style: "width: 6.5rem;", classes: "editlabel"},
            {kind: "onyx.InputDecorator", fit: true, components: [
              {name: "songbook1", kind: "Input", placeholder: $L("songbook")}
            ]},
            {content: $L("no.") + ":", style: "width: 2.5rem;", classes: "editlabel"},
            {kind: "onyx.InputDecorator", style: "max-width: 15%", components: [
              {name: "no1", kind: "Input", placeholder: $L("number")}
            ]}
          ]}
        ]},
        {name: "commentbox", kind: "onyx.Groupbox", components:[
          {kind: "onyx.GroupboxHeader", content: $L("comments")},
          {kind: "onyx.InputDecorator", components: [
            {name: "comment1", kind: "onyx.RichText", placeholder: $L("comment"),}
          ]}
        ]},
        {tag: 'br'},
        {kind: "onyx.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: $L("Delete file"), style: "background-color: rgba(158, 5, 8, 0.8)"},
          {kind:"FittableColumns", style: "padding: .5rem;", components: [
            {fit: 1, content:  $L("Delete this songfile (irreversible!)")},
            {name: "delete", kind:"onyx.Button", content: $L("Delete file"), classes: "onyx-negative", ontap: "deleteFile"}
          ]}
        ]}
      ]}
    ]},
  ],
  
  // Adding new fields
  addNew: function(add) {
    this.log();
    this.saveModifications();
    this.metadataChanged();
    this["add" + add.charAt(0).toUpperCase() + add.slice(1)]();
  },
  
  addTitle: function() {
    this.titleCount += 1;
    this.log(this.titleCount);
    this.$.titlebox.createComponent(
      {name: "titlehflex" + this.titleCount, kind: "FittableColumns", owner: this, components:[
        {kind: "onyx.InputDecorator", fit: true, components: [
          {name: "title" + this.titleCount, kind: "Input", placeholder: $L("title"), owner: this}
        ]},
        {kind: "onyx.InputDecorator", style: "width: 5rem;", components: [
          {name: "titlelang" + this.titleCount, kind: "Input", placeholder: "", owner: this}
        ]},
      ]}
    );
    this.$["titlehflex" + this.titleCount].render();
  },
  
  addAuthor: function() {
    this.authorCount += 1;
    this.log(this.authorCount);
    this.$.authorbox.createComponent(
      {name: "authorhflex" + this.authorCount, kind: "FittableColumns", owner: this, components:[
        {kind: "onyx.InputDecorator", fit: true, components: [
          {name: "author" + this.authorCount, kind: "Input", placeholder: $L("author"), owner: this}
        ]},
        {kind: "onyx.PickerDecorator", classes: "author-picker", owner: this, components: [
          {style: "width: 100%; background: none; border: none;"},
          {name:"authorSwitch" + this.authorCount, kind: "onyx.Picker", onSelect: "onchange_author", owner: this, components: [
            {content: "", value: "", active: true},
            {name: "words" + this.authorCount, content: $L("words"), value: "words"},
            {name: "music" + this.authorCount, content: $L("music"), value: "music"},
            {name: "translation" + this.authorCount, content: $L("translation"), value: "translation"}
          ]}
        ]},
        {name: "authorDrawer" + this.authorCount, orient: "h", kind: "onyx.Drawer", open: false, owner: this, components: [
          {kind: "onyx.InputDecorator", style: "width: 3.875rem;", components: [
            {name: "authorlang" + this.authorCount, kind: "Input", placeholder: "", owner: this}
          ]}
        ]}
      ]}
    );
    this.$["authorhflex" + this.authorCount].render();
  },
  
  onchange_author: function(inSender, inEvent) {
    var num = inSender.name.charAt(inSender.name.length-1)
    this.$["authorDrawer"+num].setOpen(inEvent.selected.value === "translation" ? true : false);
  },
  
  addSongbook: function() {
    this.songbookCount += 1;
    this.log(this.songbookCount);
    this.$.songbookbox.createComponent(
      {name: "songbookhflex" + this.songbookCount, kind: "FittableColumns", owner: this, components:[
        {content: $L("songbook") + ":", style: "width: 6.5rem;", classes: "editlabel"},
        {kind: "onyx.InputDecorator", fit: true, components: [
          {name: "songbook" + this.songbookCount, kind: "Input", placeholder: $L("songbook"), owner: this}
        ]},
        {content: $L("no.") + ":", style: "width: 2.5rem;", classes: "editlabel"},
        {kind: "onyx.InputDecorator", style: "max-width: 15%", components: [
          {name: "no" + this.songbookCount, kind: "Input", placeholder: $L("number"), owner: this}
        ]}
      ]}
    );
    this.$["songbookhflex" + this.songbookCount].render();
  },
  
  addComment: function() {
    this.commentCount += 1;
    this.log(this.commentCount);
    this.$.commentbox.createComponent(
      {name: "commenthflex" + this.commentCount, kind: "onyx.InputDecorator", owner: this, components: [
        {name: "comment" + this.commentCount, kind: "onyx.RichText", placeholder: $L("comment"), owner: this}
      ]}
    );
    this.$["commenthflex" + this.commentCount].render();
  },
  
  // Add existing data to UI
  metadataChanged: function() {
    this.log();
    this.clear();
    for (i in this.single) {
      if (this.metadata[this.single[i]]) {
        this.$[this.single[i]].setValue(this.metadata[this.single[i]]);
      } else {
        this.$[this.single[i]].setValue("");
      };
    };
    // Titles
    var l = this.metadata.titles.length + 1;
    for (i=1; i < l; i++) {
      if (i>1) { this.addTitle() };
      this.$["title" + i].setValue(this.metadata.titles[i-1].title);
      this.$["titlelang" + i].setValue(this.metadata.titles[i-1].lang ? this.metadata.titles[i-1].lang : "");
    };
    // Authors
    if (this.metadata.authors) {
      l = this.metadata.authors.length + 1;
      for (i=1; i < l; i++) {
        if (i>1) { this.addAuthor() };
        this.$["author" + i].setValue(this.metadata.authors[i-1].author);
        if (this.metadata.authors[i-1].type) {
          this.$["authorSwitch" + i].setSelected(this.$[this.metadata.authors[i-1].type + i]);
          if (this.metadata.authors[i-1].type === "translation") {
            this.$["authorDrawer" + i].setOpen(true);
            this.$["authorlang" + i].setValue(this.metadata.authors[i-1].lang);
          };
        };
      };
    };
    // Songbooks
    if (this.metadata.songbooks) {
      l = this.metadata.songbooks.length + 1;
      for (i=1; i < l; i++) {
        if (i>1) { this.addSongbook() };
          this.$["songbook" + i].setValue(this.metadata.songbooks[i-1].book);
          this.$["no" + i].setValue(this.metadata.songbooks[i-1].no ? this.metadata.songbooks[i-1].no : "");
      };
    };
    // Comments
    var l = this.metadata.comments.length + 1;
    for (i=1; i < l; i++) {
      if (i>1) { this.addComment() };
      this.$["comment" + i].setValue(this.metadata.comments[i-1]);
    };
  },
  
  buttonChanged: function() {
    this.log();
    this.$.versehflex.destroyClientControls();
    for (i in this.button) {
      this.log("add button:", this.button[i]);
      this.$.versehflex.createComponent(
        {name: this.button[i], kind: "onyx.Button", content: this.button[i], classes: "verse-button", owner: this, ontap: "verseButton"}
      );
    };
    this.$.versehflex.render();
  },
  
  verseButton: function(inSender) {
    var index = this.$.verseOrder.hasNode().selectionStart;
    var text = this.$.verseOrder.getValue();
    // calculate whitespaces
    var x = text.charAt(index-1)
    if (index===0 || x===' ') {
      var a = '';
    } else {
      var a = ' ';
    };
    var y = text.charAt(index)
    if (y===' ' || index===text.length) {
      var b = '';
    } else {
      var b = ' ';
    };    
    this.$.verseOrder.setValue(text.substring(0, index) + a + inSender.name + b + text.substring(index, text.length));
  },
  
  // Remove extra fields
  clear: function() { // remove added stuff
    this.log();
    for (j=2; j < this.titleCount+1; j++) {
      this.$["titlehflex"+j].destroy();
    };
    this.titleCount = 1;
    for (j=2; j < this.authorCount+1; j++) {
      this.$["authorhflex"+j].destroy();
    };
    this.authorCount = 1;
    this.$.author1.setValue("");
    this.$.authorDrawer1.setOpen(false);
    this.$.authorSwitch1.setSelected(this.$.null1);
    for (j=2; j < this.songbookCount+1; j++) {
      this.$["songbookhflex"+j].destroy();
    };
    this.songbookCount = 1;
    this.$.songbook1.setValue("");
    this.$.no1.setValue("");
    for (j=2; j < this.commentCount+1; j++) {
      this.$["commenthflex"+j].destroy();
    };
    this.commentCount = 1;
    this.$.comment1.setValue("");
  },
  
  // get all data from UI
  getAllFields: function() {
    this.log();
    for (i in this.single) {
      if (this.$[this.single[i]].getValue()) {
        Helper.html(this.metadata[this.single[i]] = this.$[this.single[i]].getValue());
      };
    };
    
    // Titles
    var titles = [];
    for (i=1; i < this.titleCount+1; i++) {
      if (this.$["title" + i].getValue()) {
        if (this.$["titlelang" + i].getValue()) {
          titles.push({"title": Helper.html(this.$["title" + i].getValue()), "lang": this.$["titlelang" + i].getValue()});
        } else {
          titles.push({"title": Helper.html(this.$["title" + i].getValue()), "lang": null});
        };
      };
    };
    this.metadata.titles = titles;
    
    // Authors
    var names = [];
    for (i=1; i < this.authorCount+1; i++) {
      if (this.$["author" + i].getValue()) {
        var t = this.$["authorSwitch" + i].getSelected().value;
        if (t === "translation") {
          names.push({"type": t, "author": Helper.html(this.$["author" + i].getValue()), "lang": this.$["authorlang" + i].getValue()});
        } else {
          names.push({"type": t, "author": Helper.html(this.$["author" + i].getValue())});
        };
      };
    };
    this.metadata.authors = names;
    
    // Songbooks
    var books = [];
    for (i=1; i < this.songbookCount+1; i++) {
      if (this.$["songbook" + i].getValue()) {
        if (this.$["no" + i].getValue()) {
          books.push({"book": Helper.html(this.$["songbook" + i].getValue()), "no": this.$["no" + i].getValue()});
        } else {
          books.push({"book": Helper.html(this.$["songbook" + i].getValue()), "no": null});
        };
      };
    };
    this.metadata.songbooks = books;
    
    // Comments
    var comments = [];
    for (i=1; i < this.commentCount+1; i++) {
      if (this.$["comment" + i].getValue()) {
        comments.push(Helper.html(this.$["comment" + i].getValue()));
      };
    };
    this.metadata.comments = comments;
    
    return true;
  },
  
  // Delete file
  deleteFile: function() {
    this.log("delete ", this.file);
    if (this.owner.owner.owner.online) {
      var error = enyo.bind(this, this.owner.owner.owner.dropboxError);
      var success = enyo.bind(this, this.deleteFromDbase);
      setTimeout(dropboxHelper.deleteFile(this.file, success, error), 10);
    } else {
      this.deleteFromDbase();
    }
  },
  
  deleteFromDbase: function() {
    var _this = this.owner.owner.owner; 
    var error = enyo.bind(this, _this.dbError);
    var success = enyo.bind(this, this.deleteUpdateChanges, this.file);
    var sqlObj = _this.db.getDelete("songs", {"filename": this.file});
    _this.db.query(sqlObj, {"onSuccess": success, "onError": error});
  },

  deleteUpdateChanges: function(filename) {
    // if dropBox off make changes entry
    var _this = this.owner.owner.owner; 
    if (!_this.online) {
      var error = enyo.bind(this, _this.dbError);
      var success = enyo.bind(this, this.deleteSuccess);
      var sqlObj = _this.db.getDelete("changes", {"filename": this.file});
      _this.db.query(sqlObj);
      _this.db.insertData({"table":"changes", data: {"filename": filename, "action":"deleted"}}, {"onSuccess": success, "onError": error});
    } else {
      this.deleteSuccess();
    }
  },
  
  // delete file from library and data list
  deleteSuccess: function() {
    this.log(this.file, "deleted");
    var o = this.owner.owner.owner
    delete o.dataList[this.file.toLowerCase()];
    for (i in o.libraryList.content) {
      if (o.libraryList.content[i].file === this.file) {
        o.libraryList.content.splice(i, 1);
        break;
      }
    }
    o.currentIndex = (o.currentIndex === o.libraryList.content.length) ? o.currentIndex-1 : o.currentIndex;
    this.log("currentIndex", o.currentIndex);
    o.$.viewPane.$.viewPanels.setIndex(1);
    o.sortAndRefresh();
  },
  
  saveModifications: function() {
    this.getAllFields();
    this.log("save metadata modification");
    this.owner.setMetadata(this.metadata);
  }
  
});
