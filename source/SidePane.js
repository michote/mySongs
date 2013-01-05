enyo.kind({
  name: "SidePane",
  kind: "FittableRows",
  classes: "side-pane",
  metaList: ["title", "author", "songbook"],
  lyricsList: ["v", "c", "b", "p", "e"],
  back: undefined,
  parts: [1],
  published: {
    css: {"size": 0, "space": 0},
    element: undefined
  },
  components: [ 
    {name: "headerToolbar", kind: "onyx.Toolbar", style: "text-align: center;", ondragfinish: "dragFinish", components: [
      {name: "title", classes: "title", content: $L("Song Info")}
    ]},
    {name: "Pane", kind: "Panels", draggable: false, fit: 1, ondragfinish: "dragFinish", components: [
      // Menu
      {name: "menuScroller", kind: "enyo.Scroller", fit: 1, components: [ 
        {kind: "onyx.MenuItem", onSelect: "showPreferences", components: [ 
          {kind: "onyx.Icon", src: Helper.iconPath()+"menu-settings.png"},
          {content: $L("Preferences")}
          ]},
        {kind: "onyx.MenuItem", onSelect: "newSong", components: [ 
          {kind: "onyx.Icon", src: Helper.iconPath()+"menu-new.png"},
          {content: $L("Create new song")}
          ]},
        {kind: "onyx.MenuItem", onSelect: "refresh", components: [ 
          {kind: "onyx.Icon", src: Helper.iconPath()+"menu-sync.png"},
          {content: $L("Refresh Library")}
          ]},
        {kind: "onyx.MenuItem", onSelect: "showHelp", components: [ 
          {kind: "onyx.Icon", src: Helper.iconPath()+"menu-help.png"},
          {content: $L("Help")}
          ]},
        {kind: "onyx.MenuItem", onSelect: "showAbout", components: [ 
          {kind: "onyx.Icon", src: Helper.iconPath()+"menu-about.png"},
          {content: $L("About")}
          ]},
        {name: "about", kind: "onyx.Drawer", open: false, components: [
          {classes: "deco", style: "text-align: center;", components: [
            {content: '<span style="color: #9E0508; font-weight: bold;"> mySongs &ndash; v. 0.5 </span><br>'
              + "&copy; 2013 <a href='mailto:reischuck.micha@googlemail.com'>Micha Reischuck</a><br>"
              + 'License: <a href="http://opensource.org/licenses/mit-license.php">MIT</a>', allowHtml: true},
            {kind: "Image", src: Helper.iconPath()+"icon128.png"}
          ]},
        ]}
      ]},
      // InfoDialog
      {name: "infoScroller", kind: "enyo.Scroller", fit: 1, components: [ 
        {classes: "deco", components: [
          {name: "copyboxdiv", classes: "divider", content: $L("Copyright"), showing: false},
          {name: "copybox"},
          {name: "authorboxdiv", classes: "divider", content: $L("Author(s)"), showing: false},
          {name: "authorbox"},
          {name: "songboxdiv", classes: "divider", content: $L("Song"), showing: false},
          {name: "songbox"},
        ]},
      ]},
      // ADD: Comments, Variant?
      // ADD: Themes?
      
      // FontDialog
      {kind: "enyo.Scroller", fit: 1, components: [
        {classes: "deco", components: [
          {content: $L("Font size:"), classes: "divider"},
          {components: [
            {style: "width:50%; display:inline-block; text-align:left;", content: $L("small")},
            {style: "width:50%; display:inline-block; text-align:right;", content: $L("large")}
          ]},
          {name: "size", kind: "onyx.Slider", onChange: "sliderChanged", max: 10},
          {tag: "br"},
          {content: $L("Line spacing:"), classes: "divider"},
          {components: [
            {style: "width:50%; display:inline-block; text-align:left;", content: $L("small")},
            {style: "width:50%; display:inline-block; text-align:right;", content: $L("large")}
          ]},
          {name: "space", kind: "onyx.Slider", onChange: "sliderChanged", max: 10}
        ]}
      ]},
      
      // Editing
      // Edit Add list
      {name: "addList", kind: "List", classes: "inner-panels", style: "height: 100%;", onSetupItem: "getAdd", components: [
        {name: "addItem", ontap: "addTab", components: [
          {name: "addTitle", classes: "item"}
        ]}
      ]},
      
      // Edit element
      {kind: "enyo.Scroller", fit: 1, components: [
        {classes: "deco", components: [
          {kind: "FittableColumns", style: "margin: .5rem;", components: [
            {content: $L("name") + ": ", style: "width: 5.5rem; padding: .5rem 0;", classes: "editlabel"},
            {kind: "onyx.InputDecorator", style: "width: 60%;", components: [
              {name: "elname", kind: "onyx.Input", placeholder : $L("name")}
            ]}
          ]},
          {kind: "FittableColumns", style: "margin: .5rem;", components: [
            {content: $L("language") + ": ", style: "width: 5.5rem; padding: .5rem 0;", classes: "editlabel"},
            {kind: "onyx.InputDecorator", style: "width: 60%;", components: [
              {name: "language", kind: "onyx.Input", placeholder: $L("language")}
            ]}
          ]},
          {content: $L("parts"), classes: "divider"},
          {kind: "FittableColumns", style: "margin: .5rem;", components: [
            {kind: "onyx.InputDecorator", fit: 1, components: [
              {name: "editpart1", kind: "onyx.Input", placeholder: $L("part")},
            ]},
            {name: "addPartsButton", kind: "onyx.IconButton", src: Helper.iconPath()+"add.png", style: "margin: .25rem 0 0 .5rem !important;", ontap: "addPart"}
          ]},
          {name: "edittext1", classes: "preview"},
          {name: "parts"},
        ]}
      ]}
      
    ]},
    {name: "footerToolbar", kind: "onyx.Toolbar", components: [
      {name: "closeButton", kind: "onyx.Button", content: $L("Close"), ontap: "closeClicked"},
      {name: "deleteButton", kind: "onyx.Button", classes: "onyx-negative", style: "float: right;", content: $L("delete element"), ontap: "deleteElement", showing: false},
    ]},
  ],
  
  smallPane: function() {
    this.applyStyle("min-width", "10rem");
    this.applyStyle("max-width", "10rem");
  },
  
  largePane: function() {
    this.applyStyle("min-width", "18rem");
    this.applyStyle("max-width", "18rem");
  },
  
  // Menu
  showMenu: function() {
    this.largePane();
    this.$.Pane.setIndex(0);
    this.$.title.setContent($L("Menu"));
  },
  
  showAbout: function() {
    this.$.about.setOpen(!this.$.about.open);
  },
  
  showPreferences: function() {
    this.owner.$.viewPane.$.preferences.setOldIndex(this.owner.$.viewPane.$.viewPanels.index);
    this.owner.$.viewPane.$.preferences.setPrefs();
    this.owner.$.viewPane.$.viewPanels.setIndex(2);
    this.owner.$.infoPanels.setIndex(0);
    !Helper.phone() || this.owner.$.mainPanels.setIndex(1);
  },
  
  refresh: function() {
    this.owner.refreshLibrary();
    this.owner.$.infoPanels.setIndex(0);
  },
  
  newSong: function() {
    this.owner.openCreateSong();
    this.owner.$.infoPanels.setIndex(0);
  },
  
  showHelp: function() {
    this.owner.$.viewPane.$.viewPanels.setIndex(0);
    this.owner.$.infoPanels.setIndex(0);
    !Helper.phone() || this.owner.$.mainPanels.setIndex(1);
  },
  
  // Info
  showInfo: function(data) {
    this.largePane();
    this.$.title.setContent($L("Song Info"));
    this.destroyInfo();
    this.infoset(data);
    this.$.infoScroller.render();
    this.$.Pane.setIndex(1);
  },
  
  destroyInfo: function() {
    this.$.copybox.destroyClientControls();
    this.$.authorbox.destroyClientControls();
    this.$.songbox.destroyClientControls();
    this.$.copyboxdiv.hide();
    this.$.authorboxdiv.hide();
    this.$.songboxdiv.hide();
  },

  addDiv: function(box, cap, extra) {
    if (cap) {
      this.$[box + "div"].show();
      b = this.$[box];
      b.createComponent({
        classes: "about",
        allowHtml: true,
        content: extra + $L(cap)
      });
    }
  },

  infoset: function(data) {
    if (data.released) {
      this.addDiv("copybox", data.released + ":", "&copy; ");
    }
    this.addDiv("copybox", data.copyright, "");
    if (data.publisher !== data.copyright) {
      this.addDiv("copybox", data.publisher, "");
    }
    var authors = ParseXml.authorsToString(data.authors);
    for(i = 0; i < authors.length; i++) {
      this.addDiv("authorbox", authors[i], "");
    };
    for(j = 0; j < data.songbooks.length; j++) {
      if (data.songbooks[j].no) {
        this.addDiv("songbox", data.songbooks[j].book + ': ' + 
          data.songbooks[j].no, "");
      } else {
        this.addDiv("songbox", data.songbooks[j].book, "");
      }
    }
    this.addDiv("songbox", data.key, $L("key: "));
    if (!isNaN(data.tempo)) {
      this.addDiv("songbox", data.tempo, $L("tempo") + " (bpm): ");
    } else {
      this.addDiv("songbox", data.tempo, $L("tempo") + ": ");
    }
    this.addDiv("songbox", data.duration, $L("duration") + ": ");
    this.addDiv("songbox", data.ccli, "CCLI: ");
  },
  
  // Font 
  showFont: function() {
    this.largePane();
    this.$.Pane.setIndex(2);
    this.$.title.setContent($L("Font Settings"));
    this.$.size.setValue(this.css.size);
    this.$.space.setValue(this.css.space);
  },
  
  sliderChanged: function(inSender, inEvent) {
    enyo.log(inSender.name + " changed to " + Math.round(inSender.getValue()));
    this.css[inSender.name] = Math.round(inSender.getValue());
    this.owner.setFont(this.css);
  },
  
  // Editing
  // got to add
  goToAdd: function(type) {
    this.smallPane();
    this.$.Pane.setIndex(3);
    this.$.title.setContent($L("Add new:"));
    this.back = type;
    this.$.addList.setCount(this[type+"List"].length);
    this.$.addList.refresh();
  },
  
  // populate addList
  getAdd: function(inSender, inEvent) {
    var r = this[this.back+"List"][inEvent.index];
    var isRowSelected = inSender.isSelected(inEvent.index);
    this.$.addItem.addRemoveClass("item-selected", isRowSelected);
    this.$.addItem.addRemoveClass("item-not-selected", !isRowSelected);
    this.$.addTitle.setContent($L(r));
  },
  
  addTab: function(inSender, inEvent) {
    enyo.log("add new:", this[this.back+"List"][inEvent.rowIndex]);
    this.owner.$.viewPane.$.editToaster.$[this.back + "Pane"].addNew(this[this.back+"List"][inEvent.rowIndex]);
    this.owner.$.infoPanels.setIndex(0);
  },
  
  // Element Details
  editElement: function(element, title) {
    this.$.title.setContent(title);
    this.$.Pane.setIndex(4);
    this.largePane();
    this.$.closeButton.setContent($L("Done"));
    this.$.deleteButton.show();
    this.setElement(element);
  },
  
  elementChanged: function() {
    enyo.log("edit element:", this.element);
    this.parts = [1];
    for (i in this.element) {
      if (i === "lines") {
        this.$.parts.destroyClientControls();
        for (j=0, le = this.element[i].length; j < le; j++) {
          if (j>0) { this.addPart("init");}
          this.$["editpart"+(j+1)].setValue(this.element[i][j].part);
          this.$["edittext"+(j+1)].setContent(this.element[i][j].text);
        }
      } else {
        this.$[i].setValue(this.element[i]);
      }
    }
  },
  
  addPart: function(i) {
    var num = this.parts.slice(-1)[0]+1;
    this.$.parts.createComponents([
      {name: "box" + num, kind: "FittableColumns", style: "margin: .5rem;", components: [
        {kind: "onyx.InputDecorator", fit: 1, components: [
          {name: "editpart"+ num, kind: "onyx.Input", owner: this, placeholder: $L("part")},
        ]},
        {name: "delPB" + num, kind: "onyx.IconButton", src: Helper.iconPath()+"remove.png", style: "margin: .25rem 0 0 .5rem !important;", ontap: "delPart"}
      ]},
      {name: "edittext" + num, classes: "preview"}
      ], {owner: this});
    if (i !== "init") { // if add button used 
      this.element.lines.push({"part": "", "text": ""});
    }
    this.parts.push(num);
    this.$.parts.render();
  },
  
  delPart: function(inSender) {
    var y = parseInt(inSender.name.replace("delPB", ""));
    for (x in this.parts) {
      if (this.parts[x] === y) {
        this.parts.splice(x,1);
        this.$["box"+y].destroy();
        this.$["edittext"+y].destroy();
        this.$.parts.render();
      }
    }
  },
  
  deleteElement: function() {
    this.owner.$.viewPane.$.editToaster.$.lyricsPane.deleteElement();
    this.closeClicked();
  },
  
  getData: function() {
    var data = {
      elname: this.$.elname.getValue(),
      language: this.$.language.getValue(),
      lines: []
    };
    for (i in this.parts) {
      data.lines.push({part: this.$["editpart"+this.parts[i]].getValue(), text: this.element.lines[this.parts[i]-1].text});
    }
    return data;
  },
  
  closeEdit: function() {
    var el = this.getData();
    var id = el.elname;
    if (el.language) {
      id = id + "_" + el.language;
    }
    this.owner.$.viewPane.$.editToaster.$.lyricsPane.insertSamePlace(id, el);
  },
  
  // Swipe right to close
  dragFinish: function(inSender, inEvent) {
    if (+inEvent.dx > 120) {
      this.closeClicked();
    }
  },
  
  // close
  closeClicked: function(sender) {
    switch (this.$.Pane.getIndex()) {
      case 2: this.owner.saveCss(this.css);
              break;
              
      case 4: this.$.closeButton.setContent($L("Close"));
              this.$.deleteButton.hide();
              this.closeEdit();
              break;
    }
    this.owner.$.infoPanels.setIndex(0);
  }
});
