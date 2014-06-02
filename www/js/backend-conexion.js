
function loadData(){
	Parse.initialize("B0RmWvAnwf8prJLztD9wSGsxAn1o2Lknzl6tqyGg", "Uca15YO3L0TNyNfZYwfC9ENCVm6dIY1U8AkDj0LN");
	var Figura = Parse.Object.extend("mini_figura");
	var query = new Parse.Query(Figura);
	query.find({
	      success: loadEtiquetas,
		  error: function(error) {
		      alert("Se econtraron con error");
		  }
	});
};

function loadEtiquetas(results){
  	var tags=[];
  	for (var indexFig=0; indexFig<results.length; indexFig++){
      	var EtiquetaFigura = Parse.Object.extend("etiqueta_figura");
      	var query = new Parse.Query(EtiquetaFigura);
      	query.equalTo("figura",results[indexFig]);
      	query.include("etiqueta");
      	query.find({
      		success: function(etiquetas_figuras){
      			var etiquetasByFig = "";
      			for (var indexTag=0; indexTag<etiquetas_figuras.length; indexTag++){
	      			etiquetasByFig += " "+etiquetas_figuras[indexTag].get('etiqueta').get('nombre');
      				console.log("Etiqueta_Tag:"+etiquetas_figuras[indexTag].get('etiqueta').get('nombre'));
	      		};
	      		tags.push(etiquetasByFig);
  				if (indexFig == results.length){
  					console.log("tags "+JSON.stringify(tags));
  					renderResults(results,tags);	      					
  				}
      		},
      		error: function(error){
      			alert("Error cargando etiquetas");
      		}
      	});
      };
};

function renderTags(tags,index){
	console.log('figura'+index+" "+tags);
	document.getElementById('figura'+index).innerHTML = tags;
}

function renderResults(results,tags){
	  	  document.getElementById('links').innerHTML = "";
	  	  document.getElementById("minifigures").innerHTML = "";
	      for (var i = 0; i < results.length; i++) { 
			var object = results[i];
			var url_src = object.get('foto') ;
			var title = object.get('nombre');
			var serie = object.get('serie');
			var descripcion = object.get('descripcion');
			console.log(object);

			//Para el index
			if (!url_src){
			  document.getElementById("minifigures").innerHTML = document.getElementById("minifigures").innerHTML + 
			  "<div class='row figureItem'>" +
			    "<div class='col-md-4'>" +
			      "<div class='row'>"+title+" <a href='www.google.co.cr'>Ver detalle</a></div>" + 
			      "<div class='row'>"+serie+"</div>" + 
			      "<div class='row'>"+descripcion+"</div>" +
			      "<div class='row' id=figura"+i+" >"+"Etiquetas:"+tags[i]+"</div>" +
			    "</div>" +
			  "</div>";	
		        }else{	
			  //Para el carousel
			  url = url_src.url();
			  document.getElementById('links').innerHTML = document.getElementById('links').innerHTML + 
			  "<a href='"+ url +"' title='"+title+"' data-gallery></a>";
			  document.getElementById("minifigures").innerHTML = document.getElementById("minifigures").innerHTML + 
			    "<div class='row figureItem'>" +
			      "<div class='col-md-4'>"+"<img height='200' width='200' src='"+url+"'>"+"</div>" +
			      "<div class='col-md-4'>" +
				"<div class='row'>"+
					"<div class='col-md-4'>"+
					"<a href='"+url+"' data-gallery>"+title+ "</a>"+
					"</div>"+
				"</div>" + 
				"<div class='row'>"+serie+"</div>" + 
				"<div class='row'>"+descripcion+"</div>" + 
			      "<div class='row' id=figura"+i+" >"+"Etiquetas:"+tags[i]+"</div>" +
			      "</div>" +
			    "</div>";
			};
		      };
		  };

