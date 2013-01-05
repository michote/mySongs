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
        {classes: "song title", content: $L("Edit"), style: "text-align: left; min-width: 35%; padding: .25rem .375rem;"},
        {kind: "FittableColumns", fit: true, style: "margin: 0; padding: 0; text-align: center; min-width: 30%", components: [
          {name: "meta", kind: "onyx.ToggleIconButton", src: Helper.iconPath()+"title.png", ontap: "toggleMeta", value: true},
          {name: "lyrics",  kind: "onyx.ToggleIconButton", src: Helper.iconPath()+"lyrics.png", ontap: "toggleLyrics"}
        ]},
        {name: "title", classes: "song title", content: $L("Title"), style: "text-align: right; min-width: 35%; padding: .25rem .375rem; float: right;"}
      ]}
    ]},
    {name: "editPane", kind: "Panels", fit: true, arrangerKind: "CarouselArranger", draggable: false, components: [
      {name: "metaPane", kind: "EditMeta", classes: "inner-panels"},
      {name: "lyricsPane", kind: "EditLyrics", classes: "inner-panels"}
    ]},
    {name: "footerToolbar", kind: "onyx.Toolbar", style: "text-align:center;", components: [
      {kind: "my.Grabber", ontap:"grabber"},
      {kind: "onyx.Button", classes: "onyx-negative", style: "width: 8rem;", content: $L("Discard"), ontap: "closeThis"},
      {kind: "onyx.Button", classes: "onyx-affirmative", style: "width: 8rem;", content: $L("Done"), ontap: "saveClicked"},
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
