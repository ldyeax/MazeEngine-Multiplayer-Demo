
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
	Bounce limit: <input value="none" id=bl>
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
							"pacman":0})

jinit = function(){
	box.newspace({"xbumplimit":$('#bl').val(),"ybumplimit":$('#bl').val(),"speed":$('#sp').val(),"x":500,"y":400,"angle":$("#an").val(), "contents":"<img src='http://i.imgur.com/TtZkP.jpg'>"})
	if(!box.initialized)
		box.init()
}


</script>
