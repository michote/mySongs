enyo.kind({
  name: "enyo.cursorScrollBar",
  kind: "Control",
  style: "width: 30px",
  components: [
    {kind:"enyo.Canvas", attributes: {width: 20, height: 300}, components: [
      {name: "cursor", kind: "cursorImage", style: "z-index: 99"}
      ]
    }
  ],

  ms8: 0,
  eighthCycle: 0,
  start: 0,
  counterTime: 0,
  elapsed: 0,
  timer: 0,
  published: {
    onColor: "#434437",
    offColor: "#D4D7AC",
  },

  create: function() {
    this.inherited(arguments);
  },
  setY: function(Y) {
    this.$.cursor.cursorRow = Y;
    this.$.canvas.update();
  },
  cursorOn: function () {
    this.$.cursor.color = this.onColor;
    this.$.canvas.update();
  },
  cursorOff: function () {
    this.$.cursor.color = this.offColor;
    this.$.canvas.update();
  }
});

enyo.kind({
  name: "enyo.cursorImage",
  kind: "enyo.canvas.Shape",
  published: {
    color: "#D4D7AC",
    cursorRow: 10
  },
  renderSelf: function(ctx) {
    ctx.fillStyle=this.color;
    ctx.beginPath();
    ctx.arc(13,this.cursorRow,6,1.23,5.05,true);
    ctx.lineTo(0,this.cursorRow-11);
    ctx.lineTo(0,this.cursorRow+11);
    ctx.closePath();
    ctx.fill();
  },
  create: function() {
    this.inherited(arguments);
  },
  destroy: function() {
    this.inherited(arguments);
  }
});
