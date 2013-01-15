enyo.kind({
  name: "SidePane",
  kind: "FittableRows",
  classes: "side-pane enyo-fit",
  // Data
  metaList: ["title", "author", "songbook", "comment"],
  lyricsList: ["v", "c", "b", "p", "e"],
  baseChord: ["Ab", "A", "A#", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#"],
  chordExten: ["", "m", "m7", "maj7", "sus4", "0", "9", "maj", "sus", "dim", "+"],
  base: undefined,
  exten: undefined,
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
    {name: "Pane", kind: "Panels", draggable: false, fit: true, components: [
      // Menu
      {name: "menuScroller", kind: "enyo.Scroller", fit: true, ondragfinish: "dragFinish", components: [ 
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
            {content: '<span style="color: #9E0508; font-weight: bold;">'+Helper.app+' &ndash; v. '+Helper.vers +'</span><br>'
              + "&copy; 2013 <a href='mailto:reischuck.micha@googlemail.com'>Micha Reischuck</a><br>"
              + 'License: <a href="http://opensource.org/licenses/mit-license.php">MIT</a>', allowHtml: true},
            {kind: "Image", src: Helper.iconPath()+"icon128.png"}
          ]},
        ]}
      ]},
      // InfoDialog
      {name: "infoScroller", kind: "enyo.Scroller", fit: true, ondragfinish: "dragFinish", components: [ 
        {classes: "deco", components: [
          {name: "copyboxdiv", classes: "divider", content: $L("Copyright"), showing: false},
          {name: "copybox"},
          {name: "authorboxdiv", classes: "divider", content: $L("Author(s)"), showing: false},
          {name: "authorbox"},
          {name: "songboxdiv", classes: "divider", content: $L("Song"), showing: false},
          {name: "songbox"},
          {name: "commentboxdiv", classes: "divider", content: $L("comments"), showing: false},
          {name: "commentbox"},
          //~ {name: "themeboxdiv", classes: "divider", content: $L("themes"), showing: false},
          //~ {name: "themebox"},
        ]},
      ]},
      // ADD: Comments, Variant?
      // ADD: Themes?
      
      // FontDialog
      {kind: "enyo.Scroller", fit: 1, ondragfinish: "dragFinish", components: [
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
      {name: "addList", kind: "List", classes: "inner-panels", ondragfinish: "dragFinish", style: "height: 100%;", onSetupItem: "getAdd", components: [
        {name: "addItem", ontap: "addTab", components: [
          {name: "addTitle", classes: "item"}
        ]}
      ]},
      
      // Edit element
      {kind: "enyo.Scroller", fit: 1, ondragfinish: "dragFinish", components: [
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
      ]},
      
      // Chordpicker
      {kind: "FittableColumns", classes: "enyo-fit", components: [
        {name: "baseList", kind: "List", ondragfinish: "dragFinish", style: "height: 100%; width: 5rem", onSetupItem: "getBase", components: [
          {name: "baseItem", ontap: "addChord", components: [
            {name: "baseTitle", classes: "item"}
          ]}
        ]},
        {name: "extenList", kind: "List", ondragfinish: "dragFinish", style: "height: 100%; width: 5rem", onSetupItem: "getExten", components: [
          {name: "extenItem", ontap: "addChord", components: [
            {name: "extenTitle", classes: "item"}
          ]}
        ]}
      ]},
      
      // Import
      {kind: "enyo.Scroller", fit: true, classes: "michote-scroller", horizontal: "hidden", components: [
        {name: "box", kind:"FittableRows", classes:"box-center", components:[
          {name: "titlebox", kind: "onyx.Groupbox", components:[
            {kind: "onyx.GroupboxHeader", components: [
              {content: $L("Insert text to import here ...")},
              {kind: "onyx.IconButton", src: Helper.iconPath()+"help.png", ontap: "openHelp", classes: "editbutton"}
            ]},
            {name: "importHelp", kind: "onyx.Drawer", open: false, components: [
              {content: "The first single line is interpretted as the title.Subsequent single lines (followed by a blank line) can contain the properties values of the OpenLyrics specification: eg author(s), Release Date etc.<br><br>If the title line is present then a complete OpenLyrics song file is produced.<br><br>The lyrics blocks can optionally include chord lines. A chord line is defined as a line containing more than 50% of valid OpenLyrics chord names or two of them separated by a '/' . If present a chord line is expected to be followed by the corresponding lyrics line.<br><br>Chords can also be embedded in the lyrics lines in ChordPro format ie [A].<br><br>Verses are separated by a single blank line or a line containing [x] where x can be v, b, c, e, p under the OpenLyrics specification and will become a verse label which will have sequential numbers added to it to identify each verse. A blank line defaults to a [v] label.<br><br>The generator will also generate OpenLyrics lyrics blocks from OpenSong and ChordPro formatted lyric lists.", allowHtml: true, style: "padding: .5rem; color: #fff; background-color: rgba(0,0,0,0.7); line-height: normal;"}
            ]},
            {kind: "onyx.InputDecorator", style: "min-height: 20rem; max-width: 800px", alwaysLooksFocused: true, ontap: "importFocus", components: [
              {name: "importText", kind: "onyx.RichText", allowHtml: false}
              
            ]}
          ]}
        ]}
      ]}
      
    ]},
    {name: "footerToolbar", kind: "onyx.Toolbar", style: "text-align:center;", components: [
      {name: "closeButton", kind: "onyx.Button", content: $L("Close"), ontap: "closeClicked"},
      {name: "deleteButton", kind: "onyx.Button", classes: "onyx-negative", ontap: "deleteElement", showing: false},
    ]},
  ],
  
  largePane: function() {
    this.applyStyle("min-width", "16rem");
    this.applyStyle("max-width", "16rem");
  },
  
  // Menu
  showMenu: function() {
    this.log("show menu");
    this.largePane();
    this.$.Pane.setIndex(0);
    this.$.title.setContent($L("Menu"));
  },
  
  showAbout: function() {
    this.log((this.$.about.open ? "close" : "open") + " aboutDrawer");
    this.$.about.setOpen(!this.$.about.open);
  },
  
  showPreferences: function() {
    this.log("opening Preferences");
    this.owner.$.viewPane.$.preferences.setOldIndex(this.owner.$.viewPane.$.viewPanels.index);
    this.owner.$.viewPane.$.preferences.setPrefs();
    this.log(1);
    this.owner.$.viewPane.$.viewPanels.setIndex(2);
    this.log(2);
    this.owner.$.infoPanels.setIndex(0);
    this.log(3);
    !Helper.phone() || this.owner.$.mainPanels.setIndex(1);
    this.log(4);
  },
  
  refresh: function() {
    this.owner.refreshLibrary();
    this.owner.$.infoPanels.setIndex(0);
  },
  
  newSong: function() {
    this.log("create a new Song, opnening popup ...");
    this.owner.openCreateSong();
    this.owner.$.infoPanels.setIndex(0);
  },
  
  showHelp: function() {
    this.log("show help panel")
    this.owner.$.viewPane.$.viewPanels.setIndex(0);
    this.owner.$.infoPanels.setIndex(0);
    this.owner.setCurrentIndex(undefined);
    !Helper.phone() || this.owner.$.mainPanels.setIndex(1);
  },
  
  // Info
  showInfo: function(data) {
    this.log("show info panel")
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
    this.$.commentbox.destroyClientControls();
    //~ this.$.themebox.destroyClientControls();
    this.$.copyboxdiv.hide();
    this.$.authorboxdiv.hide();
    this.$.songboxdiv.hide();
    this.$.commentboxdiv.hide();
    //~ this.$.themeboxdiv.hide();
  },

  addDiv: function(box, cap, extra) {
    if (cap) {
      this.log(cap);
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
    this.log();
    if (data.released) {
      this.addDiv("copybox", data.released + ":", "&copy; ");
    }
    this.addDiv("copybox", data.copyright, "");
    if (data.publisher !== data.copyright) {
      this.addDiv("copybox", data.publisher, "");
    }
    var authors = ParseXml.authorsToString(data.authors);
    for (i = 0, l = authors.length; i < l; i++) {
      this.addDiv("authorbox", authors[i], "");
    };
    for (j = 0, l = data.songbooks.length; j < l; j++) {
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
    for (k = 0, l = data.comments.length; k < l; k++) {
      this.addDiv("commentbox", data.comments[k], "");
    }
  },
  
  // Font 
  showFont: function() {
    this.log("open Font Settings")
    this.largePane();
    this.$.Pane.setIndex(2);
    this.$.title.setContent($L("Font Settings"));
    this.$.size.setValue(this.css.size);
    this.$.space.setValue(this.css.space);
  },
  
  sliderChanged: function(inSender, inEvent) {
    this.log(inSender.name + " changed to " + Math.round(inSender.getValue()));
    this.css[inSender.name] = Math.round(inSender.getValue());
    this.owner.setFont(this.css);
  },
  
  // Editing
  // got to add
  goToAdd: function(type) {
    this.applyStyle("min-width", "10rem");
    this.applyStyle("max-width", "10rem");
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
    this.log("add new:", this[this.back+"List"][inEvent.rowIndex]);
    this.owner.$.viewPane.$.editToaster.$[this.back + "Pane"].addNew(this[this.back+"List"][inEvent.rowIndex]);
    this.owner.$.infoPanels.setIndex(0);
  },
  
  // Element Details
  editElement: function(element, title) {
    this.$.title.setContent(title);
    this.$.Pane.setIndex(4);
    this.applyStyle("min-width", "18rem");
    this.applyStyle("max-width", "18rem");
    this.$.closeButton.setContent($L("Done"));
    this.$.deleteButton.setContent($L("delete element"));
    this.$.deleteButton.show();
    this.setElement(element);
  },
  
  elementChanged: function() {
    this.log("edit element:", this.element);
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
    switch (this.$.Pane.getIndex()) {
      case 4: this.owner.$.viewPane.$.editToaster.$.lyricsPane.deleteElement();
              this.closeClicked();
              break;
              
      case 6: this.$.closeButton.setContent($L("Close"));
              this.$.deleteButton.hide();
              break;
    }
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
  
  // ChordPicker
  openPicker: function() {
    this.applyStyle("min-width", "10rem");
    this.applyStyle("max-width", "10rem");
    this.$.title.setContent($L("Chord Picker"));
    this.$.closeButton.setContent($L("Insert"));
    this.$.baseList.setCount(this.baseChord.length);
    this.$.baseList.refresh();
    this.$.extenList.setCount(this.chordExten.length);
    this.$.extenList.refresh();
    this.$.Pane.setIndex(5);
  },
  
  // populate Pickerlists
  getBase: function(inSender, inEvent) {
    var r = this.baseChord[inEvent.index];
    var isRowSelected = inSender.isSelected(inEvent.index);
    this.$.baseItem.addRemoveClass("item-selected", isRowSelected);
    this.$.baseItem.addRemoveClass("item-not-selected-trans", !isRowSelected);
    this.$.baseTitle.setContent(r);
  },
  
  getExten: function(inSender, inEvent) {
    var r = this.chordExten[inEvent.index];
    var isRowSelected = inSender.isSelected(inEvent.index);
    this.$.extenItem.addRemoveClass("item-selected", isRowSelected);
    this.$.extenItem.addRemoveClass("item-not-selected-trans", !isRowSelected);
    this.$.extenTitle.setContent(r);
  },
  
  addChord: function(inSender, inEvent) {
    this.log(this[inSender.name === "baseItem" ? "baseChord" : "chordExten"][inEvent.rowIndex]);
    this[inSender.name === "baseItem" ? "base" : "exten"] = this[inSender.name === "baseItem" ? "baseChord" : "chordExten"][inEvent.rowIndex];
  },
  
  getFullChord: function() {
    if (this.base) {
      var chord = "[" + this.base;
      if (this.exten) {
        chord = chord + this.exten;
      }
      return chord + "]";
    } else {
      return false;
    }
  },
  
  // Import
  showImport: function() {
    this.applyStyle("min-width", "100%");
    this.applyStyle("max-width", "100%");
    this.$.closeButton.setContent($L("Import"));
    this.$.deleteButton.setContent($L("Cancel"));
    this.$.deleteButton.show();
    this.$.Pane.setIndex(6);
    this.$.importText.setValue("");
    this.$.title.setContent($L("Import"));
  },
  
  openHelp: function() {
    this.$.importHelp.setOpen(!this.$.importHelp.getOpen());
  },
  
  importFocus: function() {
    this.$.importText.focus();
  },
  
  import: function() {
    this.owner.importSong(convLyrics(this.$.importText.getValue().replace(/<div>/g, '').replace(/<\/div>/g, '<br>').replace(/<br>/g, '\n').replace(/&nbsp;/g, ' ')));
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
              
      case 5: this.$.closeButton.setContent($L("Close"));
              this.log(this.getFullChord());
              break;
              
      case 6: this.$.closeButton.setContent($L("Close"));
              this.$.deleteButton.hide();
              this.import();
              break;
    }
    this.owner.$.infoPanels.setIndex(0);
  }
});
