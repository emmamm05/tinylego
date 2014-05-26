

var Parse = {
   this.READ = function() {  
      var Figura = Parse.Object.extend("mini_figura");
      var query = new Parse.Query(Figura);
      query.get("s20Gqz766g", {
	success: function(Figura) {
	  alert("Successfully retrieved " + results.length + " scores.");
	  // Do something with the returned Parse.Object values
	  for (var i = 0; i < results.length; i++) { 
	    var object = results[i];
	    alert(object.id + ' - ' + object.get('playerName'));
	  }
	  
	  self.$(".container.text").html("Holas").show();
	  
	  return Figura.get("nombre");
	},
	error: function(object, error) {
	  alert("Error: " + error.code + " " + error.message);
	  // The object was not retrieved successfully.
	  // error is a Parse.Error with an error code and description.
	}
      });
  }

}
