wholeunixmillis = function(){
	return Math.round((new Date()).getTime())
}

function SlideShow(args){
	var ss = this
	ss.container = args['container']
	ss.slides = args['slides']
	ss.curslide = 0
	ss.addslide = function(s){
		ss.slides.push(s)
	}
	ss.removeslide = function(s){
		
	}
	ss.advance = function(n){
		if(typeof(n)=='undefined')
			n=1
		ss.curslide+=n
		
		if(ss.curslide>=ss.slides.length)
			ss.curslide=0
		else if(ss.curslide<0)
			ss.curslide=ss.slides.length-1
			
		ss.draw()
	}
	ss.moveto = function(n){
		ss.curslide=n
		ss.draw()
	}
	ss.draw = function(){
		$(ss.container).html(ss.slides[ss.curslide])
	}
	
	ss.tickrate = args['tickrate']
	ss.changespeed = function(s){
		ss.tickrate = s
	}
	ss.prevt = wholeunixmillis()
	ss.init = function(){
		ss.draw()
		clearInterval(ss.interval)
		ss.interval = setInterval(function(){
			var t = wholeunixmillis()
			if(t - ss.prevt > ss.tickrate){
				ss.prevt = t
				ss.advance()
				ss.draw()
			}
		},1)
	}
	
	ss.stop = function(){
		clearInterval(s.interval)
	}
	ss.alertslides = function(){
		for(slide in ss.slides)
			alert(ss.slides[slide])
	}
}