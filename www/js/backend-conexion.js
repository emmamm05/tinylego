

var Parse = {
  
  var Figura = Parse.Object.extend("mini_figura");
  var query = new Parse.Query(Figura);
  query.get("xWMyZ4YEGZ", {
    success: function(gameScore) {
      // The object was retrieved successfully.
    },
    error: function(object, error) {
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and description.
    }
  });
}
