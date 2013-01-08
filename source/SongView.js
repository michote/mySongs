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
    elWidth: 5,
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
        {kind: "FittableColumns", classes: "side", components: [
          {name: "playButton", kind: "onyx.IconButton", toggling: true, src: Helper.iconPath()+"play.png", ontap: "togglePlay"},
          {fit: true},
          {name: "printButton", kind: "onyx.IconButton", src: Helper.iconPath()+"print.png", ontap: "print", showing: Helper.browser()},
          {name: "editButton", kind: "onyx.IconButton", src: Helper.iconPath()+"edit.png", ontap: "openEdit"},
          {name: "infoButton", kind: "onyx.IconButton", src: Helper.iconPath()+"info.png", ontap: "showInfo"}
        ]}
      ]}
    ]},
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
    this.$.backButton.setShowing(this.showPrefs.showScroll);
    this.$.forthButton.setShowing(this.showPrefs.showScroll);
    this.$.transposergr.setShowing(this.showPrefs.showTransposer);
    this.$.playButton.setShowing(this.showPrefs.showAuto);
    this.$.printButton.setShowing(Helper.browser() ? this.showPrefs.showPrint : false);
  },
  
  start: function() {
    this.renderLyrics();
    this.initCursor();
  },
  
  renderLyrics: function() {
    this.xml = this.owner.owner.dataList[this.file];
    this.lang = undefined;
    //~ enyo.log("render lyrics of", this.file); 
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
    //~ enyo.log("add", l, "toggle");
    this.$.languagegr.createComponent(
      {name: l, kind: "onyx.IconButton", src: Helper.iconPath()+"flag.png", owner: this, components: [
        {content: l, classes: "flag-button"}
      ]}
    );
  },
  
  toggleLang: function(inSender, inEvent) {
    if (inEvent.originator.getActive()) {
      enyo.log("The \"" + inEvent.originator.name + "\" radio button is selected.");
      this.lang = inEvent.originator.name;
      this.metaDataSet();
      this.lyricDataSet();
    }
  },
  
  // ### set Data ###
  metaDataSet: function() {
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
          if (this.showPrefs.showName) {
            var t = $L(formL[i][0].charAt(0)).charAt(0)
              + formL[i][0].substring(1, formL[i][0].length) + ":";
            this.$.lyric.createComponent({
              name: i,
              kind: "FittableColumns",
              fit: true,
              classes: Helper.phone() ? "lyric lyricmar-phone" : "lyric lyricmar",
              components: [
                {content: t, classes: "element", style: "width: " + (2 + this.elWidth * 0.1) + "rem;"},
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
    this.$.lyric.render();
  },

  // ### Autoscroll ###
  togglePlay: function() { 
    if (this.$.playButton.src === Helper.iconPath()+"play.png") { 
      // play
      if (this.lyricsCurrRow !== 0) {
        // paused
        this.running = true;
      } else { 
        // begining to play
        this.initForTextPlay();
        this.running = true;
        this.finished = false;
        var perRowMSecs = 1000*this.songSecs/this.rowsTraversed;
        this.intervalSong = window.setInterval(enyo.bind(this, "showLyrics"), perRowMSecs);
        if (window.PalmSystem) {
          enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {'blockScreenTimeout': true});
        }
        // this.$.cursorScrollBar.setBpmTimer(120);
      }
      this.$.playButton.setProperty("src", Helper.iconPath()+"pause.png");
      this.$.forthButton.setDisabled(false);
      this.$.forthButton.setDisabled(true);
      this.$.backButton.setDisabled(true);
      //this.$.printButton.setDisabled(true);
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
    if ((this.lyricsCurrRow > this.halfHt) && (this.lyricsCurrRow < (this.rowsTraversed - this.halfHt))) {
      return true;
    } else {
      return false;
    }
  },

  resetCursorTiming: function() {
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
    this.cursorRow = 0;
    this.lyricsCurrRow = 0;
    this.$.viewScroller.setScrollTop(this.lyricsCurrRow);
    this.$.cursorScrollBar.setY(this.cursorRow);    
    this.$.cursorScrollBar.clearCursor();
    window.clearInterval(this.intervalSong);
    this.$.playButton.setProperty("src", Helper.iconPath()+"play.png");
    this.$.cursorScrollBar.$.cursor.color = this.$.cursorScrollBar.offColor;
    this.finished = false;
    this.$.cursorScrollBar.hide();
    //~ if (window.PalmSystem && (this.$.lockButton.getIcon() === "assets/images/lock-open.png")) {
      //~ enyo.windows.setWindowProperties(enyo.windows.getActiveWindow(), {'blockScreenTimeout': false});
    //~ }
    //~ if (this.data.titles) { 
      //~ var theTitles = ParseXml.titlesToString(this.data.titles); 
      //~ this.$.title.setContent(theTitles);
    //~ }
    this.$.editButton.setDisabled(false);
    this.$.fontButton.setDisabled(false);
    this.$.forthButton.setDisabled(false);
    this.$.backButton.setDisabled(false);
    this.$.printButton.setDisabled(false);
  },
  
  initForTextPlay: function() {
    var ctrls = this.$.lyric.getControls();
    this.rowsTraversed = this.$.lyric.node.clientHeight;
    for (i = 0; i < ctrls.length; i++) {
      if (ctrls[i].name === "scrollspacer") {
        this.rowsTraversed = this.rowsTraversed - this.$.lyric.node.lastChild.clientHeight + 20;
      }
    }
    this.halfHt = this.$.viewScroller.node.clientHeight / 2;
    this.$.viewScroller.setScrollTop(this.lyricsCurrRow);
    this.$.cursorScrollBar.$.canvas.height = this.$.viewScroller.node.clientHeight;
    this.$.cursorScrollBar.$.canvas.update();
    if (this.data.duration) {
      this.songSecs = this.data.duration;
    } else {
      this.songSecs = this.defaultSongSecs;
    }
    this.$.cursorScrollBar.$.cursor.color = this.$.cursorScrollBar.onColor;
    this.$.cursorScrollBar.hasNode().height = this.$.viewScroller.node.clientHeight;
    this.$.cursorScrollBar.show();
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
      //~ enyo.log(k);
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
      enyo.log("next Song");
      o.setCurrentIndex(o.currentIndex+1);
    }
  },
  
  prevSong: function() {
    var o = this.owner.owner;
    if (o.currentIndex > 0) {
      enyo.log("prev Song");
      o.setCurrentIndex(o.currentIndex-1);
    }
  },
  
  // Swipe left and right
  songDragFinish: function(inSender, inEvent) {
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
    this.owner.owner.$.infoPanels.setIndex(1);
    this.owner.owner.$.sidePane.showMenu();
  },
  
  openEdit: function() {
    this.owner.$.viewPanels.setIndex(3);
    this.owner.$.editToaster.setXml(this.xml);
    this.owner.$.editToaster.setFile(this.file);
  },
  
  showInfo: function() {
    this.owner.owner.$.infoPanels.setIndex(1);
    this.owner.owner.$.sidePane.showInfo(this.data);
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
  
  showFontDialog: function() {
    this.owner.owner.$.infoPanels.setIndex(1);
    this.owner.owner.$.sidePane.showFont();
  },
  
  // ### Print ###
  print: function() {
    this.printAdd();
    this.owner.owner.$.mainPanels.setAnimate(false);
    this.owner.owner.$.mainPanels.setIndex(1);
    this.$.viewScroller.setScrollTop(0);
    window.print();
    this.owner.owner.$.mainPanels.setIndex(0);
    this.owner.owner.$.mainPanels.setAnimate(true);
    this.renderLyrics();
  },
  
  printAdd: function() { // add Copyright-box for printing
    var printCopy = ParseXml.authorsToString(this.data.authors).join('<br>');
    printCopy += '<br>&copy; '
    if (this.data.released) { printCopy += this.data.released + ' ';}
    if (this.data.copyright) { printCopy += this.data.copyright;}
    if (this.data.publisher) { printCopy += '<br>' + this.data.publisher;}
    printCopy += '<br>---<br>Printed with mySongs'
    this.$.lyric.createComponent({
      classes: "printCopy",
      allowHtml: true,
      content: printCopy
      });
    this.$.lyric.render();
  }
});
