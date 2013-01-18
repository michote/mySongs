enyo.kind({
  name: "EditLyrics",
  kind: "FittableRows",
  classes: "enyo-fit",
  published: {
    lyrics: {},
    element: undefined,
    chord: undefined,
  },
  components: [
    {kind: "enyo.Scroller", fit: true, classes: "michote-scroller", horizontal: "hidden", components: [
      {name: "lyric", kind:"FittableRows", classes:"box-center"}
    ]},
  ],
  
  lyricsChanged: function() {
    this.$.lyric.destroyClientControls();
    var button = [];
    for (i in this.lyrics) { // verses
      var cap = $L(this.lyrics[i].elname.charAt(0)) + " " + this.lyrics[i].elname.substring(1, this.lyrics[i].elname.length);
      if (this.lyrics[i].language) {
        cap = cap + ' (' + this.lyrics[i].language + ')'
      }
      this.$.lyric.createComponent(
        {name: i, kind: "onyx.Groupbox", owner: this, components: [
          {kind: "onyx.GroupboxHeader", components: [
            {content: cap},
            {name: "eB"+i, kind: "onyx.IconButton", src: Helper.iconPath()+"edit.png", ontap: "openEdit", classes: "editbutton"}
          ]}
        ]}
      );
      for (j in this.lyrics[i].lines) {  // lines
        if (this.lyrics[i].lines[j].part) {
          this.$[i].createComponent(
            {style: "color: #9E0508; padding: .5rem;", owner: this, content: this.lyrics[i].lines[j].part}
          );
        }
        this.$[i].createComponent(
          {kind: "onyx.InputDecorator", components: [
            {name: i+"text"+j, kind: "onyx.RichText", value: this.lyrics[i].lines[j].text, placeholder: $L("type lyrics here"), ontap: "storeEditEl", owner: this}
          ]}
        );
      }
      button.push(this.lyrics[i].elname); 
    }
    button = Helper.removeDoubles(button);
    this.owner.$.metaPane.setButton(button);
    this.$.lyric.render();
  },
  
  // Add new elements
  addNew: function(add) {
    this.log(add);
    this.saveModifications();
    var e = [];
    for (i in this.lyrics) {
      if (add === i.charAt(0)) {
        e.push(i)
      }
    }
    if (!e.length) {
      var z = "";
    } else if (e.slice(-1)[0].length === 1) {
      var z = 1;
    } else {
      var z = parseInt(e.slice(-1)[0].substring(1, e.slice(-1)[0].length))+1;
    }
    this.lyrics[add+z] = { 
      elname: add+z, 
      language: null, 
      lines:[{"part":"","text":""}]
    };
    this.lyricsChanged();
  },
  
  saveModifications: function() {
    this.log("save lyrics modification");
    for (i in this.lyrics) {
      for (j in this.lyrics[i].lines) {
        var l = this.$[i+"text"+j].getValue().replace(/<div>/g, '').replace(/<\/div>/g, '<br>');
        l.substring(l.length-4, l.length) === '<br>' ? l = l.substring(0, l.length-4) : l = l;
        this.lyrics[i].lines[j].text = l;
      }
    }
    this.owner.setLyrics(this.lyrics);
  },
  
  // ### Edit Dialog ###
  openEdit: function(inSender) {
    this.log();
    this.saveModifications();
    var i = inSender.name.replace("eB", "");
    this.el = i;
    this.owner.owner.owner.$.infoPanels.setIndex(1);
    this.owner.owner.owner.$.sidePane.editElement(this.lyrics[i], $L("Edit") + " " + $L(i.charAt(0)) + " " + i.substring(1, i.length))
  },
  
  insertSamePlace: function(id, el) {
    this.setLyrics(Helper.insertSame(this.lyrics, id, el, this.el));
  },
  
  deleteElement: function() {
    this.log();
    delete this.lyrics[this.el];
    this.lyricsChanged();
  },
  
  // Chord Picker 
  storeEditEl: function(inSender) {
    if (Helper.browser()) {
      !this.chord || inSender.insertAtCursor(this.chord);
    } else {
      this.el = inSender.name;
      this.log(this.el);
    }
  },
  
  storeRange: function() {
    this.log();
    if (this.el) {
      var elObj = this.$[this.el];
      elObj.focus();
      if (elObj.getSelection) {
        sel = elObj.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          var range = sel.getRangeAt(0);
        }
      }  
    this.log(range);
    this.elrange = range;
    }
  },
});
