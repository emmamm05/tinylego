Parse.initialize("B0RmWvAnwf8prJLztD9wSGsxAn1o2Lknzl6tqyGg", "Uca15YO3L0TNyNfZYwfC9ENCVm6dIY1U8AkDj0LN");
var Figura = Parse.Object.extend("mini_figura");
var query = new Parse.Query(Figura);	    
query.find({
  success: function(results) {
      for (var i = 0; i < results.length; i++) { 
	var object = results[i];
	var url = object.get('foto').url() ;
	var title = object.get('nombre');
	var serie = object.get('serie');
	var descripcion = object.get('descripcion');
	
	//Para el carousel
	document.getElementById('links').innerHTML = document.getElementById('links').innerHTML + 
	  "<a href='"+ url +"' title='"+title+"' data-gallery></a>";
	  
	//Para el index
	document.getElementById("minifigures").innerHTML = document.getElementById("minifigures").innerHTML + 
	  "<div class='row'>" +
	    "<div class='col-md-4'>"+"<img src='"+url+"'>"+"</div>" +
	    "<div class='col-md-4'>" +
	      "<div class='row'>"+"<a href='"+url+"' data-gallery>"+title+"</a></div>" + 
	      "<div class='row'>"+serie+"</div>" + 
	      "<div class='row'>"+descripcion+"</div>" + 
	    "</div>" +
	  "</div>";
	
      }
  },
  error: function(error) {
    alert("Se econtraron con error");
  }
});