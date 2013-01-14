// #################
//
// Copyright (c) 2012 Micha Reischuck
//
// MySongBook is available under the terms of the MIT license. 
// The full text of the MIT license can be found in the LICENSE file included in this package.
//
// #################


enyo.kind({
  name: "SongView",
  kind: "FittableRows",
  classes: "enyo-fit",
  // Properties
  defaultSongSecs: 200, // seconds for song
  songSecs: this.defaultSongSecs, 
  intervalSong: 0,
  running: false,
  lyricsCurrRow: 0,
  halfHt: 0,
  rowsTraversed: 0,
  cursorRow: 0,
  textIndex: 0,
  scroll: 0,
  transpose: 0,
  order: [],  
  fullscreen: false,
  lang: undefined,
  finished: true,
  dur: ["Ab", "A", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#"],
  moll: ["Abm", "Am", "Bbm", "Bm", "Cm", "C#m", "Dbm", "Dm", "D#m", "Ebm", "Em", "Fm", "F#m", "Gbm", "Gm", "G#m"],
  transposeList: [],
  published: {
    file: "",
    data: {},
    xml: undefined,
    first: true,
    // Prefs
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
    {kind: "Signals", onkeydown: "handleKeyPress"},
    // Drawer for Phone Title and Copyright !!
    {name: "titleDrawer", kind: "onyx.Drawer", open: false, classes: "searchbar hochk", components: [
      {style: "color: #fff; padding: .5rem; background-color: rgba(0,0,0,0.6); text-align: center;", ontap: "closeTitle", components: [
        {name: "titleText", classes: "title", allowHtml: true},
      ]}
    ]},
    {name: "headerToolbar", kind: "onyx.Toolbar", ondragfinish: "titleDragFinish", components: [
      {name: "titlefit", kind: "FittableColumns", style: "width: 100%; margin: 0; padding: 0;", components: [
        {fit: true, components: [
          {name: "title", classes: "title quer", style: "line-height: 2rem;", allowHtml: true}
        ]},
        {kind: "FittableColumns", components: [
          {name: "languagegr", kind: "Group", defaultKind: "onyx.IconButton", onActivate: "toggleLang"},
          {name: "trSpacer", kind: "my.Spacer", showing: false},
          {name: "transposergr", kind: "FittableColumns", components: [
            {name: "transminus", kind: "onyx.IconButton", src: Helper.iconPath()+"minus.png", style: "width: 1.25rem;", ontap: "transMinus", disabled: true},
            {name: "transposer", kind: "onyx.Button", classes: "reintext-button", style: "width: " + (Helper.phone() ? 3.5 : 5) + "rem; margin-top: -.25rem", ontap: "transButton"},
            {kind: "onyx.IconButton", name: "transplus", src: Helper.iconPath()+"plus.png", style: "width: 1.25rem;", ontap: "transPlus", disabled: true},
            {kind: "my.Spacer"}
          ]},
          //~ {name: "lockButton", kind: "onyx.IconButton", toggling: true, icon: "images/lock-open.png", onclick: "toggleLock"},
          {name: "fontButton", kind: "onyx.IconButton", src: Helper.iconPath()+"font.png", ontap: "showFontDialog"},
          {name: "prefsButton", kind: "onyx.IconButton", src: Helper.iconPath()+"prefs.png", ontap: "showMenu"}
        ]}
      ]}
    ]},
    {name:"transposePanels", kind: "Panels", fit: true, arrangerKind: "CollapsingArranger", draggable: false, components: [
      {name: "viewIncScrollBar", kind: "FittableColumns", fit: true, classes:"app-panels inner-panels", components: [
        {name: "cursorScrollBar", kind: "cursorScrollBar", ontap: "resetCursorTiming", classes: "cursor"},
        {name: "viewScroller", kind: "enyo.Scroller", classes: "michote-scroller", horizontal: "hidden", fit: true, components: [
          {name: "lyric", ondragfinish: "songDragFinish", ondblclick: "onDoubleClick"}
        ]}
      ]},
      {name: "transposeList", kind: "List", touch: true, count: 16, style: "height: 100%; min-width: 4rem; max-width: 4rem; visibility: hidden;", classes: "side-pane", onSetupItem: "getTranspose", components: [
          {name: "transposeListItem", ontap: "transposeTab", components: [
            {name: "transposeListTitle", classes: "item"}
          ]}
      ]},
    ]},
    {name: "footerToolbar", kind: "onyx.Toolbar", pack: "center", components: [
      {kind: "FittableColumns", style: "width: 100%; margin: 0; padding: 0;", components: [
        {kind: "FittableColumns", classes: "side", components: [
          {kind: "my.Grabber", ontap: "grabber"},
          {name: "copy", classes: "title copy quer", fit: true, content: "&copy; michote", style: "padding: .3125rem 0;", allowHtml: true}
        ]},
        {kind: "FittableColumns",  classes: "middle", components: [
          {name: "backButton", kind: "onyx.IconButton", disabled: true, src: Helper.iconPath()+"back.png", ontap: "textBack"}, 
          {style: "width: " + (Helper.phone() ? .75 : 2) + "rem;"},
          {name: "forthButton", kind: "onyx.IconButton", disabled: true, src: Helper.iconPath()+"forth.png", ontap: "textForth"}
        ]},
        {name: "buttonfit", kind: "FittableColumns", classes: "side", stlye: "text-align: right;", components: [
          {name: "playButton", kind: "onyx.IconButton", toggling: true, src: Helper.iconPath()+"play.png", ontap: "togglePlay"},
          {fit: true},
          {name: "printButton", kind: "onyx.IconButton", src: Helper.iconPath()+"print.png", ontap: "print", showing: Helper.browser()},
          {name: "editButton", kind: "onyx.IconButton", src: Helper.iconPath()+"edit.png", ontap: "openEdit"},
          {name: "infoButton", kind: "onyx.IconButton", src: Helper.iconPath()+"info.png", ontap: "showInfo"}
        ]}
      ]}
    ]}
  ],
  
  create: function() {
    this.inherited(arguments);
  },
  
  showPrefsChanged: function() {
    if (this.xml) {
      this.renderLyrics();
    } else {
      this.buttons();
    }
  },
  
  buttons: function() {
    this.log("redraw buttons");
    this.$.backButton.setShowing(this.showPrefs.showScroll);
    this.$.forthButton.setShowing(this.showPrefs.showScroll);
    this.$.transposergr.setShowing(this.showPrefs.showTransposer);
    this.$.playButton.setShowing(this.showPrefs.showAuto);
    this.$.printButton.setShowing(Helper.browser() ? this.showPrefs.showPrint : false);
    this.$.buttonfit.resized();
  },
  
  start: function() {
    this.renderLyrics();
    this.initCursor();
  },
  
  renderLyrics: function() {
    this.xml = this.owner.owner.dataList[this.file.toLowerCase()];
    this.lang = undefined;
    this.log("render lyrics of", this.file); 
    this.buttons();
    this.$.transposeList.applyStyle("visibility", "hidden");
    var transposition = ParseXml.get_metadata(this.xml, "transposition");
    if (transposition && this.first) {
      this.transpose = parseInt(transposition);
      this.first = false;
    } else if (this.first) {
      this.transpose = 0;
      this.first = false;
    } else {
      this.first = false;
    }
    this.data = ParseXml.parse(this.xml, this.showPrefs.showChords, this.showPrefs.showComments, this.transpose);
    this.log("get data");
    if (this.data.titles !== undefined) {
      this.textIndex = 0; // reset index
      this.scroll = 0;    // reset scroller
      // Languages
      this.$.languagegr.destroyClientControls();
      this.$.trSpacer.hide();
      if (this.data.haslang[0]) { 
        this.createLangToggle(this.data.haslang);
        this.$.trSpacer.show();
        this.$.languagegr.render();
      }
      // render data
      this.metaDataSet();
      this.lyricDataSet();
      // Buttons
      this.enableTransposer(this.data.key, this.data.haschords, this.transpose);
      if (this.finished) {  // auto-scroll not active
        this.$.editButton.setDisabled(false);
        this.$.printButton.setDisabled(false);
        this.$.backButton.setDisabled(true); 
        if (this.data.verseOrder && 
          (this.textIndex === (this.data.verseOrder.length-1))) {
          this.$.forthButton.setDisabled(true);
        } else {
          this.$.forthButton.setDisabled(false);
        }
      }
    }
    this.$.titlefit.resized();
  },
  
  // ### Transposer ###
  getTranspose: function(inSender, inEvent) {
    var r = this.transposeList[inEvent.index];
    var isRowSelected = inSender.isSelected(inEvent.index);
    this.$.transposeListItem.addRemoveClass("item-selected", isRowSelected);
    this.$.transposeListItem.addRemoveClass("item-not-selected-trans", !isRowSelected);
    this.$.transposeListTitle.setContent(r);
  },
  
  enableTransposer: function(key, chords, transp) {
    if (key && chords) {
      this.log("enable Transposer");
      this.$.transminus.setDisabled(false);
      this.$.transplus.setDisabled(false);
      this.transposeList = (key.charAt(key.length-1) === "m") ? this.moll : this.dur;
      this.$.transposeList.reset();
      for (i in this.transposeList) { 
        if (this.transposeList[i] === key) { 
          this.$.transposeList.select(i);
        }
      }
      this.$.transposer.setContent(transp ? Transposer.transpose(key, transp) : key);
      this.$.transposer.show();
    } else if (!key && chords) {
      this.log("enable Transposer without key");
      this.$.transminus.setDisabled(false);
      this.$.transplus.setDisabled(false);
      this.$.transposer.hide();
    } else {
      this.$.transminus.setDisabled(true);
      this.$.transplus.setDisabled(true);
      this.$.transposer.hide();
    }
  },
  
  transButton: function() {
    this.$.transposeList.applyStyle("visibility", "visible");
  },
  
  transposeTab: function(inSender, inEvent) {
    this.setTrans(Transposer.getDelta(this.data.key, this.transposeList[inEvent.rowIndex]));
    this.$.transposeList.applyStyle("visibility", "hidden");
  },
  
  setTrans: function(value) {
    if (value > 11) {
      value -= 12;
    } else if (value < -11) {
      value += 12;
    }
    this.log(value);
    this.transpose = value;
    this.renderLyrics();    
  },
  
  transPlus: function() {
    this.setTrans(this.transpose += 1);
  },
  
  transMinus: function() {
    this.setTrans(this.transpose -= 1);
  },
  
  transPick: function() {
    this.setTrans(Transposer.getDelta(this.data.key, this.$.transposer.getValue()));
  },
  
  // ### Language Toggle ###
  createLangToggle: function(l) {
    for (i in l) {
      this.addLangToggle(l[i]);
    }
    this.lang ? this.lang : this.lang = l[0];
    this.$[this.lang].setActive(true);
  },
  
  addLangToggle: function(l) {
    this.log("add", l, "toggle");
    this.$.languagegr.createComponent(
      {name: l, kind: "onyx.IconButton", src: Helper.iconPath()+"flag.png", owner: this, components: [
        {content: l, classes: "flag-button"}
      ]}
    );
  },
  
  toggleLang: function(inSender, inEvent) {
    if (inEvent.originator.getActive()) {
      this.log("The \"" + inEvent.originator.name + "\" radio button is selected.");
      this.lang = inEvent.originator.name;
      this.metaDataSet();
      this.lyricDataSet();
    }
  },
  
  // ### set Data ###
  metaDataSet: function() {
    this.log();
    var d = this.data;
    //~ format and set title
    var t = ParseXml.titlesToString(d.titles, this.lang);
    this.$.title.setContent(t);
    //~ format and set copyright
    var y = (d.released ? d.released + ": " :  ""); // add release year
    var copy = "";
    if (d[this.showPrefs.showinToolbar]) {
      copy = (this.showPrefs.showinToolbar === "authors" ? y + ParseXml.authorsToString(d.authors).join(", ") : "&copy; " + y + d[this.showPrefs.showinToolbar]);
    } else {
      copy = "&copy; " + y + $L("no" + this.showPrefs.showinToolbar);
    }
    this.$.copy.setContent(copy);
    this.$.titleText.setContent('<big><b>' + t + '</big></b><br><small>' + copy + '</small>'); 
  },
  
  lyricDataSet: function() {
    this.order = (this.lang ? Helper.orderLanguage(this.data.verseOrder, this.lang) : this.data.verseOrder);
    this.$.lyric.destroyClientControls();
    var d = this.data;
    //~ format and set lyrics
    if (d.lyrics) {
      var lyrics = "";
      if (d.lyrics === "nolyrics") {
        lyrics = $L(d.lyrics); 
      } else if (d.lyrics === "wrongversion") {
        lyrics = $L(d.lyrics);
      } else {
        if (this.showPrefs.sortLyrics) { //~ display lyrics like verseOrder
          var formL = Helper.orderLyrics(d.lyrics, this.order, this.lang);
          this.order = Helper.handleDoubles(this.order);
        } else { //~ display lyrics without verseOrder
          var formL = d.lyrics;
        }
        // Create lyric divs
        for (var i in formL) {
          this.log("create element ", i);
          if (this.showPrefs.showName) {
            var t = $L(formL[i][0].charAt(0)).charAt(0)
              + formL[i][0].substring(1, formL[i][0].length) + ":";
            this.$.lyric.createComponent({
              name: i,
              kind: "FittableColumns",
              fit: true,
              classes: Helper.phone() ? "lyric lyricmar-phone" : "lyric lyricmar",
              components: [
                {content: t, classes: "element", style: "width: 2em;"},
                {content: formL[i][1], fit: true, allowHtml: true}
            ]}, {owner: this});
          } else {
            this.$.lyric.createComponent({
              name: i,
              classes: Helper.phone() ? "lyric lyricmar-phone" : "lyric lyricmar",
              components: [
                {content: formL[i][1], allowHtml: true}
            ]}, {owner: this});
          }
          if (Helper.browser) { // needed for printing
            this.$.lyric.createComponent({ 
              classes: "pageBreak"
            });
          }
        }
      }
      this.$.lyric.render();
      // Scroll Spacer
      if (this.$.lyric.node.lastChild) {
        var x = this.$.lyric.node.lastChild.clientHeight;
        var h = window.innerHeight-138-x;
        if (h > 0) {
          this.$.lyric.createComponent({
            name: "scrollspacer",
            style: "height:" + h + "px;width:100%;",
            classes: "scrollspacer"
          });
        }
      }
    }
    this.$.lyric.render();
  },

  // ### Autoscroll ###
  togglePlay: function() { 
    this.log();
    if (this.$.playButton.src === Helper.iconPath()+"play.png") { 
      // play
      if (this.lyricsCurrRow !== 0) {
        // paused
        this.running = true;
      } else { 
        // begining to play
        this.initForTextPlay();
        this.$.cursorScrollBar.cursorOn();
        this.running = true;
        this.finished = false;
        var perRowMSecs = 1000*this.songSecs/this.rowsTraversed;
        this.intervalSong = window.setInterval(enyo.bind(this, "showLyrics"), perRowMSecs);
      }
      this.$.playButton.setProperty("src", Helper.iconPath()+"pause.png");
      this.$.forthButton.setDisabled(false);
      this.$.forthButton.setDisabled(true);
      this.$.backButton.setDisabled(true);
      this.$.printButton.setDisabled(true);
    } else { 
      //pause
      this.$.playButton.setProperty("src", Helper.iconPath()+"play.png");
      this.running = false;
      if (this.finished) {
        this.initCursor();
        if (this.showPrefs.scrollToNext) {
          this.nextSong();
        }
      }
    }
  },
  
  movingLyrics: function() {
    this.log();
    if ((this.lyricsCurrRow > this.halfHt) && (this.lyricsCurrRow < (this.rowsTraversed - this.halfHt))) {
      return true;
    } else {
      return false;
    }
  },

  resetCursorTiming: function() {
    this.log();
    // adjust the position of the cursor
    var yAdj = event.offsetY - this.cursorRow;  
    var lyricsPrevRow = this.lyricsCurrRow;  // save for later
    this.lyricsCurrRow = this.lyricsCurrRow + yAdj;
    if (this.lyricsCurrRow < this.halfHt) {
      this.cursorRow = this.lyricsCurrRow;
    } else if (this.lyricsCurrRow > (this.rowsTraversed - this.halfHt)) {
      this.cursorRow = 2 * this.halfHt - (this.rowsTraversed - this.lyricsCurrRow);
      this.$.viewScroller.setScrollTop(this.lyricsCurrRow - this.cursorRow);
    } else {
      this.cursorRow = this.halfHt;
    }
    this.$.cursorScrollBar.setY(this.cursorRow);
    // now adjust the speed of the cursor.
    this.songSecs = this.songSecs * lyricsPrevRow / this.lyricsCurrRow;
    window.clearInterval(this.intervalSong);
    var perRowMSecs = 1000*this.songSecs/this.rowsTraversed;
    this.intervalSong = window.setInterval(enyo.bind(this, "showLyrics"), perRowMSecs);
    if (this.data.titles) { var theTitles = ParseXml.titlesToString(this.data.titles); }
    this.$.title.setContent(theTitles + " (" + Math.floor(this.songSecs) + " secs)");
  },
  
  showLyrics: function() {
    if (this.running) {
      this.log();
      if (this.movingLyrics()) {
        this.$.viewScroller.setScrollTop(this.lyricsCurrRow - this.cursorRow);
      } else {
        this.cursorRow = this.cursorRow + 1;
        this.$.cursorScrollBar.setY(this.cursorRow);
      }
      this.lyricsCurrRow = this.lyricsCurrRow + 1;
      if (this.lyricsCurrRow > this.rowsTraversed) {
        window.clearInterval(this.intervalSong);
        this.$.cursorScrollBar.cursorOff();
        this.finished = true;
        this.running = false;
      }
    }
  },

  initCursor: function() {
    this.log();
    this.cursorRow = 0;
    this.lyricsCurrRow = 0;
    this.$.viewScroller.setScrollTop(this.lyricsCurrRow);
    this.$.cursorScrollBar.setY(this.cursorRow);    
    this.$.cursorScrollBar.cursorOff();
    window.clearInterval(this.intervalSong);
    this.$.playButton.setProperty("src", Helper.iconPath()+"play.png");
    this.finished = false;
    this.$.editButton.setDisabled(false);
    this.$.fontButton.setDisabled(false);
    this.$.forthButton.setDisabled(false);
    this.$.backButton.setDisabled(false);
    this.$.printButton.setDisabled(false);
  },
  
  initForTextPlay: function() {
    this.log();
    var ctrls = this.$.lyric.getControls();
    this.rowsTraversed = this.$.lyric.node.clientHeight;
    for (i = 0; i < ctrls.length; i++) {
      if (ctrls[i].name === "scrollspacer") {
        this.rowsTraversed = this.rowsTraversed - this.$.lyric.node.lastChild.clientHeight + 20;
      }
    }
    this.halfHt = this.$.viewScroller.node.clientHeight / 2;
    this.$.viewScroller.setScrollTop(this.lyricsCurrRow);
    this.$.cursorScrollBar.$.canvas.setAttribute("height", this.$.viewScroller.node.clientHeight);
    if (this.data.duration) {
      this.songSecs = this.data.duration;
    } else {
      this.songSecs = this.defaultSongSecs;
    }
    this.$.cursorScrollBar.cursorOff();
    this.$.cursorScrollBar.hasNode().height = this.$.viewScroller.node.clientHeight;
    this.$.editButton.setDisabled(true);
    this.$.fontButton.setDisabled(true);
  },
 
 
  // ### Scrolling Button/Keypress ###
  scrollHelper: function() {
    var x = this.$[this.order[this.textIndex]].hasNode();
    var ePos = Helper.calcNodeOffset(x).top - 74; // element offset - Toolbar and margin
    this.scroll = this.$.viewScroller.getScrollTop();   // scroll position
    this.$.viewScroller.scrollTo(0, (this.scroll + ePos));
  },
  
  textForth: function() {
    this.textIndex += 1;
    if (this.textIndex === 1) {
      this.$.backButton.setDisabled(false);
    } else if (this.textIndex === (this.data.verseOrder.length-1)) {
      this.$.forthButton.setDisabled(true);
    }
    if (this.textIndex === (this.data.verseOrder.length+1)) {
      this.nextSong();
    }
    if (this.textIndex <= (this.data.verseOrder.length-1)) {
      this.scrollHelper();
    }
  },
  
  textBack: function() {
    this.textIndex -= 1;
    if (this.textIndex === 0) {
      this.$.backButton.setDisabled(true);
    } else if (this.textIndex === (this.data.verseOrder.length-2)) {
      this.$.forthButton.setDisabled(false);
    }
    if (this.textIndex === -2) {
      this.prevSong();
    }
    if (this.textIndex >= 0) {
      this.scrollHelper();
    }
  },
  
  handleKeyPress: function(inSender, inEvent) {
    if (!this.running) {
      k = inEvent.keyCode;
      this.log(k);
      if ((k===33 || k===38 || k===37 || k===32) && this.textIndex > -2) { // PageUp
        this.textBack();
      } else if ((k===34 || k===40 || k===39 || k===13) && this.textIndex < this.data.verseOrder.length+1) { // PageDown
        this.textForth();
      }
    }
  },
  
  // Go to next/prev song
  nextSong: function() {
    var o = this.owner.owner;
    if (o.currentIndex >= 0 && o.currentIndex < o[o.currentList].content.length-1) {
      this.log("next Song");
      o.setCurrentIndex(o.currentIndex+1);
    }
  },
  
  prevSong: function() {
    var o = this.owner.owner;
    if (o.currentIndex > 0) {
      this.log("prev Song");
      o.setCurrentIndex(o.currentIndex-1);
    }
  },
  
  // Swipe left and right
  songDragFinish: function(inSender, inEvent) {
    this.log();
    if (+inEvent.dx > 120) {
      this.nextSong();
    }
    if (+inEvent.dx < -120) {
      this.prevSong();
    }
  },
  
  
  // Swipe down in Titlebar on Phone
  titleDragFinish: function(inSender, inEvent) {
    if (Helper.phone && !this.running) {
      if (+inEvent.dy > 50) {
        this.$.titleDrawer.setOpen(true);
      }
      if (+inEvent.dy < -50) {
        this.$.titleDrawer.setOpen(false);
      }
    }
  },
  
  closeTitle: function() {
    if (!this.running) {
      this.$.titleDrawer.setOpen(false);this.$.titleDrawer.setOpen(false);
    }
  },
  
  // Maximize view on doubleclick
  onDoubleClick: function() {
    this.log("double tap: set fullscreen: ", !this.fullscreen);
    this.fullscreen = !this.fullscreen;
    if (this.fullscreen === true) {this.$.titleDrawer.setOpen(false);
      this.$.headerToolbar.hide(); 
      this.$.footerToolbar.hide();
      this.owner.owner.$.mainPanels.setIndex(this.owner.owner.$.mainPanels.index ? 0 : 1);
    } else {
      this.$.headerToolbar.show(); 
      this.$.footerToolbar.show();
      this.owner.owner.$.mainPanels.setIndethis.$.titleDrawer.setOpen(false);x(this.owner.owner.$.mainPanels.index ? 0 : 1);
    }
    if (window.PalmSystem) {
      enyo.setFullScreen(this.fullscreen);
    }
  },
  
  // ### Button ###
  grabber: function() {
    this.owner.owner.$.mainPanels.setIndex(this.owner.owner.$.mainPanels.index ? 0 : 1);
  },
  
  showMenu: function() {
    this.log("show menu");
    this.owner.owner.$.infoPanels.setIndex(1);
    this.owner.owner.$.sidePane.showMenu();
  },
  
  openEdit: function() {
    this.log("open editmode for: ", this.file);
    this.owner.$.viewPanels.setIndex(3);
    this.owner.$.editToaster.setXml(this.xml);
    this.owner.$.editToaster.setFile(this.file);
    this.owner.$.editToaster.populate();
  },
  
  showInfo: function() {
    this.owner.owner.$.infoPanels.setIndex(1);
    this.owner.owner.$.sidePane.showInfo(this.data);
  },
  
  showFontDialog: function() {
    this.owner.owner.$.infoPanels.setIndex(1);
    this.owner.owner.$.sidePane.showFont();
  },
  
  //~ toggleLock: function() {
    //~ if (this.$.lockButton.getIcon() === "assets/images/lock-open.png") {
      //~ this.$.lockButton.setIcon("assets/images/lock.png");
      //~ if (window.PalmSystem) {
        //~ enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {"blockScreenTimeout" : true});
      //~ }
    //~ } else {
      //~ this.$.lockButton.setIcon("assets/images/lock-open.png");
      //~ if (window.PalmSystem) {
        //~ enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {"blockScreenTimeout" : false});
      //~ }
    //~ }
  //~ },
  
  
  // ### Print ###
  print: function() {
    var docURL = document.URL;
    docURL = docURL.slice(0, docURL.lastIndexOf('/')+1);
    var printWindow = window.open(docURL, 'Print Popup', 'width=800, height=600');
    var printCopy = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
    printCopy += '<html><head><title>Print Popup</title>';
    printCopy += '<link href="build/app.css" rel="stylesheet" />';
    printCopy += '</head><body>';
    printCopy += this.printHeader();
    printCopy += this.$.lyric.node.innerHTML;
    printCopy += this.printFooter();
    printCopy += '</body></html>';
    printWindow.document.write(printCopy);
    var maxWidth = 0;
    var thisTextEl = printWindow.document.getElementsByClassName("text");
    for (i in thisTextEl) {
      if (thisTextEl[i].clientWidth > maxWidth) {
        maxWidth = thisTextEl[i].clientWidth;
      }
    }
    var enlarge = (thisTextEl[0].parentElement.clientWidth - 30) / maxWidth;
    var spacerEl = printWindow.document.getElementsByClassName("scrollspacer");
    while (spacerEl.length > 0) {
      spacerEl[0].parentNode.removeChild(spacerEl[0]);
    }
    printWindow.document.body.style.fontSize = 20*enlarge + "px"; 
    var _this = this;
    this.timer = window.setTimeout(function() {_this.printIt(printWindow);}, 500);  // allow time for changes to load
  },
  
  printIt: function(theWindow) {
    theWindow.print();
    theWindow.close();
  },  

  printHeader: function() { // add Title(s) for printing
    var printCopy = "";
    if (this.data.titles != []) {
      for (i=0; i<this.data.titles.length; ++i) {
        var t = this.data.titles[i];
        if (t.lang == this.lang || t.lang == null) {
          printCopy += '<div class="printTitle">' + t.title + '</div>';
        }
      }
    }
    return printCopy;
  },
  
  printFooter: function() { // add Copyright-box for printing
    if (this.data.authors !== []) {
      var a;
      var printCopy = '<div class="printCopy">by<br>'; 
      for (i=0; i<this.data.authors.length; ++i) {
        var a = this.data.authors[i];
        if (a.lang == this.lang || a.lang == undefined || a.lang == "") {
          printCopy += "&nbsp;&nbsp;" + a.author;
          if (a.type !== null) {
            printCopy += " ("+ a.lang +" "+ a.type +")";
          }
        printCopy += "<br>";
        }
      }
    }
    if (this.data.released) { printCopy += this.data.released + ' ';}
    if (this.data.copyright) { printCopy += '&copy; ' + this.data.copyright + '<br>';}
    if (this.data.publisher) { printCopy += this.data.publisher + '<br>';}
    printCopy += '<br><br><center>Printed with mySongs</center></div>'
    return printCopy;
  }
});
