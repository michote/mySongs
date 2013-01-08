enyo.kind({
  name: "Preferences",
  kind: "FittableRows",
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
    }
  },
  components: [
    {name: "headerToolbar", kind: "onyx.Toolbar", style: "text-align:center;", components: [
      {name: "title", classes: "title", content: $L("Preferences"), allowHtml: true},
      {kind: "Image", src: Helper.iconPath()+"icon48.png", classes: "prefsimage"}
    ]},
    {kind: "enyo.Scroller", fit: 1, classes: "michote-scroller", horizontal: "hidden", components: [
      {name: "box", kind:"FittableRows", classes:"box-center", components:[
        {kind: "onyx.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: $L("Display Settings")},
          {kind: "FittableColumns", style: "padding: .5rem;", style: "padding: .5rem;", components: [
            {fit: 1, content: $L("Sort Lyric")},
            {kind: "onyx.ToggleButton", name: "sortLyrics", value: false, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {kind: Helper.phone() ? "FittableRows" : "FittableColumns", style: "padding: .5rem;", components: [
            {fit: 1, content:  $L("Show in bottom toolbar:")},
            {name: "showinToolbar", kind: "onyx.RadioGroup", onActivate: "toggleShowinToolbar", style: "margin: -.1875rem 0", components: [
              {name: "copyright", content: $L("copyright"), active: true},
              {name: "authors", content: $L("author")},
              {name: "publisher", content: $L("publisher")}
            ]}
          ]},
          {kind: "FittableColumns", style: "padding: .5rem;", style: "padding: .5rem;", components: [
            {fit: 1, content:  $L("Show Chords")},
            {kind: "onyx.ToggleButton", name: "showChords", value: true, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {kind: "FittableColumns", style: "padding: .5rem;", style: "padding: .5rem;", components: [
            {fit: 1, content:  $L("Show Comments")},
            {kind: "onyx.ToggleButton", name: "showComments", value: false, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {kind: "FittableColumns", style: "padding: .5rem;", style: "padding: .5rem;", components: [
            {fit: 1, content:  $L("Show elementname (e.g. V1:)")},
            {kind: "onyx.ToggleButton", name: "showName", value: true, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]}
        ]},
        
        {kind: "onyx.Groupbox", components:[
          {kind: "onyx.GroupboxHeader", content: $L("Button Settings")},
          {kind: "FittableColumns", style: "padding: .5rem;", style: "padding: .5rem;", components: [
            {fit: 1, content:  $L("Show Transposer")},
            {kind: "onyx.ToggleButton", name: "showTransposer", value: true, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {kind: "FittableColumns", style: "padding: .5rem;", style: "padding: .5rem;", components: [
            {fit: 1, content:  $L("Show Scrollbuttons")},
            {kind: "onyx.ToggleButton", name: "showScroll", value: true, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {kind: "FittableColumns", style: "padding: .5rem;", style: "padding: .5rem;", components: [
            {fit: 1, content:  $L("Show Autoscrollbutton")},
            {kind: "onyx.ToggleButton", name: "showAuto", value: true, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {kind: "FittableColumns", style: "padding: .5rem;", style: "padding: .5rem;", components: [
            {fit: 1, content:  $L("Autoscroll end to next page (on button press)")},
            {kind: "onyx.ToggleButton", name: "scrollToNext", value: true, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]},
          {kind: "FittableColumns", style: "padding: .5rem;", showing: Helper.browser(), components: [
            {fit: 1, content:  $L("Show Printbutton")},
            {kind: "onyx.ToggleButton", name: "showPrint", value: true, onChange: "toggle", onContent: $L("yes"), offContent: $L("no") }
          ]}
        ]},
        {kind: "onyx.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: $L("Dropbox Settings")},
          {name:"log", kind:"FittableColumns", style: "padding: .5rem;", components: [
            {fit: 1, content:  $L("Logout from Dropbox")},
            {name: "spinner", kind:"jmtk.Spinner", color: "#000000", diameter: (Helper.ratio() * 32), style: "margin-right: .5rem; height: 2rem;"},
            {name: "login", kind:"onyx.Button", content: "Login", classes: "onyx-affirmative", ontap:"logTapped", showing: false},
            {name: "logout", kind:"onyx.Button", content: "Logout", classes: "onyx-negative", ontap:"logTapped"}
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
    this.getPrefs();
    this.owner.$.songViewPane.setShowPrefs(this.showPrefs);
    this.$.spinner.setDiameter(Helper.ratio() * 32);
  },
  
  // Dropbox Logout
  dropboxClientChanged: function() {
    enyo.log("show Logout Button", this.dropboxClient);
    this.$.spinner.hide();
    this.$.login.setShowing(!this.dropboxClient);
    this.$.logout.setShowing(this.dropboxClient);
    this.$.log.resized();
  },  
  
  logTapped: function (inSender) {
    this.$.spinner.show();
    this.$.log.resized();
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
      enyo.log("got showPrefs", Helper.getItem("showPrefs"));
    }
  },
  
  setPrefs: function() {
    this.getPrefs();
    for (i in this.showPrefs) {
      enyo.log("set in UI: ", i, this.showPrefs[i]);
      if (i === "showinToolbar") {
        this.$[this.showPrefs[i]].setActive(true);
      } else {
        this.$[i].setValue(this.showPrefs[i]);
      }
    }
    this.$.box.resized();
  },
  
  savePrefs: function() {
    Helper.setItem("showPrefs", this.showPrefs);
    enyo.log("saved showPrefs", this.showPrefs);
    this.owner.$.songViewPane.setShowPrefs(this.showPrefs);
    this.owner.$.viewPanels.setIndex(this.oldIndex);
  },

  // Toggle Events
  toggleShowinToolbar: function (inSender, inEvent) {
    if (inEvent.originator.getActive()) {
      enyo.log("toggled:", inSender.name, inEvent.originator.name);
      this.showPrefs[inSender.name] = inEvent.originator.name;
    }
  },

  toggle: function (inSender, inEvent) {
    enyo.log("toggled:", inSender.name, inEvent.value);
    this.showPrefs[inSender.name] = inEvent.value;
  },
  
  grabber: function() {
    this.owner.owner.$.mainPanels.setIndex(this.owner.owner.$.mainPanels.index ? 0 : 1);
  }
});
