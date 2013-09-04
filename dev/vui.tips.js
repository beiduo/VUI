/*
 * TIPS
 */


VUI.tips = function(elem, option){
	
	var i, opt = [], prop = [], param = [], elems = [];
	
	if (typeof option !== 'object'){
		var option = {};
	}
	
	if (typeof elem === 'string'){
		elems = VUI.q(elem);
	} else if (elem.innerHTML){
		elems[0] = elem;
	} else {
		elems = elem;
	}

	for (var n = 0; n < elems.length; n++){
		opt[n] = objectPlus(VUI.tips.defaults, option);
		opt[n].element = elems[n];
		param[n] = elems[n].getAttribute('j_tips').split('|');
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
		
	
		opt[n].tipid = 'vui-tips-' + VUI.getId();
		
		opt[n].create(elems[n]);
	}
}

VUI.tips.defaults = {
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
		var ctnr = VUI.q('div.vui-tips-cntr', this.node)[0];
		
		if (typeof this.title === 'string' && this.title !== ''){
			ctnr.innerHTML = '<div class="vui-tips-title">' + this.title + '</div><div class="vui-tips-content">' + this.content + '</div>';
		} else {
			ctnr.innerHTML = this.content;
		}
		
		return this;
	},
	setCss: function(){
		if (typeof this.fontSize === 'string'){
            this.node.style.fontSize = this.fontSize || '12px';
        }
        this.node.style.width = this.width || 'auto';

		var _left = 0, _top = 0;
		if (this.placement === 's'){
			var _left = (getFullWidth(this.element) / 2 - getFullWidth(this.node) / 2) + getElementLeft(this.element);
			var _top = getFullHeight(this.element) + getElementTop(this.element) + 5;
		}
		if (this.placement === 'n'){
			var _left = (getFullWidth(this.element) / 2 - getFullWidth(this.node) / 2) + getElementLeft(this.element);
			var _top = getElementTop(this.element) - getFullHeight(this.node) - 5;
		}
		if (this.placement === 'w'){
			var _left = getElementLeft(this.element) - getFullWidth(this.node) - 5;
			var _top = (getFullHeight(this.element) / 2 - getFullHeight(this.node) / 2) + getElementTop(this.element);
		}
		if (this.placement === 'e'){
			var _left = getElementLeft(this.element) + getFullWidth(this.element) + 5;
			var _top = (getFullHeight(this.element) / 2 - getFullHeight(this.node) / 2) + getElementTop(this.element);
		}
		this.node.style.left = _left+'px';
		this.node.style.top = _top+'px';
		
		
        return this;
	},
	show: function(){
		if (this.followMouse){
			this.node.style.left = this.posx+5+'px';
			this.node.style.top = this.posy+5+'px';
		}
		this.node.style.display = 'block';
	},
	hide: function(){
		this.node.style.display = 'none';
	},
	events: function(){
		var me = this;
		
		
		addEvent(this.element, 'mouseout', function(e){
			var evt = e || window.event;

			if (isMouseLeaveOrEnter(evt, this)){
				me.hide();
			}
		});

		
		if (this.followMouse){
			addEvent(this.element, 'mousemove', function(e){
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
			addEvent(this.element, 'mouseover', function(e){
				var evt = e || window.event;
	
				if (isMouseLeaveOrEnter(evt, this)){
					me.show();
				}
			});
		}

	}
};