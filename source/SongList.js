// #################
//
// Copyright (c) 2012 Micha Reischuck
//
// MySongBook is available under the terms of the MIT license. 
// The full text of the MIT license can be found in the LICENSE file included in this package.
//
// #################


enyo.kind({
  name: "SongList",
  kind : "FittableRows",
  classes: "bg enyo-fit",
  // Properties
  searchF: "titles",
  searchCount: {"a": [], "b": []},
  xmlList: [],
  listIndex: undefined,
  components: [
    // Drawer for Phone Title and Copyright !!
    {name: "performanceDrawer", kind: "onyx.Drawer", open: false, classes: "searchbar", components: [
      {style: "color: #fff; padding: .5rem; background-color: rgba(0,0,0,0.6); text-align: center;", ontap: "closePerformance", components: [
        {name: "performanceText", classes: "title", allowHtml: true},
      ]}
    ]},
    // header Toolbar
    {name: "headerToolbar", kind: "onyx.Toolbar", ondragfinish: "performanceDragFinish", components: [
      {kind: "FittableColumns", style: "width: 100%; margin: 0; padding: 0;", components: [
        {name: "title", fit: true, classes: "title", style: "line-height: 2rem;", content: $L("Song List")},
        {kind: "FittableColumns", classes: "searchbuttons", components: [
          {name: "prefsButton", kind: "onyx.IconButton", src: Helper.iconPath()+"prefs.png", style: "float: right;", classes: "hochk", ontap: "showMenu"},
          {name: "searchButton", kind: "onyx.ToggleIconButton", src: Helper.iconPath()+"search.png", style: "float: right", ontap: "extendSearch", disabled: true},
          {name: "searchSpinner", style: "float: right; margin-top: 0;", showing: false, components: [
            {kind:"jmtk.Spinner", color: "#FFFFFF", diameter: (Helper.ratio() * 30)}
          ]}
        ]}
      ]}
    ]},
    
    // Search Drawer
    {name: "searchBar", kind: "onyx.Drawer", open: false, classes: "searchbar", components: [
      {kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
        {name: "searchBox", kind: "onyx.Input", placeholder: $L("search for ..."), style: "min-width: 90%; max-width: 95%;", oninput: "startSearch"},
      ]},
      {style: "width: 100%;", components: [
        {kind: "onyx.RadioGroup", onActivate:"searchFilter", style: "background-color: rgba(0,0,0,0.5); border-bottom: .0625rem solid rgba(0, 0, 0, 0.8);", controlClasses: "onyx-tabbutton tbicongroup", components: [ 
          {name: "titles", style: "width: 25%;", components: [{kind: "onyx.Icon", src: Helper.iconPath()+"title-help.png"}], active: true},
          {name: "authors", style: "width: 25%;", components: [{kind: "onyx.Icon", src: Helper.iconPath()+"author-help.png"}]},
          {name: "lyrics", style: "width: 25%;", components: [{kind: "onyx.Icon", src: Helper.iconPath()+"lyrics-help.png"}]},
          {name: "keys", style: "width: 25%;", components: [{kind: "onyx.Icon", src: Helper.iconPath()+"key-help.png"}]}
        ]}
      ]}
    ]},
    // New List Drawer
    {name: "newList", kind: "onyx.Drawer", open: false, classes: "searchbar", components: [
      {kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
        {name: "listName", kind: "onyx.Input", placeholder: $L("Enter listname"), style: "min-width: 90%; max-width: 95%;", onchange: "saveClicked"},
      ]},
      {name: "errorContent", style: "color: #fff; padding: .5rem; background-color: #9E0508;", showing: false},
      {classes: "newlist", components: [
        {kind: "onyx.Button", classes: "onyx-negative", style: "width: 50%;", content: $L("Cancel"), ontap: "clearDialog"},
        {kind: "onyx.Button", classes: "onyx-affirmative", style: "width: 50%;", content: $L("Save"), ontap: "saveClicked"}
      ]}
    ]},
    // Error Drawer
    {name: "error", kind: "onyx.Drawer", open: false, classes: "searchbar", components: [
      {style: "color: #fff; padding: .5rem; background-color: #9E0508; text-align: center; max-height: 20rem;", components: [
        {name: "errorText"},
        {tag: "br"},
        {kind: "onyx.Button", classes: "onyx-negative", style: "width: 80%;", content: $L("Close"), ontap: "close"}
      ]}
    ]},
    
    //~ // ### Lists ###
    {name: "listPane", kind: "Panels", arrangerKind: "CarouselArranger", draggable: false, fit: 1, index: 6, components: [
      {classes: "inner-panels", components: [
        {classes: "deco enyo-center", style: "text-align: center;", components: [
          {kind:"jmtk.Spinner", color: "#9E0508", diameter: (Helper.ratio() * 90)},
          {name: "readProgress", kind: "onyx.ProgressBar", showStripes: false},
          {name: "readFiles", tag: "b"}
        ]}
      ]},
      // Library List
      {name: "libraryList", kind: "List", classes: "inner-panels", style: "height: 100%;",
        reorderable: false, centerReorderContainer: false, enableSwipe: true,
        onSetupItem: "getLibrary", 
   			onSetupSwipeItem: "setupSwipeItem",
        onSwipeComplete: "swipeComplete",
        components: [
          {name: "libraryListItem", ontap: "listTab", components: [
            {name: "libraryListTitle", classes: "item"}
          ]}
        ],
   			swipeableComponents: [
          {name: "librarySwipeItem", classes: "enyo-fit swipeGreen", components: [
            {name: "librarySwipeTitle", classes: "item"}
          ]}
        ]
      },
      // Custom List
      {name: "customList", kind: "List", classes: "inner-panels", style: "height: 100%;", 
        reorderable: true, centerReorderContainer: false, enableSwipe: true,
        onSetupItem: "getCustomList", 
        onReorder: "listReorder",
        onSetupReorderComponents: "setupReorderComponents", 
   			onSetupSwipeItem: "setupSwipeItem",
        onSwipeComplete: "swipeComplete",
        components: [
          {name: "customListItem", ontap: "listTab", components: [
            {name: "customListTitle", classes: "item"}
          ]}
        ],
        reorderComponents: [
          {name: "customReorderContent", classes: "enyo-fit reorderDragger", components: [
            {name: "customReorderTitle", classes: "item"}
          ]}
        ],
   			swipeableComponents: [
          {name: "customSwipeItem", classes: "enyo-fit listSwipe", components: [
            {name: "customSwipeTitle", classes: "item"}
          ]}
        ]
      },
      //  No List
      {classes: "inner-panels", components: [
        {classes: "deco enyo-center", style: "text-align: center;", components: [
          {content: $L("Please select or define a list"), allowHtml: true},
          {tag: "br"},
          {kind: "onyx.Button", content: $L("Manage Lists"), style: "width: 100%; color: white;", ontap: "openListManager"}
        ]}
      ]},
      // List Management
      {name: "customListList", kind: "List", classes: "inner-panels", style: "height: 100%;", onSetupItem: "getListNames", components: [
        {name: "listNameItem", ontap: "manageTab", components: [
          {name: "listNameTitle", classes: "item"}
        ]}
      ]},
      // First Use
      {classes: "inner-panels", components: [
        {classes: "deco enyo-center", style: "text-align: center;", components: [
          {content: $L("No songfiles found!") + "<br>" + $L("Please add ") + '<a href="http://openlyrics.info/" target="_blank">OpenLyrics</a>' +
            $L(" files to your Dropbox App-Folder") + "<br><br>" + $L("An example package can be found here: ") + '<a href="http://openlyrics.info/" target="_blank">openlyrics.info</a>', allowHtml: true},
          {tag: "br"},
          {kind: "onyx.Button", content: $L("Refresh Library"), style: "width: 100%; color: white;", ontap: "refresh"}
        ]}
      ]},
      // Not Connected
      {classes: "inner-panels", components: [
        {classes: "deco enyo-center", style: "text-align: center;", components: [
          {content: $L("Not connected to Dropbox! Please allow dropboxaccess"), allowHtml: true},
          {tag: "br"},
          {kind: "onyx.Button", content: $L("Connect"), style: "width: 100%; color: white;", ontap: "connect"}
        ]}
      ]}
    ]},
      
    // footer Toolbar
    {name: "footerToolbar", kind: "onyx.Toolbar", components: [
      {kind: "FittableColumns", style: "width: 100%; margin: 0; padding: 0;", components: [
        {name: "open", kind: "onyx.IconButton", src: Helper.iconPath()+"open.png", ontap: "open", disabled: true},
        {kind: "FittableColumns", fit: true, style: "margin: 0; padding: 0; text-align: center;", components: [
          {name: "library", kind: "onyx.ToggleIconButton", src: Helper.iconPath()+"library.png", ontap: "goToLibrary"},
          {name: "list",  kind: "onyx.ToggleIconButton", src: Helper.iconPath()+"list.png", ontap: "goToList"}
        ]},
        {name: "addRem", kind: "onyx.IconButton", src: Helper.iconPath()+"add.png", ontap: "addRem", disabled: true}
      ]}
    ]}
  ],
  
  create: function() {
    this.inherited(arguments);
  }, 
  
  // First use 
  refresh: function() {
    this.owner.refreshLibrary()
  },
  
  // Not Connected
  connect: function() {
    this.owner.connectToDropbox()
  },
  
  // populate library list
  getLibrary: function(inSender, inEvent) {
    var r = this.owner[this.owner.currentList === "searchList" ? "searchList" : "libraryList"].content[inEvent.index];
    var isRowSelected = inSender.isSelected(inEvent.index);
    this.$.libraryListItem.addRemoveClass("item-selected", isRowSelected);
    this.$.libraryListItem.addRemoveClass("item-not-selected", !isRowSelected);
    this.$.libraryListTitle.setContent(r.title);
  },

  listTab: function(inSender, inEvent) {
    inEvent.rowIndex === this.owner.currentIndex ? this.owner.openSong(inEvent.rowIndex) : this.owner.setCurrentIndex(inEvent.rowIndex);
  },
    
  // populate custom list
  getCustomList: function(inSender, inEvent) {
    var r = this.owner.customList.content[inEvent.index];
    var isRowSelected = inSender.isSelected(inEvent.index);
    this.$.customListItem.addRemoveClass("item-selected", isRowSelected);
    this.$.customListItem.addRemoveClass("item-not-selected", !isRowSelected);
    this.$.customListTitle.setContent(r.title);
  },
  
	listReorder: function(inSender, inEvent) {
    var s = this.owner.customList.content;
    var movedItem = enyo.clone(s[inEvent.reorderFrom]);
    s.splice(inEvent.reorderFrom,1);
    s.splice((inEvent.reorderTo),0,movedItem);
    this.owner.setCurrentIndex(inEvent.reorderTo);
	},
 
	setupReorderComponents: function(inSender, inEvent) {
    var s = this.owner.customList.content;
    var i = inEvent.index;
    if(!s[i]) {
      return;
    }
    this.$.customReorderTitle.setContent(s[i].title);
  },

	setupSwipeItem: function(inSender, inEvent) {
    var s = this.owner.libraryList.content;
		var i = inEvent.index;
		if(!s[i]) {
			return;
		}
		this.$.librarySwipeTitle.setContent(s[i].title);
	},

	swipeComplete: function(inSender, inEvent) {
    var found = false;
    for (var i=0; i<this.owner.customList.content.length; i++) {
      if (this.owner.customList.content[i].file === this.owner.libraryList.content[inEvent.index].file) {
        found = true;
        break;
      }
    }  
    if (!found) {
      this.owner.customList.content.push(this.owner.libraryList.content[inEvent.index]);
    }  
	},

  // populate Manager list
  getListNames: function(inSender, inEvent) {
    var r = this.owner.savedLists[inEvent.index];
    var isRowSelected = inSender.isSelected(inEvent.index);
    this.$.listNameItem.addRemoveClass("item-selected", isRowSelected);
    this.$.listNameItem.addRemoveClass("item-not-selected", !isRowSelected);
    this.$.listNameTitle.setContent(r.title + " (" + r.content.length + ")");
  },
  
  manageTab: function(inSender, inEvent) {
    this.listIndex = inEvent.rowIndex;
    this.owner.customList = this.owner.savedLists[inEvent.rowIndex];
    this.owner.saveLists();
  },
  
  // ### Search ### 
  extendSearch: function() {
    this.$.searchBar.setOpen(!this.$.searchBar.open);
    this.$.searchSpinner.setShowing(this.$.searchBar.open);
    if (this.$.searchBar.open) {
      this.$.searchBox.focus();
      this.$.searchSpinner.hide();
    } else {
      this.clearSearch();
    }
  },
  
  clearSearch: function() {
    this.log();
    this.owner.currentList = "libraryList";
    this.goToLibrary();
    this.owner.findIndex();
    this.$.searchBox.setValue("");
    this.$.searchSpinner.hide();
    this.$.list.setDisabled(false);
  },
  
  closeSearch: function() {
    this.clearSearch();
    this.$.searchBar.setOpen(false)
    this.$.searchButton.setValue(false);
  },
  
  searchFilter: function(inSender, inEvent) {
    if (inEvent.originator.getActive() && this.$.searchBar.open) {
      this.log("search for", inEvent.originator.name);
      this.searchF = inEvent.originator.name;
      this.$.searchBox.focus();
      this.startSearch();
    }
  },
  
  startSearch: function () {
    this.log();
    this.owner.searchList.content = [];
    if (this.$.searchBox.getValue() !== "") {
      term = this.$.searchBox.getValue().toLowerCase()
      this.log("search term:", term);
      this.$.searchSpinner.show();
      for (i in this.owner.libraryList.content) {
        var x = this.owner.libraryList.content[i];
        var w = Helper.filter(this.searchF, term, this.owner.dataList[x.file.toLowerCase()]);
        if (w) {
          this.owner.searchList.content.push(x);
        };
      };
      this.log("searchList:", this.owner.searchList);
      this.owner.currentList = "searchList";
      this.$.title.setContent($L("Search List") + " (" + this.owner.searchList.content.length + ")");
      this.$.libraryList.setCount(this.owner.searchList.content.length);
      this.$.libraryList.reset();
      this.$.searchSpinner.hide();
    } else {
      this.clearSearch();
    };
  },
  
  showMenu: function() {
    this.owner.$.infoPanels.setIndex(1);
    this.owner.$.sidePane.showMenu();
  },
  
  // Swipe down in Titlebar in 
  performanceDragFinish: function(inSender, inEvent) {
    if (this.$.listPane.getIndex() === 2) {
      if (+inEvent.dy > 50) {
        this.$.performanceDrawer.setOpen(true);
      }
      if (+inEvent.dy < -50) {
        this.$.performanceDrawer.setOpen(false);
      }
    }
  },
  
  closePerformance: function() {
    if (!this.running) {
      this.$.performanceDrawer.setOpen(false);
    }
  },
  
  // ### Panes ###
  goToSync: function() {
    this.log();
    this.$.newList.setOpen(false);
    this.$.searchBar.setOpen(false);
    this.owner.currentList = "libraryList";
    this.$.libraryList.setCount(0);
    this.$.title.setContent($L("Song List"));
    this.$.open.setSrc(Helper.iconPath()+"open.png");
    this.$.addRem.setSrc(Helper.iconPath()+"add.png");
    this.$.searchButton.setDisabled(true);
    this.$.addRem.setDisabled(true);
    this.$.open.setDisabled(true);
    this.$.list.setValue(false);
    this.$.listPane.setIndex(0);
  },
  
  goToLibrary: function() {
    this.log();
    this.$.newList.setOpen(false);
    this.$.searchButton.setDisabled(false);
    this.owner.currentList = "libraryList";
    this.$.title.setContent($L("Song List") + " (" + this.owner.libraryList.content.length + ")");
    this.$.libraryList.setCount(this.owner.libraryList.content.length);
    this.$.libraryList.reset();
    this.$.open.setSrc(Helper.iconPath()+"open.png");
    this.$.addRem.setSrc(Helper.iconPath()+"add.png");
    this.$.addRem.setDisabled(false);
    this.$.open.setDisabled(false);
    this.$.list.setValue(false);
    this.$.listPane.setIndex(1);
  },
  
  goToList: function() {
    this.log();
    this.$.newList.setOpen(false);
    this.$.searchBar.setOpen(false);
    this.$.searchButton.setDisabled(true);
    this.$.library.setValue(false);
    if (this.owner.customList) {
      this.owner.currentList = "customList";
      this.owner.setCurrentIndex(undefined);
      this.$.title.setContent(this.owner.customList.title+ " (" + this.owner.customList.content.length + ")");
      this.$.performanceText.setContent('<big><b>' + this.owner.customList.content.length + " " + $L("title") + "</b></big><br> Total duration:  s");
      this.$.addRem.setSrc(Helper.iconPath()+"remove.png");
      this.$.open.setSrc(Helper.iconPath()+"open.png");
      this.$.addRem.setDisabled(false);
      this.$.listPane.setIndex(2);
      this.$.customList.setCount(this.owner.customList.content.length);
      this.$.customList.refresh();
    } else {
      this.noList();
    }
  },
  
  openListManager: function() {
    this.log();
    this.$.searchButton.setDisabled(true);
    this.$.addRem.setDisabled(false);
    this.$.listPane.setIndex(4);
    this.owner.$.viewPane.$.viewPanels.setIndex(0);
    this.$.title.setContent($L("Manage Lists"));
    this.$.open.setSrc(Helper.iconPath()+"remove.png");
    this.$.addRem.setSrc(Helper.iconPath()+"add.png");
    this.owner.currentList === "customList" ? this.$.list.setValue(false) : this.$.library.setValue(false);
    this.$.customListList.setCount(this.owner.savedLists.length);
    this.$.customListList.reset();
  },
  
  noList: function() {
    this.log();
    this.$.listPane.setIndex(3);
    this.$.title.setContent($L("List?"));
    this.$.addRem.setSrc(Helper.iconPath()+"add.png");
    this.$.addRem.setDisabled(true);
    this.$.list.setValue(false);
    this.owner.currentList === "customList" ? this.$.list.setValue(false) : this.$.library.setValue(false);
  },
  
  open: function() {
    this.log(this.$.listPane.getIndex());
    switch (this.$.listPane.getIndex()) {
      case 4: // Remove List
        if (this.listIndex >= 0) {
          this.log("remove custom list:", this.owner.savedLists[this.listIndex].title);
          this.owner.savedLists.splice(this.listIndex, 1);
          this.owner.customList = false;
          this.listIndex = undefined; 
          this.owner.saveLists();
          this.$.customListList.setCount(this.owner.savedLists.length);
          this.$.customListList.refresh();
        }
        break;
      
      default: this.openListManager();
    }
  },
  
  addRem: function() {
    this.log(this.$.listPane.getIndex());
    switch (this.$.listPane.getIndex()) {
      case 2: // Remove from List
        if (this.owner.currentIndex >= 0) {
          this.log("remove", this.owner.customList.content[this.owner.currentIndex].title, "from", this.owner.customList);
          this.owner.customList.content.splice(this.owner.currentIndex, 1);
          this.$.customList.setCount(this.owner.customList.content.length);
          this.$.customList.refresh();
          this.addLists();
        }
        break;
        
      case 4: // Add new List
        this.$.newList.setOpen(true);
        this.$.listName.focus();
        break;
      
      default: // Add to List
        if (!this.owner.customList) {
          this.noList();
        } else if (this.owner.currentIndex >= 0) {
          this.owner.customList.content.push(this.owner[this.owner.currentList].content[this.owner.currentIndex]);
          this.addLists();
        }
    }
  },
  
  addLists: function() {
    this.log();
    if (this.owner.customList.content.length > 0) {
      for (i in this.owner.savedLists) {
        if (this.owner.savedLists[i].title === this.owner.customList.title) {
          this.owner.savedLists[i] = this.owner.customList
          break;
        }
      }
    }
    this.owner.saveLists();
  },
  
  // Error
  showError: function(text) {
    this.$.error.setOpen(true);
    this.$.errorText.setContent(text);
  },
  
  close: function() {
    this.$.error.setOpen(false);
  },
  
  // newListDialog  
  clearDialog: function() {
    this.$.listName.setValue("");
    this.$.errorContent.hide();
    this.$.newList.setOpen(false);
  },
  
  saveClicked: function(s) {
    this.log(this.$.listName.getValue());
    if (this.$.listName.getValue() !== "") { 
      for (i in this.owner.savedLists) {
        if (this.owner.savedLists[i].title === this.$.listName.getValue()) {
          this.log("Name already exist:", this.$.listName.getValue());
          this.$.errorContent.setContent($L("Name already exist"));
          this.$.errorContent.show();
          this.resized();
          return;
        }
      }
      this.owner.savedLists.push({"title": this.$.listName.getValue(),
        "content": []});
      if (!this.owner.customList) {
        this.owner.customList = {"title": this.$.listName.getValue(),
          "content": []};
      }
      this.$.customListList.setCount(this.owner.savedLists.length);
      this.$.customListList.refresh();
      this.addLists();
      this.$.listName.setValue("");
      this.clearDialog();
    } else {
      this.$.errorContent.setContent($L("Name is empty"));
      this.$.errorContent.show();
      this.resized();
    }
  }
});
