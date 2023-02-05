{
//Collection of my functions I use often

function randint(min,max){ 
	return Math.floor(Math.random()*(max-min+1))+min
}

function forInRange(start,end,variable,code){
	eval(variable+"="+start+";for("+variable+"=start;"+variable+"<end;"+variable+"++){code()}");
}

function greater(a,b){
	return (a>b) ? a : b;
}

function lesser(a,b){
	return (a<b) ? c=a : c=b;
}

function diff(a,b){
	return greater(a,b) - lesser(a,b);
}

$.extend({
	getUrlVars:function(){
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},
	getUrlVar: function(name)
	{
		return $.getUrlVars()[name];
	}
});

$.extend({
	getHashVars:function(){
		var ohashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('#');
		var hashes = new Array();
		for(var i=1;i<ohashes.length;++i){
			hashes.push(ohashes[i]);
		}
		return hashes
	}
});

function rad(n){
	return n*(Math.PI/180);
}

function deg(n){
	return n*(180/Math.PI);
}

function anglesin(n){
	return Math.sin(parseInt(n) * (Math.PI / 180) )
}
function anglecos(n){
	return Math.cos(parseInt(n) * (Math.PI / 180) )
}

function getImgSize(imgSrc){
	var newImg = new Image();
	newImg.src = imgSrc;
	return[newImg.width,newImg.height];
}

function imgwidth(imgSrc){
	var newImg = new Image();
	newImg.src = imgSrc;
	return newImg.width;
}

function imgheight(imgSrc){
	var newImg = new Image();
	newImg.src = imgSrc;
	return newImg.height;
}

function bounding_box_collision(y1,x1,y2,x2,y3,x3,y4,x4){
/*
	                 ________________
	                |y3,x3		y3,x4|
	                |				 |
	                |				 |
	                |y4,x3______y4,x4|
	                
  _______________	 ________________    _______________
|y3,x3		y3,x4|	|y1,x1		y1,x2| |y3,x3		y3,x4|
|				 |	|				 | |				 |
|				 |	|				 | |				 |
|y4,x3_______y4,x4|	|y2,x1______y2,x2| |y4,x3_______y4,x4|
                    
	                 ________________
	                |y3,x3		y3,x4|
	                |				 |
	                |				 |
	                |y4,x3______y4,x4|

*/
	
	return (y2 < y3 || y1 > y4) && (x2 < x3 || x1 > x4)
}

}

function booltostring(a){
	return a ? "Yes" : "No"
}

function SpaceObject(args){
	var that=this;
	
	that.starter = 0
	that.x=args['x']
	that.y=args['y']
	that.speed=args['speed']
	that.angle=args['angle']
	
	that.xspeed= that.speed * anglecos(that.angle)
	that.yspeed= that.speed * anglesin(that.angle)
	that.yspeed *= -1
	
	that.imgsrc=args['imgsrc']
	if(typeof(that.imgsrc)=="undefined")
		that.imgsrc="img/ljr.gif"
	that.imgheight = imgheight(that.imgsrc)
	that.imgwidth = imgwidth(that.imgsrc)
	
	that.id=setInterval("1",0);
	clearInterval(that.id)
	
	that.colliding_with = function(b){
		$(".space").each(function(){
			if($(this).attr('id') == b){
				var ospac = $.getspace(b) 
				return bounding_box_collision(	that.y, that.x, that.y+that.height,  that.x+that.width, 
												ospac.y,ospac.x,ospac.y+ospac.height,ospac.x+ospac.width )
				
			}
		})
	}
	
	that.changeAngle = function(a){
		that.angle=a	
	}
	that.changeSpeed = function(s){
		that.speed=s
		that.xspeed= that.speed * anglecos(that.angle)
		that.yspeed= that.speed * anglesin(that.angle)	
	}
	that.changeImage = function(i){
		that.imgsrc = i
		that.imgheight = imgheight(that.imgsrc)
		that.imgwidth = imgwidth(that.imgsrc)
		that.mass = that.imgheight * that.imgwidth
	}
	that.moveTo = function(y,x){
		that.y=y
		that.x=x
		document.getElementById(""+that.id).style.top= that.y+'px'
		document.getElementById(""+that.id).style.left=that.x+'px'
	}
	
	that.init = function(){
		$('body').append("<span class=space id="+that.id+" style='position:absolute;'><img src='"+that.imgsrc+"'></span>");
		
		that.tick = function(){
		
			that.y += that.yspeed
			that.x += that.xspeed
			
			if(that.y<0-that.imgheight)
				that.y=window.innerHeight
			else if(that.y > window.innerHeight)
				that.y=0
			
			if(that.x<0-that.imgwidth)
				that.x=document.body.clientWidth
			else if(that.x>document.body.clientWidth)
				that.x=0-that.imgwidth
			
			that.moveTo(that.y,that.x)
			
			if(that.starter){
				//Collision
				$(".space").each(function(){
					var firspace = $.getspace( $(this).attr('id') )
					$(".space").each(function(){
						var secspace = $.getspace( $(this).attr('id') )
						$("#debug").html( booltostring(firspace.colliding_with(secspace)) )
					})
				})
			}
		}
		
		//Make it not drag the image
		$('#'+that.id).bind('dragstart', function(event){
			event.preventDefault();
		});
		
		that.holding=0
		$('#'+that.id).mousedown(function(){
			that.holding=1
		})
		$('html').mouseup(function(){
			that.holding=0
		})
		$('#'+that.id).mouseleave(function(){
			that.holding=0
		})
		
		that.lastmousex=-1; 
		that.lastmousey=-1;
		
		$('html').mousemove(function(e) {
			that.mousex = e.pageX;
			that.mousey = e.pageY;
			if (that.lastmousex > -1){
				that.speedX = that.mousex-that.lastmousex
				that.speedY = that.mousey-that.lastmousey
			}
			that.lastmousex = that.mousex;
			that.lastmousey = that.mousey;
			if(that.holding){
				//that.changeSpeed( Math.abs(that.speedY*2) + Math.abs(that.speedX*2) )
				
				that.speed = Math.abs(that.speedY*2) + Math.abs(that.speedX*2)
				that.xspeed= that.speed * anglecos(that.angle)
				that.yspeed= that.speed * anglesin(that.angle)	
				
				that.angle = Math.atan2(that.speedY , that.speedX) / (Math.PI / 180)
				
				//that.changeAngle( Math.atan2(that.speedY*-1 , that.speedX) / (Math.PI / 180) )
			}
		});
		
		//This is the first space, setup the infrastructure
		if(typeof($.started) == "undefined"){
			$.debugs = new Array()
			$.started = 1
			that.starter=1
			$.spaces = new Array();
			$.getspace = function(id){
				for(var i=0;i<$.spaces.length;++i){
					if($.spaces[i].id==id){
						return $.spaces[i];
					}
				}
			}
		}
		
		that.interval = setInterval(function(){
			that.tick();
		},30);
		
		$.spaces.push(that)
	}
}