<!--#include file="TronASP/dist/tron.asp" -->
<%
//http://tron.cn/tronstudio/?page:@detail-id(21)-page(23).html

;(function(){
	modules.setBase('TronStudio');
	// 获取iPress主框架
	var iPressModule = require('iPress');

	// 创建iPress对象实例
	var iPress = new iPressModule();

	// 扩展iControler对象为自定义方法
	//iPress.iControler.set('page', 'home', contrast('page/views/home.asp'), resolve('page/compile/home.js'));
	iPress.iControler.set(contrast('controler.json'));
	iPress.iEvent.set('page', function(){
		return true;
	});

	// 渲染页面iPress对象
	iPress.render();
})();
%>