$(function(){
	var canvas=$("#canvas").get(0);
	var ctx=canvas.getContext("2d");
	var sep=40;
	var sR=4;
	var bR=18;
	var audio=$("#audio").get(0);
	var qizi={};
	var canvas1=$("#canvas1").get(0);
    var canvas2=$("#canvas2").get(0);
    var ctx1=canvas1.getContext("2d");
    var ctx2=canvas2.getContext("2d");
    var kongbai={};
    var s1=0;
    var s2=0;
    var t1;
    var t2;
    var AI=false;
    var gameState="pause";
    var flag=true;
    var kaiguan=true;
    
    //表
    //秒针1
    ctx1.translate(75,75)
    function miaozhen1(){
	   	ctx1.save()
	   	ctx1.rotate(Math.PI/180*6*s1);
	   	ctx1.beginPath();
	   	ctx1.arc(0,0,4,0,Math.PI*2);
	   	ctx1.closePath();
	   	ctx1.moveTo(0,4)
		ctx1.lineTo(0,10)
		ctx1.moveTo(0,-4)
		ctx1.lineTo(0,-47)
		ctx1.closePath();
		ctx1.stroke()
	   	ctx1.restore();
    }
    miaozhen1()
    //秒针2
    ctx2.translate(75,75);
    function miaozhen2(){
	   	ctx2.save()
	   	ctx2.rotate(Math.PI/180*6*s2);
	   	ctx2.beginPath();
	   	ctx2.arc(0,0,4,0,Math.PI*2);
	   	ctx2.closePath();
	   	ctx2.moveTo(0,4)
		ctx2.lineTo(0,10)
		ctx2.moveTo(0,-4)
		ctx2.lineTo(0,-47)
		ctx2.closePath();
		ctx2.stroke()
	   	ctx2.restore();
    }
    miaozhen2()
    //换算时间
    function format(v){
		v=Math.floor (v);
		var s = v % 60;
		s=(s<10)?("0"+s):s;
		var m=Math.floor(v/60);
		return m + ":" + s;
	}
    //渲染1，运行秒针1
    function render1(){
    	    ctx1.clearRect(-100,-100,200,200);
	        s1++;
        	miaozhen1();
        	var htm1=format(s1);
            $(".content1").html(htm1);
        }
    //渲染2，运行秒针2
    function render2(){
    	    ctx2.clearRect(-100,-100,200,200);
	        s2++;
        	miaozhen2();
            var htm1=format(s2);
            $(".content2").html(htm1);
        }
    
    
    
    //棋子准确位置
	function l(x){
		return(x+0.5)*sep+0.5;
	}
//	连接a_b
	function lian(a,b){
   	  return a+'_'+b;
    }
	//圆点
	function circle(x,y){
		ctx.save();
		ctx.translate(l(x),l(y));
		ctx.beginPath()
		ctx.arc(0,0,sR,0,Math.PI*2)
		ctx.closePath();
		ctx.fill()
		ctx.restore()
	}
   //棋盘
   function qipan(){
   	  ctx.clearRect(0,0,canvas.width,canvas.height)
   	  ctx.save();
   	  ctx.beginPath();
   	  for(var i=0;i<15;i++){
   	  	ctx.moveTo(l(0),l(i))
   	  	ctx.lineTo(l(14),l(i))
   	  	ctx.moveTo(l(i),l(0))
   	  	ctx.lineTo(l(i),l(14))
   	  }
   	  ctx.stroke()
   	  ctx.closePath();
   	  ctx.restore();
   	  circle(3,3)
   	  circle(11,3)
   	  circle(7,7)
   	  circle(3,11)
   	  circle(11,11)
   	  
   	  for(var i=0;i<15;i++){
   	  	for(var j=0;j<15;j++){
   	  		kongbai[lian(i,j)]=true;
   	  	}
   	  }
   }
   qipan();
   //棋子
   function luozi(x,y,color){
   	  ctx.save();
   	  ctx.translate(l(x),l(y));
   	  ctx.beginPath()
		if(color=="black"){
			var g=ctx.createRadialGradient(-5,-6,4,0,0,18);
			  g.addColorStop(0.1, '#eee');
			  g.addColorStop(0.4, 'black');
			  g.addColorStop(1, 'black');
		}else{
			 var g=ctx.createRadialGradient(-5,-8,3,0,0,18);
			  g.addColorStop(0.1, '#fff');
			  g.addColorStop(0.4, '#eee');
			  g.addColorStop(1, '#eee');
		}
	  ctx.fillStyle=g;
   	  ctx.arc(0,0,bR,0,Math.PI*2);
   	  ctx.fill();
   	  ctx.closePath();
   	  ctx.restore();
   	  qizi[x+'_'+y]=color;
   	  gameState="play";
   	  delete kongbai[lian(x,y)];
   }
  
   //棋谱
   chesspManual=function (){
   	  ctx.save();
   	  ctx.font="20px/1  微软雅黑";
   	  ctx.fillStyle="red";
   	  ctx.textAlign='center';
   	  ctx.textBaseline="middle";
   	  var i=1;
   	  for(var k in qizi){
   	  	var arr=k.split("_");
   	  	if(qizi[k]==="white"){
   	  		ctx.fillStyle="black";
   	  	}else{
   	  		ctx.fillStyle="white";
   	  	}
   	  	ctx.fillText(i++,l(parseInt(arr[0])),l(parseInt(arr[1])))
   	  }
   	   ctx.restore();
   	   var qipu=$(".qipu")
   	   if($(".qipu").find("img").length){
   	   	 $(".qipu").find("img").attr("src",canvas.toDataURL())
   	   }else{
   	   	  $("<img>").attr("src",canvas.toDataURL()).appendTo(qipu);
   	   }
	   if($(".qipu").find("a").length){
	      $(".qipu").find("a").attr("href",canvas.toDataURL()).attr("download","qipu.png")
	   }else{
		$("<a>下载棋谱</a>").attr("href",canvas.toDataURL()).attr("download","qipu.png").appendTo(".qipu");
	   }
   }
    
   //棋盘点击事件
   function dianji(){
	   	$(canvas).on("click",function(e){
	   	var x=Math.floor(e.offsetX/sep);
	   	var y=Math.floor(e.offsetY/sep);
	   	if(qizi[x+"_"+y]){
	                return;
	            }
	   	//人机对战
	   	if(AI){
	   		luozi(x,y,"black");
	   		if(panduan(x,y,"black")>=5){
	   			$('.jieguo').addClass('active4'); 
	   			$('.jieguo').find(".chengji").html("黑棋胜")
	   			$('.chengji').addClass('active5'); 
	   		}
	   		var p=intel();
	        luozi(p.x,p.y,"white");
	        if(panduan(p.x,p.y,"white")>=5){
	   			$('.jieguo').addClass('active4'); 
	   			$('.jieguo').find(".chengji").html("白棋胜")
	   			$('.chengji').addClass('active5'); 
	   		}
	        return false;
	   	}
	   	//人人对战
	   	if(flag){
	   		luozi(x,y,"black")
	   		if(panduan(x,y,"black")>=5){
	   			$('.jieguo').addClass('active4'); 
	   			$('.jieguo').find(".chengji").html("黑棋胜")
	   			$('.chengji').addClass('active5'); 
	   		}
	   		t2=setInterval(render2,1000)
	   		clearInterval(t1)
	   	}else{
	   		luozi(x,y,"white")
	   		if(panduan(x,y,"white")>=5){
	   			$('.jieguo').addClass('active4'); 
	   			$('.jieguo').find(".chengji").html("白棋胜")
	   			$('.chengji').addClass('active5'); 
	   		}
	   		t1=setInterval(render1,1000)
	   		clearInterval(t2)
	   	}
	   	flag=!flag;
	   })
   }
   dianji();
   //人机模式互相切换
   $(".normal").addClass("red");
   $(".ai").on("click",function(){
   	if(gameState=="play"){
   		return;
   	}
   	$(this).addClass("red");
   	$(".normal").removeClass("red");
   	AI=true;
   })
   $(".normal").on("click",function(){
   	if(gameState=="play"){
   		return;
   	}
   	$(this).addClass("red");
   	$(".ai").removeClass("red");
   	AI=false;
   })
   //确定位置
   function intel(){
   	 var max=-Infinity;
   	 var pos={};
   	 for(var k in kongbai){
   	 	var x=parseInt(k.split("_")[0]);
   	 	var y=parseInt(k.split("_")[1]);
   	 	var m=panduan(x,y,"black");
   	 	if(m>max){
   	 		max=m;
   	 		pos={x:x,y:y};
   	 	}
   	 }
	   var max2=-Infinity;
	   var pos2={};
	   for(var k in kongbai){
	   	    var x=parseInt(k.split("_")[0]);
	   	 	var y=parseInt(k.split("_")[1]);
	   	 	var m2=panduan(x,y,"white");
	   	 	if(m2>max2){
	   	 		max2=m2;
	   	 		pos2={x:x,y:y};
	   	 	}
	   }
	   if(max>max2){
	   	return pos;
	   }else{
	   	return pos2;
	   }
	}
   //弹出游戏介绍
   $(".t1").on("click",false,function(){
   	$(".youxijiesao").addClass("active")
   })
   $(".chahao").on("click",false,function(){
   	$(".youxijiesao").removeClass("active")
   })
   //弹出游戏规则
   $(".t2").on("click",false,function(){
   	$(".youxiguize").addClass("active")
   })
   $(".chahao").on("click",false,function(){
   	$(".youxiguize").removeClass("active")
   })
   //弹出意见
   $(".t3").on("click",false,function(){
   	$(".yijian").addClass("active")
   })
   $(".chahao").on("click",false,function(){
   	$(".yijian").removeClass("active")
   })
   //隐藏开始界面
   $(".t4").on("click",false,function(){
   	$(".start").css("display","none");
   	$(".anniu").addClass("active2")
   })
   //点击游戏开始
   $(".anlist1").on("click",function(){
   	  t1=setInterval(render1,1000);
   })
   //查看棋谱
   $(".anlist5").on("click",function(){
   	  chesspManual();
   	  $(".qipu").show();
   	  for(var k in qizi){
   	  	var x=parseInt(k.split("_")[0])
   	  	var y=parseInt(k.split("_")[1])
   	  	luozi(x,y,qizi[k])
   	  }
   })
   //重新开始
   $(".anlist4").on("click",function(){
   	  ctx.clearRect(0,0,600,600)
		qipan();
		qizi={};
		flag=true;
		dianji();
		gameStates='pause'
   })
   //棋谱显示
   $(".anlist6").on("click",function(){
  	ctx.clearRect(0,0,600,600)
		$('.jieguo').removeClass('active4');
		qipan();
		qizi={};
		flag=true;
		dianji();
		gameState='pause';
        $(".start").css('display',"block")
  })
   $(".qipu").hide()
   //棋谱隐藏
   $(".bax").on("click",function(){
   	  $(".qipu").hide()
   })
  //摸摸大
  $(".anniu div").each(function(index){
  	$(this).hover(
  		function(){
  			$(this).addClass("active3")
  		},function(){
  			$(this).removeClass("active3")
  		}
  	)
  })
   //判断输赢
   function panduan(x,y,color){
   	 var i;
   	 var row=1;
   	  i=1;while(qizi[lian(x+i,y)]==color){row++;i++;}
   	  i=1;while(qizi[lian(x-i,y)]==color){row++;i++;}	
   	  	
   	 var lie=1;
   	  i=1;while(qizi[lian(x,y+i)]==color){lie++;i++;}
   	  i=1;while(qizi[lian(x,y-i)]==color){lie++;i++;} 
   	  
   	  var zx=1;
   	  i=1;while(qizi[lian(x+i,y+i)]==color){zx++;i++;}
   	  i=1;while(qizi[lian(x-i,y-i)]==color){zx++;i++;} 	
   	  
   	  var yx=1;
   	  i=1;while(qizi[lian(x-i,y+i)]==color){yx++;i++;}
   	  i=1;while(qizi[lian(x+i,y-i)]==color){yx++;i++;} 
   	  
   	  return Math.max(row,lie,zx,yx);
   }
  $(".again").on("click",function(){
  	ctx.clearRect(0,0,600,600)
		$('.jieguo').removeClass('active4');
		qipan();
		qizi={};
		flag=true;
		dianji();
		gameState='pause';

  })
  $(".tuichu").on("click",function(){
  	ctx.clearRect(0,0,600,600)
		$('.jieguo').removeClass('active4');
		qipan();
		qizi={};
		flag=true;
		dianji();
		gameState='pause';
        $(".start").css('display',"block")
  })
})

