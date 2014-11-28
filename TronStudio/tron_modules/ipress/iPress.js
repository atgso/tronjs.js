(function (mod) {
    if (typeof exports == "object" || typeof exports === 'function' && typeof module == "object") {
        module.exports = mod();
    }
    else if (typeof define == "function" && define.amd) {
        return define([], mod);
    }
    else {
        window.iPress = mod();
    }
})(function () {
	
	var iPress = new Class(function(){
		// 设置初始化错误编码 0 表示正常
		this.error = 0;
		
		// 控制器初始化
		this.iControler = new iControler();
		// 事件初始化
		this.iEvent = new iEvent();
		
		// 获取URL的TOKEN
		if ( typeof this.PressURL === 'function' ){
			this.token = this.PressURL(this.getURL());
		}else{
			this.token = this._PressURL(this.getURL());
		}
	});
	
	iPress.add('errors', {
		"0": "正常",
		"404": "找不到页面地址",
		"500": "服务端出错"
	});
	
	// 获取页面token
	iPress.add('getURL', function(){
		var querys = http.emit(Request.QueryString);
		if ( querys.length > 0 ){
			return querys[0];
		}else{
			return 'page:home.html';
		}
	});
	
	// 设置生成URL
	iPress.add('setURL', function(controler, views, configs){
		var url = '?' + controler + ':';
		if ( views ){
			url += '@' + views;
		};
		
		var config = [], configString = '';
		if ( configs ){
			for ( var i in configs ){
				config.push(i + '(' + configs[i] + ')');
			}
		}
		
		if ( config.length > 0 ){
			configString = '-' + config.join('-');
		}
		
		url += configString + '.html';
		
		return url;
	});

	
	// 如果存在PressURL方法将自动把URL处理转交给自定义方法 参数为URL取得的token.	
	iPress.add('_PressURL', function(token){
		var outTokens = {
			controler: 'page',
			searchers: {},
			views: 'home'
		};
		
		var tokens = token.split(':');
		if ( tokens.length > 1 ){
			outTokens.controler = tokens[0];
			tokens = tokens[1].split('.');
			if ( tokens.length > 1 ){
				tokens = tokens[0].split('-');
				tokens.forEach(function(value){
					if ( /^\@/.test(value) ){
						outTokens.views = value.replace(/^\@/, '');
					}
					else if ( /(\w+)(\(([^\)]+)\))?/.test(value) ){
						var params = /(\w+)(\(([^\)]+)\))?/.exec(value);
						if ( params && params[1] ){
							outTokens.searchers[params[1]] = params[3] || '';
						}
					}
				});
			}
		}
		
		return outTokens;
	});
	
	// 渲染页面
	iPress.add('render', function(){
		var token = this.token;
		var PathModule = this.iControler.get(token.controler, token.views);
		var that = this;
		
		var Event = this.iEvent.get(token.controler);
		
		if ( !Event ){
			return;
		}
		
		var PageServiceModule = null;
		
		if ( PathModule[1] ){
			 fs(PathModule[1])
			.exist()
			.then(function(){
				var PageService = require(PathModule[1]);
				PageServiceModule = new PageService(token.searchers);
			});
		}

		 fs(PathModule[0])
		.exist()
		.fail(function(){
			that.error = 404;
		})
		.then(function(){
			if ( PageServiceModule ){
				include(PathModule[0], PageServiceModule);
			}else{
				include(PathModule[0]);
			}
		})
		.stop();
	});
	
	/*
	 * iControler 控制器模块
	 * 控制页面加载队列
	 * 用于输出页面的参数配置
	 */
	var iControler = new Class(function(){
		this.map = {};
	});

	iControler.add('set', function( C, V, P, S ){
		if ( !V && readVariableType(C, 'string') ){
			var maps = require(C);
			for ( var i in maps ){
				for ( var j in maps[i] ){
					this.set(i, j, maps[i][j][0], maps[i][j][1]);
				}
			}
		}else{
			if ( !this.map[C] ){
				this.map[C] = {};
			};
			if ( !this.map[C][V] ){
				if ( S ){
				this.map[C][V] = [P, S];
				}else{
					this.map[C][V] = [P];
				}
			}
		}
	});
	
	iControler.add('get', function( C, V ){
		if ( this.map[C] && this.map[C][V] ){
			return this.map[C][V];
		}else{
			this.error = 404;
		}
	});
	
	/*
	 * iEvent 模块
	 * 定义模块加载事件和权限
	 * 返回值如果是false 则拒绝通过
	 */
	var iEvent = new Class(function(){
		this.map = {};
	});
	
	iEvent.add('set', function(C, callback){
		if ( !this.map[C] ){
			this.map[C] = [];
		};
		
		if ( typeof callback === 'function' ){
			this.map[C].push(callback);
		}
	});
	
	iEvent.add('get', function(C){
		var status = true;
		
		if ( this.map[C] ){
			this.map[C].forEach(function(callback){
				var ret = callback();
				if ( ret === false ){
					status = false;
				}
			});
		};
		
		return status;
	});
	
	return iPress;
	
});