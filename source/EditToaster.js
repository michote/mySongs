enyo.kind({
  name: "Edit", 
  kind: "FittableRows",
  published: {
    file: undefined,
    xml: undefined,
    metadata: {},
    lyrics: {}
  },
  components: [
    {name: "headerToolbar", kind: "onyx.Toolbar", components: [
      {kind: "FittableColumns", style: "width: 100%; margin: 0; padding: 0;", components: [
        {classes: "song title", content: $L("Edit"), classes: "side", style: "text-align: left; padding: .25rem .375rem;"},
        {kind: "FittableColumns",  classes: "middle", style: "margin: 0; padding: 0; text-align: center;", components: [
          {name: "meta", kind: "onyx.ToggleIconButton", src: Helper.iconPath()+"title.png", ontap: "toggleMeta", value: true},
          {name: "lyrics",  kind: "onyx.ToggleIconButton", src: Helper.iconPath()+"lyrics.png", ontap: "toggleLyrics"}
        ]},
        {name: "title", content: $L("Title"), classes: "song title side", style: "text-align: right; padding: .25rem .375rem;"}
      ]}
    ]},
    {name: "editPane", kind: "Panels", fit: true, arrangerKind: "CarouselArranger", draggable: false, components: [
      {name: "metaPane", kind: "EditMeta", classes: "inner-panels"},
      {name: "lyricsPane", kind: "EditLyrics", classes: "inner-panels"}
    ]},
    {name: "footerToolbar", kind: "onyx.Toolbar", style: "text-align:center;", components: [
      {kind: "my.Grabber", ontap:"grabber"},
      {kind: "onyx.Button", classes: "onyx-negative", style: "width: " + (Helper.phone() ? "32%" : "8rem") + "; margin: 0;", content: $L("Discard"), ontap: "closeThis"},
      {style: "width: " + (Helper.phone() ? .25 : .75) + "rem;"},
      {kind: "onyx.Button", classes: "onyx-affirmative", style: "width:  " + (Helper.phone() ? "32%" : "8rem") + "; margin: 0;", content: $L("Done"), ontap: "saveClicked"},
      {name: "add", kind: "onyx.IconButton", src: Helper.iconPath()+"add.png", style: "float: right;", ontap: "add"}
    ]}
  ],
  
  toggleMeta: function() {
    this.$.editPane.setIndex(0);
    this.$.lyrics.setValue(false);
    this.owner.owner.$.infoPanels.setIndex(0);
    this.$.lyricsPane.saveModifications();
  },
  
  toggleLyrics: function() {
    this.$.editPane.setIndex(1);
    this.$.meta.setValue(false);
    this.owner.owner.$.infoPanels.setIndex(0);
    this.$.metaPane.saveModifications();
  },
  
  xmlChanged: function() {
    if (this.xml) {
      this.lyrics = ParseXml.editLyrics(this.xml);
      this.$.lyricsPane.setLyrics(this.lyrics);
      this.metadata = ParseXml.allMetadata(this.xml);
      this.$.metaPane.setMetadata(this.metadata);
      this.$.title.setContent(this.metadata.titles[0].title);
    }
  },
  
  add: function() {
    this.owner.owner.$.infoPanels.setIndex(1);
    this.owner.owner.$.sidePane.goToAdd(this.$.editPane.getIndex() ? "lyrics" : "meta");
  },
  
  grabber: function() {
    this.owner.owner.$.mainPanels.setIndex(this.owner.owner.$.mainPanels.index ? 0 : 1);
  },
  
  saveClicked: function(s) {
    this.$.metaPane.saveModifications();
    this.$.lyricsPane.saveModifications();
    //~ enyo.log("save:", WriteXml.edit(this.xml, this.metadata, this.lyrics));
    this.owner.owner.writeXml(this.file, WriteXml.edit(this.xml, this.metadata, this.lyrics), this.metadata.titles[0].title);
    this.owner.$.songViewPane.renderLyrics();
    this.owner.$.viewPanels.setIndex(1);
  },
  
  closeThis: function() {
    this.setXml(undefined);
    this.owner.$.viewPanels.setIndex(1);
  }
});