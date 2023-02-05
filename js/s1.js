function CheesyClass(){
	var that=this
	that.cheeses = new Array()
	that.cheesy_template = function(x){
		this.cheesy_dinner = x
	}
	that.add_cheese = function(x){
		that.cheeses.push(new that.cheesy_template(x))
	}
	that.init=function(){
		for(var i=0;i<that.cheeses.length;++i)
			alert(that.cheeses[i].cheesy_dinner)
	}
}