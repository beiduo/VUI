/*
 * Dialog
 */

// 新建对话框的函数
VUI.dialog = function(option, which){
    //对话框创建前的工作，如果option.before返回false则中止创建
    if (typeof option.before === 'function' && !option.before()){
        if (typeof option.error === 'function'){
            option.error();
        }
        return false;
    }
    //指定ID
    if (!option.id && option.mask !== 'yes'){
        option.id = 'common';
    } else {
        option.id = option.id || VUI.getId();
    }
    //添加按钮设置
    if ((!option.button || option.button.length < 1) && !option.nobutton && typeof option.icon === 'string'){
        if (option.icon === 'ok' || option.icon === 'error'){
            option.button = [
                {
                    classname: 'btn-positive',
                    value: VUI.lang.dialog.btnConfirm,
                    type: 'close'
                }
            ]
        }
        if (option.icon === 'alert'){
            option.button = [
                {
                    classname: 'btn-positive',
                    value: VUI.lang.dialog.btnConfirm,
                    type: 'confirm'
                },
                {
                    value: VUI.lang.dialog.btnCancel,
                    type: 'close'
                }
            ]
        }
    }
    //建立对话框对象
    if (typeof which !== 'undefined'){
        var _d = objectPlus(which, option);
    } else {
        var _d = objectPlus(VUI.dialog.defaults, option);
    }
    _d.create();
    return _d;
}

