var oBtn = document.querySelector('.status');

oBtn.onclick = function (){		// 点击游戏开始
	
	this.style.display = "none";
	
	Game.init("#box"); // 游戏开始
}

var Game = {
	oEnemy:{	// 敌人的数据

		e1:{
			style:"enemy1",	// 名称
			blood:1,		// 血量
			apeed:5,		// 速度
			score:1			//	积分
		},
		e2:{
			style:"enemy2",	// 名称
			blood:2,		// 血量
			apeed:8,		// 速度
			score:3			//	积分
		},
		e3:{
			style:"enemy3",	// 名称
			blood:3,		// 血量
			apeed:9,		// 速度
			score:5			//	积分
		}

	},
	gk:[	// 关卡
		{
			eMap:[
			 'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
			 'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
			 'e2','e2','e2','e2','e2','e2','e1','e1','e1','e1','e1',
			 'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
			 'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
			 'e1','e1','e1','e1','e1'
			
			],
			colNum:10,
			iSpeedX:10,
			iSpeedY:10,
			times:2000
		},
		{
			eMap:[
			 'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
			 'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
			 'e2','e2','e2','e2','e2','e2','e1','e1','e1','e1','e1',
			 'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
			 'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
			 'e1','e1','e1','e1','e1'
			],
			colNum:10,
			iSpeedX:10,
			iSpeedY:10,
			times:1000
		}

	],
	air:{		// 飞机的数据
		style:"air1",
		bulletStyle:"bullet"
	},
	init:function(id){	// 初始化
		this.oParent = document.querySelector(id);
		this.createScore();
		this.createEnemy(0);
		this.createAir();
	},
	createScore:function(){
		var oS = document.createElement('div');
		oS.id = "score";
		oS.innerHTML = "积分:<span>0</span>";
		this.oParent.appendChild(oS);
		this.oSNum = oS.querySelectorAll('span')[0]
	},
	createEnemy:function(iNow){		// 敌人的创建

		if(this.oUl){	// 每次创建的时候都删除数据
			clearInterval(this.oUl.timer)
			this.oParent.removeChild(this.oUl);

		}

		document.title = "第"+(iNow+1)+"关"
		var _this = this;

		var arr = []; 	// 转化定位布局的数组

		var gk = this.gk[iNow];

		var oUl = document.createElement('ul');
			oUl.id = 'bee';
			oUl.style.width = gk.colNum * 40 + "px";
			
			this.oParent.appendChild(oUl);

			oUl.style.left = (this.oParent.offsetWidth - oUl.offsetWidth) / 2 + 'px'; 
			
			this.oUl = oUl;

			for(var i = 0; i<gk.eMap.length; i++){
				var oLi = document.createElement('li');
					oLi.className = _this.oEnemy[gk.eMap[i]].style;

					oLi.setAttribute("blood", _this.oEnemy[gk.eMap[i]].blood);
					oLi.setAttribute("apeed", _this.oEnemy[gk.eMap[i]].apeed);
					oLi.setAttribute("score", _this.oEnemy[gk.eMap[i]].score);

					oUl.appendChild(oLi);

			}

			this.aLi = oUl.getElementsByTagName('li');


			for(var i = 0; i <_this.aLi.length; i++){	// 定位转换
				arr.push([ _this.aLi[i].offsetLeft, _this.aLi[i].offsetTop])
			}

			for(var i = 0;i <_this.aLi.length; i++){
				_this.aLi[i].style.position = 'absolute';
				_this.aLi[i].style.left = arr[i][0] + "px";
				_this.aLi[i].style.top = arr[i][1] + "px";

			}

			this.runEnemy(gk);
	},
	runEnemy:function(gk){		// 移动敌人

		var _this = this;
		var L = 0;
		var R = this.oParent.offsetWidth - this.oUl.offsetWidth;

		this.oUl.timer = setInterval(function(){  // 每次碰到零界点的时候 就会让整体的top值加10
			if(_this.oUl.offsetLeft > R){
				gk.iSpeedX *= -1;
				_this.oUl.style.top  = _this.oUl.offsetTop + gk.iSpeedY + "px";
					
			}else if(_this.oUl.offsetLeft < L){
				gk.iSpeedX *= -1;
				_this.oUl.style.top  = _this.oUl.offsetTop + gk.iSpeedY + "px";
			}
			_this.oUl.style.left = _this.oUl.offsetLeft + gk.iSpeedX + "px";

		},200);

		setInterval(function(){

			_this.oneMove();

		},gk.times);
		
	},
	oneMove:function(){	// 单兵作战
		var _this = this;
		var nowLi = this.aLi[Math.floor(Math.random() * this.aLi.length)];
		

		nowLi.timer = setInterval(function(){
			var a = (_this.oA.offsetLeft + _this.oA.offsetWidth/2) - (nowLi.offsetLeft + nowLi.parentNode.offsetLeft + _this.oA.offsetWidth/2);

			var b = (_this.oA.offsetTop + _this.oA.offsetHeight/2) - (nowLi.offsetTop + nowLi.parentNode.offsetTop + _this.oA.offsetHeight/2);

			var c = Math.sqrt(a*a + b*b);

			
			var isX = parseInt(nowLi.getAttribute('apeed')) * a/c;
			var isY = parseInt(nowLi.getAttribute('apeed')) * b/c;

			
		
			nowLi.style.left = nowLi.offsetLeft + isX + "px";
			nowLi.style.top = nowLi.offsetTop + isY + "px";

			if(_this.Pz(_this.oA,nowLi)){
				alert("游戏结束");
				window.location.reload();
			}

		},30);
	},
	createAir:function(){	// 飞机的创建
		var oA = document.createElement("div");

		oA.className = this.air.style;
		this.oParent.appendChild(oA);
		oA.style.left = (this.oParent.offsetWidth - oA.offsetWidth) / 2 + 'px'; 
		oA.style.top = this.oParent.offsetHeight - oA.offsetHeight + 'px'; 

		this.oA = oA;

		this.bindAir();

	},
	
	bindAir:function(){		// 操作飞机

		var timer = null;
		var iNum = 0;
		var _this = this;

		var L = 0;
		var R = this.oParent.offsetWidth - this.oA.offsetWidth;

		document.onkeydown  = function(ev){
			var e = e || window.event;
			if(!timer){
				timer = setInterval(show, 30);
			}
			if(e.keyCode == 37){	// 左边
				iNum = 1;

			}else if (e.keyCode == 39){	// 右边
				iNum = 2;
			}
		};
		document.onkeyup = function(e){
			var e = e || window.event;

			clearInterval(timer);
			timer = null;
			iNum = 0;

			if(e.keyCode == 32) {
				_this.createBullet();
			}
		};
		
		function show (){
			if(iNum == 1 ){
				_this.oA.style.left = _this.oA.offsetLeft - 10 + "px";

				if(_this.oA.offsetLeft < L){
					_this.oA.style.left = L + "px";
				}
			}else if(iNum == 2){
				_this.oA.style.left = _this.oA.offsetLeft + 10 + "px";

				if(_this.oA.offsetLeft > R){
					_this.oA.style.left = R + "px";
				}
			}
		}
	},
	createBullet:function(){		// 创建子弹
		var oB  = document.createElement('div');

			oB.className  = this.air.bulletStyle;
			this.oParent.appendChild(oB);

			oB.style.left = this.oA.offsetLeft + this.oA.offsetWidth/2 + "px";
			oB.style.top = this.oA.offsetTop - 10 + "px";

			this.runBullet(oB);
	},
	runBullet:function(oB){	// 子弹的运动

		var _this = this;
		oB.timer = setInterval(function(){
			if(oB.offsetTop < -10 ) {

				clearInterval(oB.timer);
				_this.oParent.removeChild(oB);

			}else{
				oB.style.top = oB.offsetTop - 10 + "px";
			}

			for(var i = 0; i<_this.aLi.length; i++){
				if(_this.Pz(oB,_this.aLi[i])){
					if(_this.aLi[i].getAttribute('blood')  == 1){
						clearInterval(_this.aLi[i].timer)
						_this.oSNum.innerHTML =
						parseInt(_this.oSNum.innerHTML) + parseInt(_this.aLi[i].getAttribute("score"))
						_this.oUl.removeChild(_this.aLi[i]);
						

					}else{
						_this.aLi[i] -- ;
					}

					// 并不是每次删除一个元素 他对应的定时器就消失
					clearInterval(oB.timer);	
					_this.oParent.removeChild(oB);
				}else{

				}
			}

			if(!_this.aLi.length){
				_this.createEnemy(1);	// 进入下一关
			}
			
		},30)
	},
	Pz:function(obj1,obj2){	// 碰撞检测

		var L1 = obj1.offsetLeft;
		var R1 = obj1.offsetLeft + obj1.offsetWidth;
		var T1 = obj1.offsetTop;
		var B1 = obj1.offsetTop + obj1.offsetHeight;

		var L2 = obj2.offsetLeft + obj2.parentNode.offsetLeft;
		var R2 = obj2.offsetLeft + obj2.offsetWidth + obj2.parentNode.offsetLeft;
		var T2 = obj2.offsetTop + obj2.parentNode.offsetTop;
		var B2 = obj2.offsetTop + obj2.offsetHeight + obj2.parentNode.offsetTop;

		if(R1 < L2 || L1 > R2 || B1<T2  || T1 > B2){  // 着都是不能碰到的
			return false

		}else{
			return true;
		}
	}	

}
