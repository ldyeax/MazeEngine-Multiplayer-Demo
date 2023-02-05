<!doctype html>
<meta charset=utf-8>
<title>Space Physics</title>
<style>
*{
	margin:0;
	padding:0;
	overflow:hidden;
}
html{
	//I cannot believe I actually have to set the height of html to 100%
	//why.jpg
	height:100%;
}
body{
	height:100%;
	width:100%;
}
input{
	z-index:9000;
}
div{
	background-color:white;
	width:100%;
}
#spaceholder{
	display:block;
	z-index:-10;
	width:100%;
	height:100%;
	background-image:url('../img/spacebg.jpg');
	position:absolute;
	top:0;
	left:0;
}
</style>

<body>
<button onclick='jinit()'>New</button>
<div id=spaceholder></div>

<script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
<script>
$.ajaxSetup({cache: false});
</script>

<script src='js/spaceobject.js'></script>
<script>
$.spacecolmode = 'square'
function debug(a){
	$("#debug").html(a)
}

var box = new SpaceBox({"id":"cheese",
						"container":"#spaceholder",
						"pacman":1})

box.newspace({"speed":3,"x":0,  "y":0,  "angle":-45,"contents":"<img src='http://upload.wikimedia.org/wikipedia/commons/d/d6/8-cell-orig.gif'>"})
box.newspace({"speed":2,"x":200,"y":200,"angle":65 ,"contents":"<span style='color:green;font-size:20px;'>Hello World</span>"})
box.newspace({"speed":1,"x":400,"y":200,"angle":190,"contents":"<img src='http://images2.wikia.nocookie.net/__cb20100328045102/streetfighter/images/b/b4/Ryu-bigsuper.gif'>"})

box.init()

jinit = function(){
	box.newspace({"xbumplimit":$('#bl').val(),"ybumplimit":$('#bl').val(),"speed":$('#sp').val(),"x":500,"y":400,"angle":$("#an").val(), "contents":"<img src='../img/ljr.gif'>"})
	if(!box.initialized)
		box.init()
}
</script>
