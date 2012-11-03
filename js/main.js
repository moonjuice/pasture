var PageCnt = 10;
var AppRouter = Backbone.Router.extend({

	routes: {
		""                  : "cowList",
		"cows"	: "cowList",
		"cows/page/:page"	: "cowList",
		"cows/add"         : "addcow",
		"cows/:taxID"         : "cowDetail",
		"about"             : "about"
	},

	initialize: function () {
		this.headerView = new HeaderView();
		$('.header').html(this.headerView.el);
	},

	cowList: function(page) {
		var p = page ? parseInt(page, 10) : 1;
		var cowList = new cowCollection();
		cowList.fetch({success: function(){
			$("#content").html(new cowListView({model: cowList, page: p}).el);
		}});
		this.headerView.selectMenuItem('cow-menu');
	},

	cowDetail: function ( taxID) {
		var cow = new cowModel({id : taxID.toString()});
		cow.fetch({success: function(){
			$("#content").html(new cowView({model: cow}).el);
		}});
		this.headerView.selectMenuItem();
	},

	addcow: function() {
		var cow = new cowModel();
		$("#content").html(new cowView({model: cow}).el);
		this.headerView.selectMenuItem('cow-menu');
	},

	about: function () {
		if (!this.aboutView) {
			this.aboutView = new AboutView();
		}
		$("#content").html(this.aboutView.el);
		this.headerView.selectMenuItem('about-menu');
	}
});

var deferreds = [];
var views = ['HeaderView', 'cowView', 'cowListItemView', 'AboutView'];
$.each(views, function(index, view) {
	if (window[view]) {
		deferreds.push($.get('tpl/' + view + '.html', function(data) {
			window[view].prototype.template = _.template(data);
		}));
	} else {
		alert(view + " not found");
	}
});

$.when.apply(null, deferreds).done(function() {app = new AppRouter();Backbone.history.start();});
window.Paginator = Backbone.View.extend({
	className: "pagination pagination-centered",
	initialize:function () {
		this.model.bind("reset", this.render, this);
		this.render();
	},
	render:function () {
		var items = this.model.models;
		var len = items.length;
		var pageCount = Math.ceil(len / PageCnt);
		$(this.el).html('<ul />');
		for (var i=0; i < pageCount; i++) {
			$('ul', this.el).append("<li" + ((i + 1) === this.options.page ? " class='active'" : "") + "><a href='#" + this.options.modelName + "s/page/"+(i+1)+"'>" + (i+1) + "</a></li>");
		}
		return this;
	}
});
