
<!doctype html>
<meta charset=utf-8>
<title>Space Physics</title>
<style>
body{
	margin:0;
	padding:0;
	overflow:hidden;
}
input{
	z-index:9000;
}
div{
	background-color:white;
	width:100%;
}
</style>

<body>
<div id=debug>
</div>
<input id=ncorebut type=submit value="Luna" onclick='(random_space()).init()'>
<!--div>
	Collide: <div id=debug></div>
</div -->
<script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
<script>
$.ajaxSetup({cache: false});
</script>
<div id=menu>
Content: <input id=nsrc>
</div>
<script src='js/spaceobject.js'></script>
<script>
$.spacecolmode = 'square'
function debug(a){
	$("#debug").html(a)
}



var coolbox = new SpaceBox({"id":"cheese",
							"y":-100,
							"x":-100,
							"height":$(window).height()+200,
							"width":$(window).width()+200,
							"background":"../img/spacebg.jpg",
							"pacman":0})

coolbox.newspace({"id":"doo", "speed":2,"x":400,"y":400,"angle":27, "contents":"<img src='../img/ljr.gif'>"})
coolbox.newspace({"id":"luna","speed":2,"x":0,  "y":300,"angle":176,"contents":"<span id=containertest></span>"})

var coolbox2 = new SpaceBox({"id":"cheese2",
							"y":-100,
							"x":-100,
							"height":400,
							"width":600,
							"background":"../img/spacebg.jpg",
							"container":"#containertest",
							"pacman":1})
			
coolbox2.newspace({"id":"doo2", "speed":7,"x":400,"y":400,"angle":27, "contents":"<img src='../img/ljr.gif'>"})
coolbox2.newspace({"id":"luna2","speed":4,"x":0,  "y":400,"angle":176,"contents":"<img src='../img/derpy_fly_right.gif'>"})

coolbox.init()
coolbox2.init()
</script>
