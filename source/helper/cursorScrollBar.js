enyo.kind({
  name: "enyo.cursorScrollBar",
  kind: "Control",
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
    color: "#D4D7AC",
    onColor: "#434437",
    offColor: "#D4D7AC",
  },

  create: function() {
    this.inherited(arguments);
    // Code to monitor image and redraw once loaded
//    var img = new Image();
//  img.src = this.$.image.src;
//    img.onload = enyo.bind(this, function() {
//      this.$.canvas.update();
    },
  clearCursor: function() {
    this.$.canvas.update();
    this.$.cursor.clearBpmTimer();
  },
  setY: function(Y) {
//    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.$.cursor.cursorRow = Y;
    this.$.canvas.update();
  },
  cursorOn: function () {
    this.$.cursor.color = this.onColor;
  },
  cursorOff: function () {
    this.$.cursor.color = this.offColor;
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
//		this.jobName = "blinkMe_" + this.id;
//		this.blinkMe();
	},
	destroy: function() {
//		enyo.job.stop(this.jobName);
		this.inherited(arguments);
	},
//	blinkMe: function() {
//		var color = this.color;
//		this.color = this.highlightColor;
//		this.highlightColor = color;
//		this.container.update();
//		enyo.job(this.jobName, enyo.bind(this, "blinkMe"), 500);
//	}
  timeoutInstance: function () {
    this.counterTime += this.ms8;
    this.eighthCycle = (this.eighthCycle + 1) % 8;
    this.color = this.offColor;
    if (this.eighthCycle < 2) { //  flash on for 2/8 of cycle
      this.color = this.onColor;
    }
    var diff = (new Date().getTime() - this.start) - this.counterTime;
    var _this = this;
    this.timer = window.setTimeout(function() {_this.timeoutInstance();}, this.mss8 - diff);
  },

  setBpmTimer: function(bpm) {
    this.ms8 = 7500/bpm;    // ms for 1/8 of beat
    this.eighthCycle = 0;
    this.start = new Date().getTime();
    this.counterTime = 0;
    this.elapsed = 0;
    var _this = this;
    this.timer = window.setTimeout(function() {_this.timeoutInstance();}, this.ms8);
  },
  clearBpmTimer: function() {
    window.clearTimeout(this.timer);
  }
});
