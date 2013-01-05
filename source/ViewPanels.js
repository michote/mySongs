enyo.kind({
  name: "ViewPane",
  fit: true,
  realtimeFit: true,
  classes: "bg",
  components: [
    {kind: "Image", src: Helper.iconPath()+"bg.png", classes: "plec"},
    {name:"viewPanels", kind: "Panels",  classes:"enyo-fit", arrangerKind: "CarouselArranger", draggable: false, realtimeFit: true, components: [
      {name: "help", kind: "Help", classes: "inner-panels"},
      {name: "songViewPane", kind: "SongView", classes: "inner-panels", onBack: "goBack", onEdit: "editSong", onLinkClick: "linkClicked"},
      {name: "preferences", kind: "Preferences", classes: "inner-panels"},
      {name: "editToaster", kind: "Edit", classes: "inner-panels"}
    ]}
  ]
});

enyo.kind({
  name: "my.Spacer",
  kind: "FittableColumns",
  style: "height: 2rem;",
  components: [
    {style: "width: 1rem; border-right: .0625rem solid rgba(0,0,0,0.7); height: 2rem;"},
    {style: "width: 1rem; border-left: .0625rem solid rgba(255,255,255,0.3); height: 2rem;"}
  ]
});

enyo.kind({
  name: "my.Grabber",
  kind: "onyx.IconButton",
  src: Helper.iconPath()+"grabber.png", 
  style: "float: left"
});
