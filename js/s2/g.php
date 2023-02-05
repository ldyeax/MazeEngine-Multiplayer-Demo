
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
	z-index:65535;
}
</style>

<body>

<div>
	Speed: <input value=5 id=sp>
	<br>
	Angle: <input value=180 id=an>
	<br>
	Gravity: <input value=9.8 id=grav>
	<br>
	<input type=submit onclick='jinit()' value='Submit'>
</div>

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
							"y":100,
							"x":0,
							"height":$(window).height()-100,
							"width":$(window).width(),
							"background":"../img/spacebg.jpg",
							"gravity":$('#grav').val(),
							"pacman":1})

jinit = function(){
	box.newspace({"speed":$('#sp').val(),"x":500,"y":400,"angle":$("#an").val(), "contents":"<img src='../img/ljr.gif'>"})
	if(!box.initialized)
		box.init()
}


</script>
