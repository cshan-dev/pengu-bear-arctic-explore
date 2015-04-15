var slidergrav;
var sliderld;
var slidercharge;
var slidercd;
var codeFlower;
$(document).ready(function() {
	Slider = Backbone.View.extend({
	initialize:function(options){
		this.options = options.options;
		this.render();
		this.value = $(this.el).slider("option","value");
	},

	render: function(){
		$(this.el).slider(this.options);
	},
});

	CodeFlowerView = Backbone.View.extend({
		initialize:function(options){
			this.options = options.options;
			this.render(this.options.jsonData);
		},

		render: function(jsonData){
			codeFlower = new CodeFlower(this.el,400,400);
			codeFlower.update(jsonData);
		}
	});

	$('#menuToggle').click(function(e) {
		var $parent = $(this).parent('nav');
		$parent.toggleClass("open");
		var navState = $parent.hasClass('open') ? "hide" : "show";
		$(this).attr("title", navState + " navigation");
		// Set the timeout to the animation length in the CSS.
		setTimeout(function() {
			//console.log("timeout set");
			$('#menuToggle > span').toggleClass("navClosed").toggleClass("navOpen");
		}, 200);
		e.preventDefault();
	});
	//$("#slider-grav").slider();
	//$("#slider-ld").slider();

var sliderldOptions = {
	value:11,
	min:10,
	max:20,
	slide: refreshFlowerConstants,
	change: refreshFlowerConstants,
	animate:"fast"
}

var codeFlowerOptions = {}

$.get("/text.json",function(data){
  codeFlowerOptions.jsonData = data;
  console.log(codeFlowerOptions);
  codeFlower = new CodeFlowerView({el:"#code",options:codeFlowerOptions});
  codeFlower2 = new CodeFlowerView({el:"#code2",options:codeFlowerOptions});
});
slidergrav = new Slider({el:"#slider-grav",options:sliderldOptions});
sliderld = new Slider({el:"#slider-ld",options:sliderldOptions});
slidercharge = new Slider({el:"#slider-c",options:sliderldOptions});
slidercd = new Slider({el:"#slider-cd",options:sliderldOptions});
});
