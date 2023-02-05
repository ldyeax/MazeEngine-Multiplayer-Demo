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
	getUrlVars:function()
	{
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

function rad(n){
	return n*(Math.PI/180);
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

}