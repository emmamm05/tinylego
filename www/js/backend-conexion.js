
function loadData(){
	Parse.initialize("B0RmWvAnwf8prJLztD9wSGsxAn1o2Lknzl6tqyGg", "Uca15YO3L0TNyNfZYwfC9ENCVm6dIY1U8AkDj0LN");
	var Figura = Parse.Object.extend("mini_figura");
	var query = new Parse.Query(Figura);	    
	query.find({
	      success: renderResults,
		  error: function(error) {
		    alert("Se econtraron con error");
		  }
	});
};

function renderResults(results){
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
			  "<div class='row'>" +
			    "<div class='col-md-4'>" +
			      "<div class='row'>"+title+"</div>" + 
			      "<div class='row'>"+serie+"</div>" + 
			      "<div class='row'>"+descripcion+"</div>" + 
			    "</div>" +
			  "</div>";	
		        }else{	
			  //Para el carousel
			  url = url_src.url();
			  document.getElementById('links').innerHTML = document.getElementById('links').innerHTML + 
			  "<a href='"+ url +"' title='"+title+"' data-gallery></a>";
			  document.getElementById("minifigures").innerHTML = document.getElementById("minifigures").innerHTML + 
			    "<div class='row'>" +
			      "<div class='col-md-4'>"+"<img src='"+url+"'>"+"</div>" +
			      "<div class='col-md-4'>" +
				"<div class='row'>"+"<a href='"+url+"' data-gallery>"+title+"</a></div>" + 
				"<div class='row'>"+serie+"</div>" + 
				"<div class='row'>"+descripcion+"</div>" + 
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
		console.log("query: " + query+" , etiquetas: "+tags);
		query.equalTo("etiqueta",tags[indextag]);
		query.find({
			success: function(etiquetas){
				console.log("etiquetas: "+etiquetas);
				var EtiquetaFigura = Parse.Object.extend("etiqueta_figura");
				var query = new Parse.Query(EtiquetaFigura);
				query.equalTo("etiqueta",etiquetas[0]);
				query.find({
					success: function(etiquetas_figuras){
						console.log("etiquetas_figuras: "+etiquetas_figuras);
						for (var et_fig_index=0; 
							et_fig_index<etiquetas_figuras.length; et_fig_index++){
							var Figura = Parse.Object.extend("figura");
							var query = new Parse.Query(Figura);
							query.equalTo("figura",etiquetas_figuras[0]);
							query.find({
								success: function(figura){
									figurasEncontradas.push(figura);
								},
								error: function(error){
									console.log("figura "+error);
								}
							});
							
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
		console.log("figuras: "+figurasEncontradas);
		renderResults(figurasEncontradas);
	};
};