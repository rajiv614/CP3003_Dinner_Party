//Cloud Code is hosted on our account at parse.com
//Please refer Set-up Guide for credentials etc





Parse.Cloud.afterSave("dinnerEvents", function(request) {

    var relation, query,i;
    var invited = request.object.get("invited");
    invited.push(request.user.get('FBid'));

    for (i=0; i<invited.length; i++) {
        Parse.Cloud.useMasterKey();
        query = new Parse.Query(Parse.User);
        console.log(invited[i]);
        query.equalTo("FBid",invited[i]);
        query.first({
          success: function (parseUser) {
            Parse.Cloud.useMasterKey();
            var userEvents = parseUser.relation("myEvents");
            userEvents.add(request.object);
            parseUser.save(null, {
  success: function(dinnerEvent) {
 console.log("Relationship Save Successful");
  },
    error: function (dinnerEvent, error) {
    console.log(JSON.stringify(error));}
});
        },error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
        });
  }
  
});