// 对话框
VUI.dialog.defaults = {
    tplMsg: function(content){
        var _tpl = '<table class="withicon icon-' + this.icon + '""><tr>'
+                       '<td class="icon" style="vertical-align:' + (this.iconVlign || 'middle') + ';"><i>&nbsp;</i></td>'
+                       '<td class="text" style="vertical-align:' + (this.iconVlign || 'middle') + ';">'
+                           content
+                       '</td>'
+                   '</tr></table>';
        return _tpl;
    },
    setContent: function(){
        var i, content, _t, ctnr = VUI.q('div.vui-dialog-content', this.node)[0], me = this;
        if (typeof this.append === 'string' && this.append !== '' && VUI.q(this.append).length !== 0){
            _t = VUI.q(this.append);
            for (i = 0; i < _t.length; i++){
                ctnr.appendChild(_t[i]);
            }
            
        } else if (typeof this.clone === 'string' && this.clone !== '' && VUI.q(this.clone).length !== 0){
            _t = VUI.q(this.clone);
            for (i = 0; i < _t.length; i++){
                ctnr.appendChild(_t[i].cloneNode(true));
            }
            
        } else if (typeof this.source === 'string' && this.source !== ''){
            content = '';
            try {
				VUI.ajax({
					url: this.source,
					cache: false,
					success: function(data){
						ctnr.innerHTML = data;
						me.position();
					},
					error: function(msg, s){
						ctnr.innerHTML = VUI.lang.dialog.msgError + msg + ', 状态' + s;
						me.position();
					}
				});
			} catch(e) {}
        } else if (typeof this.icon === 'string' && this.icon !== ''){
            content = this.content ? this.content : '';
            ctnr.innerHTML = this.tplMsg(content);
        } else {
            content = this.content ? this.content : '';
            ctnr.innerHTML = content;
        }
        return this;
    },
    setButton: function(){
        if (!this.button || this.button.length < 1) return this;
        var i, btns = this.button;
        var dfoot = document.createElement('div');
        dfoot.className = 'dfoot';
        var btnCtnr = document.createElement('div');
        btnCtnr.className = 'clearfix inner';
        var arrayBtns = [];
        for (i = 0; i < btns.length; i++){
            arrayBtns[i] = document.createElement('a');
            arrayBtns[i].id = btns[i].id || '';
            arrayBtns[i].className = 'btnwrap ' + (btns[i].classname || '');
            arrayBtns[i].href = 'javascript:void(0);';
            arrayBtns[i].innerHTML = btns[i].value || '';
            if (typeof btns[i].type === 'string'){
                if (btns[i].type === 'close'){
                    addEvent(arrayBtns[i], 'click', this.close.bind(this,this.close));
                }
                if (btns[i].type === 'confirm'){
                    addEvent(arrayBtns[i], 'click', this.confirm.bind(this,this.confirm));
                }
                if (btns[i].type === 'submit'){
                    addEvent(arrayBtns[i], 'click', this.submit.bind(this,this.submit));
                }
            } else if (typeof btns[i].callback === 'function'){
                addEvent(arrayBtns[i], 'click', btns[i].callback);
            }
            btnCtnr.appendChild(arrayBtns[i]);
        }
        dfoot.appendChild(btnCtnr);
        this.node.children[0].appendChild(dfoot);
        return this;
    },
    css: function(){
        if (typeof this.fontSize === 'string'){
            VUI.q('div.vui-dialog-content', this.node)[0].style.fontSize = this.fontSize;
        }
        this.node.style.width = this.width || 'auto';
		
		if (VUI.testIE() <= 6 && (!this.width === 'string' || isNaN(parseInt(this.width)))){
			this.node.children[0].style.width = '420px';
		}
		
        this.node.style.left = '50%';
        
		this.position();
		
        this.node.style.display = 'block';
        return this;
    },
	position: function(){
		var h = getFullHeight(this.node);
        var w = getFullWidth(this.node);
        if (VUI.testIE() <= 6){
            this.node.style.position = 'absolute';
            this.node.style.top = Math.max((getWindowHeight() - h) / 2 + document.documentElement.scrollTop, 0) + 'px';
        } else {
            this.node.style.top = Math.max((getWindowHeight() - h), 0) / 2 + 'px';
        }
        this.node.style.marginLeft = Math.floor(-w / 2) + 'px';
	},
    tpl: function(){
        var _tpl = 
        '<div class="dwarp">'
+            '<div class="dhead">'
+                '<h2 class="title"><span class="inner">'
+                    (this.title ? this.title : VUI.lang.dialog.title)
+                '</span></h2>'
+                '<div class="extra">'
+                    (this.shut === 'no' ? '' : '<a class="vui-dialog-close" href="javascript:void(0)">'+ VUI.lang.dialog.btnClose +'</a>')
+                '</div>'
+            '</div>'
+            '<div class="dbody" style="padding:' + (this.padding || '10px') + '"><div class="clearfix vui-dialog-content">'
+            '</div></div>'
+        '</div>';
        return _tpl;
    },
    create: function(){
        if (this.mask === 'yes'){
           VUI.mask();
        }
		
		var oldnode = document.getElementById('vui-dialog-' + this.id);
        if (oldnode){
            oldnode.parentNode.removeChild(oldnode);
        }
        var node = document.createElement('div');
        node.id = 'vui-dialog-' + this.id;
        node.className = 'vui-dialog' + ((this.skin) ? ' vui-dialog-'+this.skin : '');
        node.style.display = 'none';
        node.innerHTML = this.tpl();
		
        var elem = document.body.appendChild(node);
		
		this.node = elem;
        this.setContent().setButton().events().css();
        return this;
    },
    events: function(){
        var btnClose = VUI.q('a.vui-dialog-close', this.node);
        if (btnClose.length > 0){
            addEvent(btnClose[0], 'click', this.close.bind(this,this.close));
        }
        return this;
    },
    /*
    button: [
        {
            classname: 'CLASSNAME',
            id: 'ID',
            value: '文本',
            type: '调用内置方法',
            callback: '定义按钮点击的行为，会被type属性覆盖'
        }
    ];
    */
    close: function(){
        this.node.parentNode.removeChild(this.node);
        var mask = document.getElementById('vui-mask');
        if (mask){
            mask.parentNode.removeChild(mask);
        }
        return false;
    },
    confirm: function(){
        return true;
    },
    submit: function(){
        this.node.getElementsByTagNames('form')[0].submit();        
    }
};