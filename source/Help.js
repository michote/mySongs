enyo.kind({
  name: "Help",
  kind: "FittableRows",
  components: [
    {name: "headerToolbar", kind: "onyx.Toolbar", style: "text-align:center;", components: [
      {name: "title", classes: "title", content: $L("Help"), allowHtml: true},
      {kind: "Image", src: Helper.iconPath()+"icon48.png", classes: "prefsimage"},
      {name: "prefsButton", kind: "onyx.IconButton", src: Helper.iconPath()+"prefs.png", style: "float: right", ontap: "showMenu"},
      {name: "fontButton", kind: "onyx.IconButton", src: Helper.iconPath()+"font.png", style: "float: right", ontap: "showFontDialog"}
    ]},
    {name: "viewScroller", kind: "enyo.Scroller", classes: "michote-scroller", horizontal: "hidden", touch: true, fit: 1,
      components: [
      {name: "helpContent", kind: "FittableRows", classes:  Helper.phone() ? "lyric lyricmar-phone" : "lyric lyricmar", components: [
        {allowHtml: true, content: "<h1>" + $L("Welcome to ") + Helper.app},
        {allowHtml: true, content: Helper.app + $L(" is an App to display Songs in ")
          + '<a href="http://openlyrics.info/" target="_blank"> OpenLyrics XML Standard</a>' +
          $L(" from the internal storage of your device.") + "<br>" + 
          $L(" You can create custom lists of songs to display.") + "<br><br>",},
        {allowHtml: true, content: "<h2>" + $L("Icon Guide") + "</h2>"},
        
        {allowHtml: true, content: "<h3>" + $L("Main View") + "</h3>"},
        {tag: 'ul', classes: "help", components: [
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"flag-help.png", fit: false},
            {tag: 'p', content: $L("toggles language if present")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"minus-help.png"},
            {kind: "Image", src: Helper.iconPath()+"plus-help.png"},
            {tag: 'p', content: $L("Transposer")}
          ]},
          //~ {tag: 'il', components: [
            //~ {kind: "Image", src: Helper.iconPath()+"lock-open-help.png"},
            //~ {tag: 'p', content: $L("prevents the screen from dimming or turning off")}
          //~ ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"font-help.png", fit: false},
            {tag: 'p', content: $L("change fontsize and linespacing")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"back-help.png"},
            {tag: 'p', content: $L("scrolls lyrics back depending on verseorder")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"forth-help.png"},
            {tag: 'p', content: $L("scrolls lyrics forth depending on verseorder")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"play-help.png"},
            {tag: 'p', content: $L("start autoscroll")}
          ]},
          //~ {tag: 'il', components: [
            //~ {kind: "Image", src: Helper.iconPath()+"edit-help.png"},
            //~ {tag: 'p', content: $L("edit current song")}
          //~ ]},
          //~ {tag: 'il', components: [
            //~ {kind: "Image", src: Helper.iconPath()+"print-help.png"},
            //~ {tag: 'p', content: $L("print current song as displayed")}
          //~ ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"info-help.png"},
            {tag: 'p', content: $L("shows songinfo")}
          ]},
        ]},
        
        {allowHtml: true, content: "<h3>" + $L("List Pane") + "</h3>"},
        {tag: 'ul', classes: "help", components: [
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"search-help.png"},
            {tag: 'p', content: $L("opens and closes searchwindow")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"open-help.png"},
            {tag: 'p', content: $L("opens listpicker")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"library-help.png"},
            {tag: 'p', content: $L("toogles library")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"list-help.png"},
            {tag: 'p', content: $L("toogles custom list")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"add-help.png"},
            {tag: 'p', content: $L("adds song to active list or creates a new custom list")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"remove-help.png"},
            {tag: 'p', content: $L("removes song from list or removes the custom list")}
          ]},
        ]},
        
        {allowHtml: true, content: "<h3>" + $L("Search") + "</h3>"},
        {tag: 'ul', classes: "help", components: [
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"title-help.png"},
            {tag: 'p', content: $L("searches in titles")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"author-help.png"},
            {tag: 'p', content: $L("searches in authors")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"lyrics-help.png"},
            {tag: 'p', content: $L("searches in lyrics")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"key-help.png"},
            {tag: 'p', content: $L("searches in comments and themes")}
          ]},
        ]},
        {allowHtml: true, content: "<h3>" + $L("Editing") + "</h3>"},
        {tag: 'p', content: $L("Note: Everything you edit will only be stored temporarily until you hit 'done' and actually write the changes to XML or 'discard' to discard all changes you made.")},
        {tag: 'ul', classes: "help", components: [
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"title-help.png"},
            {tag: 'p', content: $L("opens metadata editing page")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"lyrics-help.png"},
            {tag: 'p', content: $L("opens lyrics editing page")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"add-help.png"},
            {tag: 'p', content: $L("adds a new metadata or lyric element")}
          ]},
          {tag: 'il', components: [
            {kind: "Image", src: Helper.iconPath()+"edit-help.png"},
            {tag: 'p', content: $L("edits a lyric element (rename, language, parts and delete)")}
          ]},
        ]},
        
        {allowHtml: true, content: "<h2>" + $L("Gesture Guide") + "</h2>"},
        {allowHtml: true, content: "<h3>" + $L("Main View") + "</h3>"},
        {allowHtml: true, content: 
          '<ul> \
            <li>' + $L("Swipe to the right to open next song in list") + '</li> \
            <li>' + $L("Swipe to the left to open previous song in list") + '</li> \
            <li>' + $L("Doubletab maximizes mainview") + '</li> \
            <li>' + $L("Swipe the sidepane to the right to close it") + '</li> \
          </ul>'},
        {tag: 'br'},
        
        //~ {allowHtml: true, content: "<h3>" + $L("List Pane") + "</h3>"},
        //~ {allowHtml: true, content: 
          //~ '<ul> \
            //~ <li>' + $L("Swipe an librarylist item to add it to the current custom list") + '</li> \
            //~ <li>' + $L("Swipe an custom list item to remove it from this list") + '</li> \
            //~ <li>' + $L("Swipe a list to remove it") + '</li> \
          //~ </ul>'},
        //~ {allowHtml: true, content: "<br>"},
        {allowHtml: true, content: '<h2><a href="http://dl.dropbox.com/u/1429945/MySongBook%20Documentation/index.html" target="_blank">'
          + 'Online Documentation</a></h2>'},
        {allowHtml: true, content: "<br>"},
        {allowHtml: true, content: "<h2>" + $L("Contact") + "</h2>"},
        {tag: 'ul', allowHtml: true, content:
          '<li><a href="mailto:reischuck.micha@googlemail.com">Micha Reischuck</a></li> \
          <li><a href="https://twitter.com/michote_" target="_blank">@michote_</a></li> \
          <li><a href="http://forums.webosnation.com/webos-homebrew-apps/318615-mysongbook.html" target="_blank">\
          webOS Nation forum thread</a></li>'},
        {allowHtml: true, content: "<br>"},
        {allowHtml: true, content: "<h2>" + $L("Open Source") + "</h2>"},
        {allowHtml: true, content: Helper.app +
          ' is available under the terms of the \
          <a href="http://opensource.org/licenses/mit-license.php" target="_blank">MIT license</a>.<br> The source can be found on \
          <a href="https://github.com/michote/mySongs" target="_blank">github</a>.'},
        {allowHtml: true, content: "<br>"},
        {allowHtml: true, content: "<h2>" + $L("Changelog") + "</h2>"},
        {allowHtml: true, content: "<b>Version 0.5</b>"},
        {tag: 'ul', allowHtml: true, content:
            '<li>Rewrite in Enyo2</li>'
          },
        {allowHtml: true, content: "<br>"},
        //~ {allowHtml: true, content: "<h2>" + $L("Special Thanks") + "</h2>"},
        //~ {allowHtml: true, content: 
          //~ '<ul> \
            //~ <li>johncc @webosnation for the Autoscroll feature</li> \
            //~ <li>ajguns @webosnation for the spanish translation</li> \
            //~ <li>@svzi for giving me an understanding of enyo ;)</li> \
            //~ <li>phoque @developer.palm.com for sharing his "Simple FileIO Service"</li> \
          //~ </ul>', onLinkClick: "linkClicked"},
        //~ {allowHtml: true, content: "<br>"}
      ]}
    ]},
    {name: "footerToolbar", kind: "onyx.Toolbar", components: [
      {kind: "my.Grabber", ontap:"grabber"},
    ]}
  ],
  
  grabber: function() {
    this.owner.owner.$.mainPanels.setIndex(this.owner.owner.$.mainPanels.index ? 0 : 1);
  },
  
  showFontDialog: function() {
    this.owner.owner.$.infoPanels.setIndex(2);
    this.owner.owner.$.sidePane.showFont();
  },
  
  showMenu: function() {
    this.owner.owner.$.infoPanels.setIndex(1);
    this.owner.owner.$.sidePane.showMenu();
  }
});