function salvarFigura() {
	var parseImage = new Parse.File("foto.img",{base64:image});
	parseImage.save().then(
		function() {
			var Figura = Parse.Object.extend("mini_figura");
			var figura = new Figura();
			//Figuras
			figura.set("nombre", document.getElementById("inputTitulo").value);
			figura.set("descripcion", document.getElementById("inputDescripcion").value);
			figura.set("serie", document.getElementById("inputSerie").value);
			figura.set("foto", parseImage);
			figura.save(null, {
				success: function(figura) {
					alert('New figura created with objectId: ' + figura.id);	
					//Etiquetas
					var etiquetasString = document.getElementById("inputEtiquetas").value.split(',');
					for (var i = 0; i < etiquetasString.length; i++) { 		 
					  	var Etiqueta = Parse.Object.extend("etiqueta");
					  	var etiqueta = new Etiqueta();	
					  	etiqueta.set("nombre",etiquetasString[i]);	      
						//EtiquetasFiguras
						var etiquetasString = document.getElementById("inputEtiquetas").value.split(',');	 
						var EtiquetaFigura = Parse.Object.extend("etiqueta_figura");
						var etiqueta_figura = new EtiquetaFigura();	
						etiqueta_figura.set("etiqueta",etiqueta);	
						etiqueta_figura.set("figura",figura);
						etiqueta_figura.save(null, {
							success: function(etiqueta_figura) {
							    // Execute any logic that should take place after the object is saved.
							    alert(' New etiqueta_figura created with objectId: ' + etiqueta_figura.id );
							    loadData();
							},
							error: function(etiqueta_figura, error) {
							    // Execute any logic that should take place if the save fails.
							    // error is a Parse.Error with an error code and description.
							    alert('Failed to create new etiqueta, with error code: ' + error.description);
							}
						});
						etiqueta.save(null, {
							success: function(etiqueta) {
						    	// Execute any logic that should take place after the object is saved.
						    	alert('New etiqueta created with objectId: ' + etiqueta.id );
							},
							error: function(etiqueta, error) {
								// Execute any logic that should take place if the save fails.
								// error is a Parse.Error with an error code and description.
								alert('Failed to create new etiqueta, with error code: ' + error.description);
							}
						});	
					};
				},
				error: function(figura, error) {
					alert('Failed to create new figura, with error code: ' + error.description);
				}
			});
		    // The file has been saved to Parse.
		    alert("Imagen Cargada en Parse");
	    }, function(error) {
	        // The file either could not be read, or could not be saved to Parse.
	        alert("Error subiendo imagen: "+error);
	    });
};


function buscarPorEtiqueta(){
	var tags = document.getElementById("inputBusquedaTags").value.split(",");
	var figurasEncontradas = [];
	for (var indextag=0; indextag < tags.length; indextag++){
		//busqueda de las etiquetas
		var Etiqueta = Parse.Object.extend("etiqueta");
		var query = new Parse.Query(Etiqueta);
		console.log("query: " + query+" , etiqueta: |"+tags[indextag]+"|");
		query.equalTo("nombre",tags[indextag]);
		query.find({
			success: function(etiquetas){
				console.log("etiquetas: "+etiquetas+", size: "+etiquetas.length);
				var EtiquetaFigura = Parse.Object.extend("etiqueta_figura");
				var query = new Parse.Query(EtiquetaFigura);
				query.equalTo("etiqueta",etiquetas[0]);
				query.include("figura");
				query.find({
					success: function(etiquetas_figuras){
						console.log("etiquetas_figuras: "+etiquetas_figuras);
						for (var index=0; index<etiquetas_figuras.length; index++){
							var figura =  etiquetas_figuras[index].get('figura');	
							console.log(JSON.stringify(figura));
							figurasEncontradas.push(figura);						
						}
						console.log("figuras: "+figurasEncontradas);
						if (indextag == tags.length){
							loadEtiquetas(figurasEncontradas);
						}
					}, 
					error: function(error){
						console.log("etiqueta_figura "+error);
					}
				});
			},
			error: function(error){
				console.log("etiqueta: "+error);
			}
		});
	};
};