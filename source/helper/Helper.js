
function Helper() {}

  Helper.app = "mySongs";
  
  Helper.vers = "0.5";

  Helper.ratio = function() { 
    //~ var p = enyo.platform;
    //~ if (p.blackberry) {
      //~ return "2.0";
    //~ } else if (p.android > 3) {
      //~ return "1.5";
    //~ } else {
      return "1.0";
    //~ }
  };

  Helper.iconPath = function() { 
      //~ return "assets/images/" + this.ratio() +"/"; 
      return "assets/images/1.0/"; 
  }; 

  // small Screen on Phone
  Helper.phone = function() { 
    var p = enyo.platform;
    if (window.innerWidth < 800 || p.blackberry) {
      return true;
    } else {
      return false;
    }
  };
  
  Helper.browser = function() { 
    var p = enyo.platform;
    if (p.chrome || p.firefox || p.safari || p.ie ) {
      return true;
    } else {
      return false;
    }
  };

  // Create songlist with dublicates
  Helper.handleDoubles = function(arr) {
    var i,
      trigger=1,
      len=arr.length,
      out=[],
      obj={};

    for (i=0;i<len;i++) {
      if (obj[arr[i]]) {
        obj[(arr[i]+trigger)]=i;
        trigger += 1;
      } else {
        obj[arr[i]]=i;
      }
    }

    for (i in obj) {
      out.push(i);
    }
    return out;
  };

  // Remove dublicates from Array
  Helper.removeDoubles = function(arr) {
    var i,
      trigger=1,
      len=arr.length,
      out=[],
      obj={};

    for (i=0;i<len;i++) {
      if (obj[arr[i]]) {
        obj[(arr[i])]=i;
        trigger += 1;
      } else {
        obj[arr[i]]=i;
      }
    }

    for (i in obj) {
      out.push(i);
    }
    return out;
  };

  // create Lyrics from verseOrder
  Helper.orderLyrics = function(lyrics, order, lang) {
    var newLyrics = {};
    var order2 = this.handleDoubles(order);
    //~ this.log("lyrics: " + lyrics);
    //~ this.log("order: " + order);
    //~ this.log("order2: " + order2);
    for (i = 0; i < order.length; i++) {
      if (!lang && lyrics[order[i]]) {
        newLyrics[order2[i]] = [order[i],lyrics[order[i]][1]];
      } else if (lang && lyrics[order[i]]) {
        newLyrics[order2[i]] = [order[i].split("_")[0],lyrics[order[i]][1]];
      }
    }
    return newLyrics;
  };
  
  // language tag to verse id
  Helper.orderLanguage = function(order, lang) {
    var newOrder = [];
    for (i in order) {
      newOrder.push(order[i] + "_" + lang);
    }
    return newOrder;
  };
  
  // Insert a modified element add same place
  Helper.insertSame = function(lyrics, id, elCon, oldId) {
    var newLyrics = {};
    for (i in lyrics) {
      if (i === oldId && id === oldId) {
        newLyrics[i] = elCon;
      } else if (i === oldId && id !== oldId) {
        newLyrics[id] = elCon;
      } else {
        newLyrics[i] = lyrics[i];
      }
    }
    return newLyrics;
  };
  
  // Search
  Helper.filter = function(filter, term, xml) {
    switch (filter) {
      case "titles":  return this.searchTitles(term, xml);
                      break;
      case "authors": return this.searchAuthors(term, xml);
                      break;
      case "lyrics":  return this.searchLyrics(term, xml);
                      break;
      case "keys":    return this.searchKeys(term, xml);
                      break;
    }
  };
  
  Helper.isIn = function(term, item) {
    var n = item.indexOf(term);
    //~ this.log("found:", term, "in", item, "?:", (n >= 0))
    return n >= 0;
  };
  
  Helper.searchTitles = function(term, xml) {
    var t = ParseXml.get_titles(xml)
    var tit = [];
    for (j in t) {
      tit.push(t[j].title.toLowerCase());
    }
    if (this.isIn(term, tit.join())) {
      return true;
    }
    return false;
  };
  
  Helper.searchAuthors = function(term, xml) {
    var a = ParseXml.authorsToString(ParseXml.get_authors(xml));
    var aut = [];
    for (j in a) {
      aut.push(a[j].toLowerCase());
    }
    if (this.isIn(term, aut.join())) {
      return true;
    }
    return false;
  };
  
  Helper.searchLyrics = function(term, xml) {
    var l = ParseXml.get_lyrics(xml, [""], false, true, 0).lyrics;
    var lyr = [];
    for (j in l) {
      lyr.push(l[j][1].replace(/&nbsp;/g, " ").replace(/(<([^>]+)>)/ig,""));
    }
    if (this.isIn(term, lyr.join().toLowerCase())) {
      return true;
    }
    return false;
  };
  
  Helper.searchKeys = function(term, xml) {
    var t = ParseXml.get_themes(xml);
    var c = ParseXml.get_comments(xml);
    var com = [];
    for (j in t) {
      //~ enyo.log(t[j]);
      com.push(t[j].theme.toLowerCase());
    }
    for (k in c) {
      //~ enyo.log(c[k]);
      com.push(c[k].toLowerCase());
    }
    if (this.isIn(term, com.join())) {
      return true;
    }
    return false;
  };
  
  // LocalStorage
  Helper.setItem = function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  Helper.getItem = function(key) {
    return JSON.parse(localStorage.getItem(key));
  };
  
  // Scrolling
  Helper.calcNodeOffset = function(inNode) {
    if (inNode.getBoundingClientRect) {
      var o = inNode.getBoundingClientRect();
      return {
        left: o.left,
        top: o.top,
        width: o.width,
        height: o.height
      };
    }
  };
  
  // escape HTML
  Helper.html = function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  
  // log kind tree
  // call using this.logKindTree(enyoObject, indentStep)
  // indentStep is optional and defaults to 2
  Helper.logKindTree = function(baseKind, indent) {
    baseKind.log("========================");
    Helper.kindTree(baseKind, 0, indent);
    baseKind.log("========================");
  },
  
  Helper.kindTree = function(baseKind, lvl, indent) {
    if (!indent) {
      indent = 2;
    }
    var spcs = indent * lvl;
    var oStr = lvl +":" + baseKind.name;
    for (i=0; i<spcs; ++i) {
      oStr = " " + oStr;
    }
    baseKind.log(oStr + ", " + baseKind.kind);
    var i=0;
    while (i<baseKind.children.length) {
      this.kindTree(baseKind.children[i], lvl+1, indent);
      ++i;
    }
  }
