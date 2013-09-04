/*
 * TIPS
 */


$.VUItips = function(elem, option){
	function objectPlus(o, stuff){
		var n;
		function F(){}
		F.prototype = o;
		n = new F();
		n.uber = o;
		
		for (var i in stuff){
			n[i] = stuff[i];
		}
		return n;
	}
	
	var getId = function(){
		var dialogid = 0;
		return function(){
			return dialogid++;
		}
	}();
	
	var i, opt = [], prop = [], param = [], elems = [];
	
	if (typeof option !== 'object'){
		var option = {};
	}

	elems = $(elem);

	for (var n = 0; n < elems.length; n++){
		opt[n] = objectPlus($.VUItips.defaults, option);
		opt[n].element = elems.eq(n);
		param[n] = elems.eq(n).attr('j_tips').split('|');
		for (i = 0; i < param[n].length; i++){
			prop[n] = param[n][i].split(':');
			if (prop[n][0] === 'followMouse'){
				opt[n].followMouse = true;
			} else if (prop[n].length === 1 && prop[n][0] !== ''){
				opt[n].content = prop[n][0];
			} else {
				switch (prop[n][0]){
					case 'title':
						opt[n].title = prop[n][1];
						break;
					case 'content':
						opt[n].content = prop[n][1];
						break;
					case 'placement':
						opt[n].placement = prop[n][1];
						break;
					case 'width':
						opt[n].width = prop[n][1];
						break;
					case 'fontSize':
						opt[n].fontSize = prop[n][1];
						break;
				}
			}
		}
		
		if (typeof opt[n].content !== 'string' || opt[n].content === '') return false;
		
	
		opt[n].tipid = 'vui-tips-' + getId();
		
		opt[n].create(elems.eq(n));
	}
}

$.VUItips.defaults = {
	width: 'auto',
	followMouse: false,
	placement: 's',
	tpl: function(){
		var _tpl = '<div class="vui-tips-cntr"></div>';
		return _tpl;
	},
	create: function(){
		var _tip;
		if (!document.getElementById(this.tipid)){
			var _node = document.createElement('div');
			_node.id = this.tipid;
			_node.className = 'vui-tips' + ((this.placement) ? ' vui-tips-'+this.placement : '') + ((this.skin) ? ' vui-tips-'+this.skin : '');
			_node.style.display = 'none';
			_node.innerHTML = this.tpl();
			_tip = document.body.appendChild(_node);
		} else {
			_tip = document.getElementById(this.tipid);
		}
		this.node = _tip;
		this.setContent().setCss().events();
		
		return this;
	},
	setContent: function(elem){
		var ctnr = $(this.node).find('div.vui-tips-cntr').eq(0);
		
		if (typeof this.title === 'string' && this.title !== ''){
			ctnr.html('<div class="vui-tips-title">' + this.title + '</div><div class="vui-tips-content">' + this.content + '</div>');
		} else {
			ctnr.html(this.content);
		}
		
		return this;
	},
	setCss: function(){
		if (typeof this.fontSize === 'string'){
            this.node.style.fontSize = this.fontSize || '12px';
        }
        this.node.style.width = this.width || 'auto';
		
		this.node.style.left = '-9999px';
		this.node.style.top = '-9999px';
		this.node.style.display = 'block';

		var _left = 0, _top = 0;
		if (this.placement === 's'){
			var _left = ($(this.element).width() / 2 - $(this.node).width() / 2) + $(this.element).offset().left;
			var _top = $(this.element).height + $(this.element).offset().top + 5;
		}
		if (this.placement === 'n'){
			var _left = ($(this.element).width() / 2 - $(this.node).width() / 2) + $(this.element).offset().left;
			var _top = $(this.element).offset().top - $(this.node).height() - 5;
		}
		if (this.placement === 'w'){
			var _left = $(this.element).offset().left - $(this.node).width() - 5;
			var _top = ($(this.element).height() / 2 - $(this.node).height() / 2) + $(this.element).offset().top;
		}
		if (this.placement === 'e'){
			var _left = $(this.element).offset().left + $(this.element).width() + 5;
			var _top = ($(this.element).height() / 2 - $(this.node).height() / 2) + $(this.element).offset().top;
		}
		this.node.style.left = _left+'px';
		this.node.style.top = _top+'px';
		this.node.style.display = 'none';
		
        return this;
	},
	show: function(e){
		if (this.followMouse){
			this.node.style.left = this.posx+5+'px';
			this.node.style.top = this.posy+5+'px';
		}
		$(this.node).stop(true, true).fadeIn('normal');
	},
	hide: function(){
		$(this.node).stop(true, true).fadeOut('normal');
	},
	events: function(){
		var me = this;
		
		$(this.element).mouseleave(function(){
			me.hide();
		});

		
		if (this.followMouse){
			$(this.element).mousemove(function(e){
				var evt = e || window.event;
				me.posx=0;
				me.posy=0;
				if (evt.pageX || evt.pageY){
					me.posx=evt.pageX;
					me.posy=evt.pageY;
				} else if (evt.clientX || evt.clientY){
					me.posx=evt.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
					me.posy=evt.clientY + document.documentElement.scrollTop + document.body.scrollTop;
				}
				
				me.show();
			});
		} else {
			$(this.element).mouseenter(function(){
				me.show();
			});
		}

	}
};