;(function($){
	var Dialog=function(config){
		//默认参数配置
		this.config={
			//对话框宽高
			width:"auto",
			height:"auto",
			//对话框提升信息
			message:null,
			//对话框类型
			type:"waiting",
			//按钮配置
			buttons:null,
			//弹出框延迟多久关闭
			delay:null,
			//对话框框罩透明度
			maskOpacity:null,
			//延迟关闭回调
			delayCallback:null,
			//动画
			effect:false,
			//遮罩层关闭
			maskClose:false
		};
		//默认参数扩展
		if(config && $.isPlainObject(config)){
			$.extend(this.config,config);
		}else{
			this.isConfig=true;
		}

		//创建DOM节点
		this.body=$("body");
		//创建遮罩层
		this.mask=$('<div class="g-dialog-contianer">');
		//创建弹出框
		this.win=$('<div class="dialog-window">');
		//创建弹出框头部
		this.winHeader=$('<div class="dialog-header">');
		//创建弹出框提示信息
		this.winContent=$('<div class="dialog-content">');
		//创建弹出框按钮组
		this.winFooter=$('<div class="dialog-footer">');

		this.create();
	};

	Dialog.prototype={
		//创建弹出框
		create:function(){
			var _this=this,
				config=this.config;
				body=this.body,
				mask=this.mask,
				win=this.win,
				header=this.winHeader,
				content=this.winContent,
				footer=this.winFooter;
			//如果没有配置参数 弹出一个等待框
			if(this.isConfig){
				win.append(header.addClass("waiting"));
				mask.append(win);
				body.append(mask);
				if(this.config.effect){
					this.animate();
				}
			}else{
				//根据配置参数创建相应弹框
				header.addClass(config.type);
				win.append(header);
				//如果传递了信息文本
				if(config.message)
				{
					content.html(config.message);
					win.append(content);
				}
				//如果有按钮组
				if(config.buttons)
				{
					this.createButton(footer,config.buttons);
					win.append(footer);
				}
				//插入到页面
				mask.append(win);
				body.append(mask);
				//配置宽度
				if(config.width){
					win.width(config.width);
				}
				//配置透明度
				if(config.maskOpacity){
					mask.css("background","rgba(0,0,0,"+ config.maskOpacity +")");
				}
				//延迟
				if(config.delay && config.delay != 0){
					window.setTimeout(function(){
						_this.close();
						config.delayCallback();
					}, config.delay);
				}
				//动画
				if(config.effect){
					this.animate();
				}
				//遮罩层关闭
				if(config.maskClose){
					mask.tap(function(){
						_this.close();
					});
				}
			}
		},
		//按照按钮参数来配置
		createButton:function(footer,buttons){
			var _this=this;
			$(buttons).each(function(){
				var type=this.type ? " class='"+ this.type + "'":"";
				var btnText=this.text ? this.text : "按钮"+(++i);
				var callback=this.callback ? this.callback : null;
				var button=$("<button"+type+">"+btnText+"</button>");
				if(callback){
					button.tap(function(e){
						//防止事件冒泡，点击按钮不关闭，存在回调 防止点击遮罩层关闭
						 e.stopPropagation(); 
						 var isClose=callback();
						 if(isClose !=false){
							_this.close();						 	
						 }
					});
				}else{
					button.tap(function(e){
						e.stopPropagation(); 
						_this.close();
					});
				}
				footer.append(button);
			});
		},
		//关闭
		close:function(){
			this.mask.remove();
		},
		//创建动画效果
		animate:function(){
			var _this=this;
			this.win.css("transform","scale(0,0)");
			window.setInterval(function(){
				_this.win.css("transform","scale(1,1)");
			},100);
		}
	};

	window.Dialog=Dialog;
	$.dialog=function(config){
		return new Dialog(config);
	};
})(Zepto);