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

//Variable name style:
//class definitions like Java
//everything else lowercase 
//only use underscores when vowels have to be separated in the word
//a variable name will either use underscores to separate every word or no underscores at all
//ex:
//boundingboxcollision
//change_image_size
//hello_everybody_who_is_in_the_houses

function boundingboxcollision(y1,x1,y2,x2,y3,x3,y4,x4,debug){
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
|y4,x3______y4,x4|	|y2,x1______y2,x2| |y4,x3_______y4,x4|
                    
	                 ________________
	                |y3,x3		y3,x4|
	                |				 |
	                |				 |
	                |y4,x3______y4,x4|
*/
	if(y3 > y2)
		return 0
	if(y4 < y1)
		return 0
	if(x3 > x2)
		return 0
	if(x4 < x1)
		return 0
	return 1
}
function distance(y1,x1,y2,x2){
	return Math.sqrt( ((x1+x2)*(x1+x2)) + ((y1+y2) * (y1+y2)) )
}
function circlecollision(y1,x1,r1,y2,x2,r2){
	return diff(y1,y2) < r1+r2 && diff(x1,x2) < r1+r2
}

}

function booltostring(a){
	if(a)
		return "Yes"
	return "No"
}

function radtodeg(r){
	return r * (180 / Math.PI)
}
function degtorad(d){
	return d * (Math.PI / 180)
}

function get_unique_id(){
	var ret=setInterval("1",65535);
	clearInterval(ret)
	return ret
}

