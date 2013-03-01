enyo.kind({
  name: "Preferences",
  kind: "FittableRows",
  classes: "enyo-fit",
  published: {
    oldIndex: 0,
    dropboxClient: false,
    showPrefs: {
      sortLyrics: true,
      showinToolbar: "copyright",
      showChords: true,
      showComments: false,
      showName: true,
      showTransposer: true,
      showPrint: false,
      showScroll: true,
      showAuto: true,
      scrollToNext: true
    },
    sync: "auto",
  },
  components: [
    {name: "headerToolbar", kind: "onyx.Toolbar", style: "text-align:center;", components: [
      {name: "title", classes: "title", content: $L("Preferences"), allowHtml: true},
      {kind: "Image", src: Helper.iconPath()+"icon48.png", classes: "prefsimage"}
    ]},
    {kind: "enyo.Scroller", fit: true, classes: "michote-scroller", horizontal: "hidden", components: [
      {name: "box", kind:"FittableRows", classes:"box-center", components:[
        {kind: "onyx.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: $L("Display Settings")},
          {style: "padding: .5rem;", components: [
            {content: $L("Sort Lyric"), style: "display: inline-block; width: 73%;"},
            {kind: "onyx.ToggleButton", name: "sortLyrics", style: "display: inline-block; float: right; max-width: 27%;", value: false, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {kind: Helper.phone() ? "FittableRows" : "FittableColumns", style: "padding: .5rem;", components: [
            {content:  $L("Show in bottom toolbar:")},
            {name: "showinToolbar", kind: "onyx.RadioGroup", onActivate: "toggleShowinToolbar", style: "display: inline-block; float: right; margin: -.1875rem 0 !important", components: [
              {name: "copyright", content: $L("copyright")},
              {name: "authors", content: $L("author")},
              {name: "publisher", content: $L("publisher")}
            ]},
            {tag: "br", style: "clear:both;"}
          ]},
          {style: "padding: .5rem;", components: [
            {content: $L("Show Chords"), style: "display: inline-block; width: 73%;"},
            {kind: "onyx.ToggleButton", name: "showChords", style: "display: inline-block; float: right; max-width: 27%;", value: false, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {style: "padding: .5rem;", components: [
            {content: $L("Show Comments"), style: "display: inline-block; width: 73%;"},
            {kind: "onyx.ToggleButton", name: "showComments", style: "display: inline-block; float: right; max-width: 27%;", value: false, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {style: "padding: .5rem;", components: [
            {content: $L("Show elementname (e.g. V1:)"), style: "display: inline-block; width: 73%;"},
            {kind: "onyx.ToggleButton", name: "showName", style: "display: inline-block; float: right; max-width: 27%;", value: false, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]}
        ]},
        
        {kind: "onyx.Groupbox", components:[
          {kind: "onyx.GroupboxHeader", content: $L("Button Settings")},
          {style: "padding: .5rem;", components: [
            {content: $L("Show Transposer"), style: "display: inline-block; width: 73%;"},
            {kind: "onyx.ToggleButton", name: "showTransposer", style: "display: inline-block; float: right; max-width: 27%;", value: false, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {style: "padding: .5rem;", components: [
            {content: $L("Show Scrollbuttons"), style: "display: inline-block; width: 73%;"},
            {kind: "onyx.ToggleButton", name: "showScroll", style: "display: inline-block; float: right; max-width: 27%;", value: false, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {style: "padding: .5rem;", components: [
            {content: $L("Show Autoscrollbutton"), style: "display: inline-block; width: 73%;"},
            {kind: "onyx.ToggleButton", name: "showAuto", style: "display: inline-block; float: right; max-width: 27%;", value: false, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {style: "padding: .5rem;", components: [
            {content: $L("Autoscroll end to next page (on button press)"), style: "display: inline-block; width: 73%;"},
            {kind: "onyx.ToggleButton", name: "scrollToNext", style: "display: inline-block; float: right; max-width: 27%;", value: false, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {style: "padding: .5rem;", components: [
            {content: $L("Show Printbutton"), style: "display: inline-block; width: 73%;"},
            {kind: "onyx.ToggleButton", name: "showPrint", style: "display: inline-block; float: right; max-width: 27%;", value: false, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]}
        ]},
        {kind: "onyx.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: $L("Dropbox Settings")},
          {kind: Helper.phone() ? "FittableRows" : "FittableColumns", style: "padding: .5rem;", components: [
            {content:  $L("Sync")},
            {name: "sync", kind: "onyx.RadioGroup", onActivate: "toggleSync", style: "display: inline-block; float: right; margin: -.1875rem 0 !important", components: [
              {name: "startup", content: $L("on startup")},
              {name: "auto", content: $L("automatically")},
              {name: "manual", content: $L("manually")}
            ]},
            {tag: "br", style: "clear:both;"}
          ]},
          {style: "padding: .5rem;", components: [
            {content:  $L("Logout from Dropbox"), style: "display: inline-block; width: 65%;"},
            {name: "login", kind:"onyx.Button", content: "Login", classes: "onyx-affirmative", style: "float: right;", ontap:"logTapped", showing: false},
            {name: "logout", kind:"onyx.Button", content: "Logout", classes: "onyx-negative", style: "float: right;", ontap:"logTapped"},
            {name: "spinner", kind:"jmtk.Spinner", color: "#000000", diameter: (Helper.ratio() * 32), style: "margin-right: .5rem; height: 2rem; display: inline-block; float: right;"}
          ]}
        ]}
      ]}
    ]},
    {name: "footerToolbar", kind: "onyx.Toolbar", style: "text-align:center;", components: [
      {kind: "my.Grabber", ontap:"grabber"},
      {kind: "onyx.Button", content: $L("Done"), style: "width: 10rem;", ontap: "savePrefs"},
    ]}
  ],
  
  create: function() {
    this.inherited(arguments);
    this.log();
    this.getPrefs();
    this.owner.$.songViewPane.setShowPrefs(this.showPrefs);
  },
  
  // Dropbox Logout
  dropboxClientChanged: function() {
    this.log("show Logout Button", this.dropboxClient);
    this.$.spinner.hide();
    this.$.login.setShowing(!this.dropboxClient);
    this.$.logout.setShowing(this.dropboxClient);
  },  
  
  logTapped: function (inSender) {
    this.$.spinner.show();
    if (inSender.name === "logout") {
      this.owner.owner.signOut();
    } else {
      this.owner.owner.connectToDropbox();
      this.setOldIndex(0); // go back to helppane
    }
  },
  
  // Localstorage
  getPrefs: function() {
    if (Helper.getItem("showPrefs")) {
      this.showPrefs = Helper.getItem("showPrefs");
    }
    if (Helper.getItem("sync")) {
      this.sync = Helper.getItem("sync");
      this.owner.owner.setSync(this.sync);
    }
    this.log("got showPrefs", Helper.getItem("showPrefs"), "sync:", Helper.getItem("sync"));
  },
  
  setPrefs: function() {
    this.getPrefs();
    this.log("setting Preferences in UI"); 
    for (i in this.showPrefs) {
      this.log("set ", i, this.showPrefs[i]);
      if (i === "showinToolbar") {
        this.$[this.showPrefs[i]].setActive(true);
      } else {
        this.$[i].setValue(this.showPrefs[i]);
      }
    }
    this.log("set sync:", this.sync);
    this.$[this.sync].setActive(true);
  },
  
  savePrefs: function() {
    Helper.setItem("showPrefs", this.showPrefs);
    this.log("saved showPrefs", this.showPrefs);
    this.owner.$.songViewPane.setShowPrefs(this.showPrefs);
    this.owner.$.viewPanels.setIndex(this.oldIndex);
  },

  // Toggle Events
  toggleShowinToolbar: function (inSender, inEvent) {
    if (inEvent.originator.getActive()) {
      this.log("toggled:", inSender.name, inEvent.originator.name);
      this.showPrefs[inSender.name] = inEvent.originator.name;
    }
  },

  toggle: function (inSender, inEvent) {
    this.log("toggled:", inSender.name, inEvent.value);
    this.showPrefs[inSender.name] = inEvent.value;
  },
  
  toggleSync: function (inSender, inEvent) {
    if (inEvent.originator.getActive()) {
      this.log("toggled:", inSender.name, inEvent.originator.name);
      this.sync = inEvent.originator.name;
      Helper.setItem("sync", this.sync);
      this.owner.owner.setSync(this.sync);
    }
  },
  
  grabber: function() {
    this.owner.owner.$.mainPanels.setIndex(this.owner.owner.$.mainPanels.index ? 0 : 1);
  }
});
