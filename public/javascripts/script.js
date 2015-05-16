var sliderPanel;
var oldID;
var next = 1;
var displays = {
  id: [],
  display: []
};
var instant = false;
var Context = {
  listeners: []
};
/** The focused display   */
var currentContext;

var codeFlower;
var codeFlower2;
var getDisplay = function(id) {
  var divsel = "#" + id;
  return displays.display[displays.id.indexOf(divsel)];

};


var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
$('#layout').w2layout({
  name: 'layout',
  panels: [{
    type: 'top',
    size: '50%',
    resizable: true,
    hidden: false,
    style: pstyle,
    content: 'top'
  }, {
    type: 'left',
    size: 200,
    resizable: true,
    hidden: true,
    style: pstyle,
    content: 'left'
  }, {
    type: 'main',
    style: pstyle,
    content: '<div id="eventList"></div>'
  }, {
    type: 'preview',
    size: '50%',
    resizable: true,
    hidden: true,
    style: pstyle,
    content: 'preview'
  }, {
    type: 'right',
    size: 200,
    resizable: true,
    hidden: true,
    style: pstyle,
    content: 'right'
  }, {
    type: 'bottom',
    size: 50,
    resizable: true,
    hidden: true,
    style: pstyle,
    content: 'bottom'
  }]
});
// w2ui['layout'].on('*', function(event) {
//   var log = $('#eventList').html();
//   $('#eventList').html(log + (log != '' ? '<br>' : '') + event.type + ': ' + event.target);
// });

w2ui['layout'].load("top", "sailorAdd", function(){
  var topPanel = new TopPanel({
    el: '#layout_layout_panel_top .w2ui-panel-content',
    options: sliderOptions
  });
  console.log("loaded, topPanel'd");
});

var LayoutView = Backbone.View.extend({});

/**
 * makes the EventHandler 'Context' fire when any <context> element is clicked
 * @param {Context} the context switch handler
 */
_.extend(Context, Backbone.Events);
$(document.body).on('click', 'display', function(evt) {
  Context.trigger('updateContext', this.id);
});
Context.on('updateContext', function(id) {
  d3.select('#' + oldID).select("rect").style("fill", "#000");
  oldID = id;
  currentContext = getDisplay(id);
  d3.select('#' + id).select("rect").style("fill", "#222");
  $.each(Context.listeners, function(index, listener) {
    listener.updateContext(id);
  });
});


var Show = Backbone.View.extend({
  initialize: function(options) {
    Context.listeners.push(this);
  },
  updateContext: function(id) {
    this.$el.text(id);

  }
});

var SliderCharge = Backbone.View.extend({
  initialize: function(options) {
    this.render();
  },
  render: function() {
    ldOptions = {
      value: 20,
      min: 1,
      max: 200,
      animate: "fast",
      slide: function(event, ui) {
        currentContext.force.charge(function(d) {
          return (d._children ? -d.size / 100 : -40) * (ui.value / 10);
        }).start();
      }
    };
    $('#slider-c').slider(ldOptions);
  }
});
var rerenderChargeDis = function(event, ui) {
  currentContext.force.chargeDistance(ui.value).start();
};

var SliderChargeDis = Backbone.View.extend({
  initialize: function(options) {
    this.options = options;
    this.options.slide = function(event, ui) {
      rerenderChargeDis(event, ui);
    };
    this.render();
  },
  render: function() {
    var cdOptions = {
      value: 500,
      min: 1,
      max: 1000,
      animate: "fast",
      slide: function(event, ui) {
        currentContext.force.chargeDistance(ui.value).start();
      }
    };
    this.$el.slider(cdOptions);
    console.log()
  }
});

/**
 *This function rerenders the context with the link distance
 * @constructor
 */
var rerenderLinkDis = function(event, ui) {
  currentContext.force.linkDistance(ui.value).start();
};

var SliderLinkDis = Backbone.View.extend({
  initialize: function(options) {
    this.options = options;
    this.options.slide = function(event, ui) {
      rerenderChargeDis(event, ui);
    };
    this.render();
  },
  render: function() {
    ldOptions = {
      value: 20,
      min: 1,
      max: 200,
      animate: "fast",
      slide: function(event, ui) {
        currentContext.force.linkDistance(ui.value).start();
      }
    };
    this.$el.slider(ldOptions);
  }
});

var SliderGrav = Backbone.View.extend({
  initialize: function(options) {
    this.options = options;
    this.options.slide = function(event, ui) {
      rerenderChargeDis(event, ui);
    };
    this.render();
  },
  render: function() {
    gravOptions = {
      value: 10,
      min: 5,
      max: 15,
      animate: "fast",
      slide: function(event, ui) {
        currentContext.force.gravity(Math.atan(10 / (5 * ui.value)) / Math.PI * 0.4).start();
      }
    };
    console.log(this.options.el);
    $(this.options.el).text("HELLO");
  }
});

var TopPanel = Backbone.View.extend({
  initialize: function(options) {
    this.options = options.options;

    this.slidercharge = new SliderCharge({
      el: "#slider-c",
      options: this.options.sliderchargeOptions
    });
    this.slidercd = new SliderChargeDis({
      el: "#slider-cd",
      options: this.options.slidercdOptions
    });
    this.slidergrav = new SliderGrav({
      el: "#slider-grav",
      options: this.options.slidergravOptions
    });
    this.sliderld = new SliderLinkDis({
      el: "#slider-ld",
      options: this.options.sliderldOptions
    });
  }
});

var CodeFlowerView = Backbone.View.extend({
  initialize: function(options) {
    this.options = options.options;
    $.get("edges.csv", function(data){
      console.log("this.options");
      csvData = data;
      codeFlower = new CodeFlower("#layout_layout_panel_main .w2ui-panel-content", codeFlowerOptions.x, codeFlowerOptions.y);
      codeFlower.update(csvData);
    });

  },
  render: function() {

    // var divsel = this.options.myDiv
    // if (getDisplay(divsel) == null) {
    //   displays.id.push(divsel);
    //   displays.display.push(codeFlower);
    // }
  }
});

var codeFlowerOptions = {
  x: '550',
  y: '550'
}

var sliderOptions = {
  sliderldOptions: SliderVals.ldOptions,
  slidercdOptions: SliderVals.cdOptions,
  sliderchargeOptions: SliderVals.chargeOptions,
  slidergravOptions: SliderVals.gravOptions
}

var codeFlowerPane = new CodeFlowerView({options: codeFlowerOptions});

var topPanel = new TopPanel({
  el: '#layout_layout_panel_top .w2ui-panel-content',
  options: sliderOptions
});
var show = new Show({
  el: '#show'
});