function SpaceBox(bargs){
	var box = this
	
	box.id = bargs['id']
	if(typeof(box.id)=='undefined')
		box.id = get_unique_id()
	
	box.container = bargs['container']
	if(typeof(box.container)=='undefined')
		box.container=window
	
	box.style = "width:100%;height:100%;position:absolute;"
		
	$(box.container).append("<span id=\""+box.id+"\" style=\"" + box.style + "\"></span>")
	
	box.y = bargs['y']
	box.x = bargs['x']
		
	box.jqobj = $('#'+box.id)
	
	box.height = box.jqobj.height()
	box.maxy = box.height
	box.miny = 0
	
	box.width = box.jqobj.width()
	box.maxx = box.width
	box.minx = 0
/*
	box.style = "position:absolute; z-index:0; visibility:hidden; background-image: url('"+box.bgimage+"'); top:"+box.y+"px;left:"+box.x+"px;width:"+box.width+"px;height:"+box.height+"px;"
*/
	box.pacman = bargs['pacman']
	box.spaces = new Array()

	box.newspacetemplate = function(args){
		var cs = this
		cs.contents = args['contents']
		
		cs.collidingwith = function(space){
			var collidingwithreturn = 0
			var mode='square'
		/*        top
			 ---- ---- ----
			|    |    |    |
			 ----M---- ----
		left|    |    |    |right
			 ---- ---- ----
			|    |    |    |
			 ---- ---- ----
			     bottom
		*/
			
			//Check 8 copy boxes around the box
			var top    = 0-box.maxy
			var bottom = box.maxy*2
			var left   = 0-box.maxx-cs.width
			var right  = box.maxx*2 + cs.width*2
			
			var colboxes = new Array(
				new Array(left,top)        ,new Array(0,top)      ,new Array(right,top),
				new Array(left,0)		   ,new Array(0,0)	      ,new Array(right,0),
				new Array(left,bottom)     ,new Array(0,bottom)   ,new Array(right,bottom)
			)
			
			$.each(colboxes,function(){
				var colbox = this
				var tempx = colbox[0]
				var tempy = colbox[1]
				/*	
				collidingwithreturn = boundingboxcollision(	cs.y+tempy, cs.x+tempx, cs.y+cs.height+tempy, cs.x+cs.width+tempx, 
															ospac.y,ospac.x,ospac.y+ospac.height,ospac.x+ospac.width)
				*/
				if(!collidingwithreturn)
				
					collidingwithreturn = circlecollision(
						cs.y+tempy,
						cs.x+tempx,
						greater(cs.height, cs.width)/2, 
						space.y,
						space.x,
						greater(space.height, space.width)/2
					)
				
				/*
					collidingwithreturn = boundingboxcollision(
						cs.y+tempy,
						cs.x+tempx,
						cs.y+cs.height+tempy,
						cs.x+cs.width+tempx, 
						space.y,
						space.x,
						space.y+space.height,
						space.x+space.width
					)
				*/
			})
			return collidingwithreturn
		}
		
		cs.change_angle = function(a){
			if(typeof(a)=='undefined')
				a=randint(1,360)
			cs.angle=a
		}
		cs.changespeed = function(s){
			if(typeof(s)=='undefined')
				s=randint(1,8)
			s=parseFloat(s)
			cs.speed  = s
			cs.xspeed = cs.speed * Math.cos(degtorad(cs.angle))
			cs.yspeed = cs.speed * Math.sin(degtorad(cs.angle))
		}
		cs.velocityfromyx = function(speedY, speedX){	
			cs.change_angle( radtodeg(Math.atan2(speedY , speedX)) )
			cs.changespeed( Math.sqrt( speedY*speedY + speedX*speedX) )
		}
		cs.change_image = function(i){
			if(typeof(i)=='undefined')
				i = "http://space.thelunarempire.net/img/ljr.gif"
			cs.imgsrc = i
			cs.imgheight = imgheight(cs.imgsrc)
			cs.imgwidth  = imgwidth(cs.imgsrc)
			cs.mass      = cs.imgheight * cs.imgwidth
			cs.height    = cs.imgheight
			cs.width     = cs.imgwidth
		}
		cs.draw = function(){
			document.getElementById(""+cs.id).style.top= cs.y+'px'
			document.getElementById(""+cs.id).style.left=cs.x+'px'
		}
		cs.moveto = function(y,x){
			cs.y=y
			cs.x=x
		}
		cs.updatemass = function(){
			cs.imgheight = $('#'+cs.id).height()
			cs.imgwidth  = $('#'+cs.id).width()
			cs.mass      = cs.imgheight * cs.imgwidth
			cs.height    = cs.imgheight
			cs.width     = cs.imgwidth
		}
		//n is the fraction of a tick cs will be executed
		cs.updateposnocoll = function(n){
			if(typeof(n)=='undefined')
				n=1
			cs.moveto(cs.y - cs.yspeed/n, cs.x + cs.xspeed/n)
			//alert(cs.x)
		}
		
		//n is the fraction of a tick cs will be executed
		cs.ybumpcount=0
		cs.xbumpcount=0
		
		cs.ybumplimit=args['ybumplimit']
		cs.xbumplimit=args['xbumplimit']
		
		cs.updatepos = function(n){
			if(box.pacman){
				if(cs.y<box.miny-cs.height)
					cs.y=box.maxy
				else if(cs.y>box.maxy)
					cs.y=box.miny
					
				if(cs.x > box.maxx + cs.width)
					cs.x = box.minx - cs.width
				else if(cs.x < box.minx - cs.width)
					cs.x = box.maxx + cs.width
			}
			else{
				if(cs.xbumplimit != "none"){
					try{
						if(cs.xbumpcount>=cs.xbumplimit)
							cs.changespeed(0)
					}catch(e){}
				}
				if(cs.ybumplimit != "none"){
					try{
						if(cs.ybumpcount>=cs.ybumplimit)
							cs.changespeed(0)
					}catch(e){}
				}
				if(cs.y+cs.height>box.maxy || cs.y < 0){
					cs.velocityfromyx(cs.yspeed*-1,cs.xspeed)
					cs.ybumpcount++
				}
				if(cs.x+cs.width>box.maxx || cs.x < 0){
					cs.velocityfromyx(cs.yspeed,cs.xspeed*-1)
					cs.xbumpcount++
				}
			}
			cs.updateposnocoll(n)
		}
		cs.collide = function(b){
			//final v1 = 
			//original velocity 1 (mass1 - mass2) + 2(mass2)(original velocity2)
			// _______________________________________________________________
			//mass1 + mass2
			//for one dimension
			//so, just do this to both xspeed and yspeed
			
			finalvelocity1dcol = function(ovel1,ovel2,mass1,mass2){
				return( (ovel1 * (mass1 - mass2) + 2 * mass2 * ovel2)/(mass1+mass2) )
			}
			
			var yspeed1 = cs.yspeed
			var xspeed1 = cs.xspeed
			var mass1   = cs.mass
			
			var yspeed2 = b.yspeed
			var xspeed2 = b.xspeed
			var mass2   = b.mass

			cs.velocityfromyx( finalvelocity1dcol(yspeed1, yspeed2, mass1, mass2), finalvelocity1dcol(xspeed1, xspeed2, mass1, mass2) )
			 b.velocityfromyx( finalvelocity1dcol(yspeed2, yspeed1, mass2, mass1), finalvelocity1dcol(xspeed2, xspeed1, mass2, mass1) )
		}
		{
		try{
			cs.y = args['y']
		}catch(e){
			cs.y=randint(0,$("body").height())
		}
		try{
			cs.x = args['x']
		}catch(e){
			cs.x=randint(0,$("body").width())
		}
		try{
			cs.change_angle(args['angle'])
		}catch(e){
			cs.change_angle()
		}
		try{
			cs.changespeed(args['speed'])
		}catch(e){
			cs.changespeed()
		}
		try{
			cs.change_image(args['imgsrc'])
		}catch(e){
			cs.change_image()
		}
		
		cs.id=args['id']
		if(typeof(cs.id)=='undefined')
			cs.id=get_unique_id()
		}
		
		cs.accellerate = function(s,a){
			//todo
		}
		
		cs.init = function(){
			$('#'+box.id).append("<span class=space id="+cs.id+" style='position:absolute;'>"+cs.contents+"</span>");
			
			//n is the fraction of a tick cs will be executed
			cs.tick = function(n){
				cs.updatemass()
				cs.updatepos(n)

				cs.draw()
			}
			
			//Make it not drag the image
			$('#'+cs.id).bind('dragstart', function(event){
				event.preventDefault();
			});
			
			cs.holding=0
			$('#'+cs.id).mousedown(function(){
				cs.holding=1
			})
			$('html').mouseup(function(){
				cs.holding=0
			})
			$('#'+cs.id).mouseleave(function(){
				cs.holding=0
			})
			
			cs.lastmousex=-1; 
			cs.lastmousey=-1;
			
			$('html').mousemove(function(e){
				cs.mousex = e.pageX;
				cs.mousey = e.pageY;
				if (cs.lastmousex > -1){
					cs.speedX = cs.mousex-cs.lastmousex
					cs.speedY = cs.mousey-cs.lastmousey
				}
				cs.lastmousex = cs.mousex;
				cs.lastmousey = cs.mousey;
				if(cs.holding){	
					cs.velocityfromyx(-cs.speedY,cs.speedX)
				}
			});
		}
		cs.init()
	}
	box.newspace = function(args){
		box.spaces.push(new box.newspacetemplate(args))
	}
	//box.spaces = new Array();
	box.getspace = function(id){
		for(var i=0;i<box.spaces.length;++i){
			if(box.spaces[i].id==id){
				return box.spaces[i];
			}
		}
	}
	
	//n is the fraction of a tick cs will be executed
	box.btick = function(n){
		for(var i=0;i<box.spaces.length;++i){
			box.spaces[i].tick(box.spaces.length)
		}
	}
	
	box.init = function(){
		box.initialized=1
		$('#'+box.id).css("visiblity","visible")
		document.getElementById(box.id).style.visibility='visible'
		
		box.interval = setInterval(function(){
			var collisions1 = new Array()
			var collisions2 = new Array()
			alreadycollided = function(a,b){
				for(var i=0;i<collisions1.length;++i)
					if((collisions1[i] == a.id && collisions2[i] == b.id) || (collisions1[i] == b.id && collisions2[i] == a.id))
						return 1
				return 0
			}
			$.each(box.spaces, function(){
				var space = this
				$.each(box.spaces, function(){
					var space2 = this
					if(space.id != space2.id && space.collidingwith(space2) && !alreadycollided(space,space2)){
						space.collide(space2)

						collisions1.push(space.id)
						collisions2.push(space2.id)
					}
					else if(space.collidingwith(space2) && alreadycollided(space,space2)){
						//stuff went here
					}
					box.btick( box.spaces.length*box.spaces.length)

					//box.btick( box.spaces.length*box.spaces.length )
				})
			})
		},10)
	}
}