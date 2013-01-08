enyo.kind({
  name: "EditMeta",
  kind: "FittableRows",
  single: ["released", "copyright", "publisher", "key", "tempo", "transposition", "verseOrder", "duration"],
  titleCount: 1,
  authorCount: 1,
  songbookCount: 1,
  published: {
    metadata: {},
    button: []
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
              {name: "titlelang1", kind: "Input", placeholder: "", autoCapitalize: "lowercase"}
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
        {tag: 'br'}
      ]}
    ]},
  ],
  
  // Adding new fields
  addNew: function(add) {
    this["add" + add.charAt(0).toUpperCase() + add.slice(1)]();
  },
  
  addTitle: function() {
    this.titleCount += 1;
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
    this.$.titlebox.render();
  },
  
  addAuthor: function() {
    this.authorCount += 1;
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
    this.$.authorbox.render();
  },
  
  onchange_author: function(inSender, inEvent) {
    var num = inSender.name.charAt(inSender.name.length-1)
    this.$["authorDrawer"+num].setOpen(inEvent.selected.value === "translation" ? true : false);
  },
  
  addSongbook: function() {
    this.songbookCount += 1;
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
    this.$.songbookbox.render();
  },
  
  // Add existing data to UI
  metadataChanged: function() {
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
  },
  
  buttonChanged: function() {
    this.$.versehflex.destroyClientControls();
    for (i in this.button) {
      //~ enyo.log("add button:", this.button[i]);
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
    for (j=2; j < this.titleCount+1; j++) {
      this.$["titlehflex"+j].destroy();
    };
    this.titleCount = 1;
    for (j=2; j < this.authorCount+1; j++) {
      this.$["authorhflex"+j].destroy();
    };
    this.authorCount = 1;
    this.$.author1.setValue("");
    this.$.authorSwitch1.setSelected(this.$.null1);
    for (j=2; j < this.songbookCount+1; j++) {
      this.$["songbookhflex"+j].destroy();
    };
    this.songbookCount = 1;
    this.$.songbook1.setValue("");
    this.$.no1.setValue("");
  },
  
  // get all data from UI
  getAllFields: function() {
    for (i in this.single) {
      if (this.$[this.single[i]].getValue()) {
        this.metadata[this.single[i]] = 
        this.$[this.single[i]].getValue();
      };
    };
    
    // Titles
    var titles = [];
    for (i=1; i < this.titleCount+1; i++) {
      if (this.$["title" + i].getValue()) {
        if (this.$["titlelang" + i].getValue()) {
          titles.push({"title": this.$["title" + i].getValue(), 
            "lang": this.$["titlelang" + i].getValue()});
        } else {
          titles.push({"title": this.$["title" + i].getValue(), 
            "lang": null});
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
          names.push({"type":t, "author": this.$["author" + i].getValue(), "lang": this.$["authorlang" + i].getValue()});
        } else {
          names.push({"type":t, "author": this.$["author" + i].getValue()});
        };
      };
    };
    this.metadata.authors = names;
    
    // Songbooks
    var books = [];
    for (i=1; i < this.songbookCount+1; i++) {
      if (this.$["songbook" + i].getValue()) {
        if (this.$["no" + i].getValue()) {
          books.push({"book": this.$["songbook" + i].getValue(),
          "no": this.$["no" + i].getValue()});
        } else {
          books.push({"book": this.$["songbook" + i].getValue(),
          "no": null});
        };
      };
    };
    this.metadata.songbooks = books;
    
    return true;
  },
  
  saveModifications: function() {
    this.getAllFields();
    this.owner.setMetadata(this.metadata);
  }
  
});
