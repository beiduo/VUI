// XMLHttpRequest对象
function createXHR(){
    if (typeof XMLHttpRequest !== 'undefined'){
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject !== 'undefined') {
        if (typeof arguments.callee.activeXString !== 'string'){
            var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHtt++p'];
            for (var i = 0, len = versions.length; i < len; i++){
                try {
                    var xhr = new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    return xhr;
                } catch (e) {
                    //跳过
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    } else {
        throw new Error(VUI.lang.ajax.noXHR);
    }
}

/*
 * AJAX
 */
VUI.ajax = function(option, which){
    //发起请求前的操作，如果option.before返回false则中止创建
    if (typeof option.before === 'function' && !option.before()){   
        return false;
    }
    
    if (typeof which !== 'undefined'){
        var _ajax = objectPlus(which, option);
    } else {
        var _ajax = objectPlus(VUI.ajax.defaults, option);
    }
    var xhr = _ajax.create();
    return xhr;
}

VUI.ajax.defaults = {
    method: 'get',
    dataType: 'text',
    cache: true,
    create: function(){
        var _this = this;
        
        var url = (typeof this.url === 'string') ? this.url : '';
        url = url || window.location.href || '';
        if (url) {
            // clean url (don't include hash value)
            url = (url.match(/^([^#]+)/)||[])[1];
        }
        
        if (this.method !== 'post' && typeof this.data === 'string'){
            url += (url.indexOf('?') === -1 ? '?' : '&');
            url += this.data;
        }
        
        var xhr = createXHR();
        
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4){
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                    var callback;
                    if (_this.dataType === 'xml'){
                        try{
                            if (xhr.responseXML){
                                callback = xhr.responseXML.documentElement;
                            } else {
                                callback = parseXml(xhr.responseText);
                            }
                        } catch(e){
                            _this.error(VUI.lang.ajax.error.dataType, xhr.status);
                            return;
                        }
                    } else if (_this.dataType === 'json'){
                        try{
                            callback = eval('(' + xhr.responseText + ')');
                        } catch(e){
                            _this.error(VUI.lang.ajax.error.dataType, xhr.status);
                            return;
                        }
                    } else {
                        callback = xhr.responseText;
                    }
                    _this.success(callback, xhr.status);
                } else {
                    _this.error(VUI.lang.ajax.error.server, xhr.status);
                }
            }
        }
        
        xhr.open(this.method, url, true);
        if (this.method === 'post'){
            if (!_this.cache){
                xhr.setRequestHeader("If-Modified-Since","0");
            }
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(this.data);
            
        } else {
            if (!_this.cache){
                xhr.setRequestHeader("If-Modified-Since","0");
            }
            xhr.send(null);
        }
        
        return xhr;
    },
    success: function(){},
    error: function(){}
};

VUI.get = function(url, fn){
    var xhr = createXHR();
    
    xhr.onreadystatechange = function(){
        var callback;
        if (xhr.readyState == 4){
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                callback = xhr.responseText;
            } else {
                callback = VUI.lang.ajax.error.errorCode + xhr.status;
            }
            fn(callback);
        }
    }
    
    xhr.open('get', url, true);
    xhr.setRequestHeader("If-Modified-Since","0");
    xhr.send(null);
}