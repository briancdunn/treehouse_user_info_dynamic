var Profile = require("./profile.js");
var renderer = require("./renderer.js");

var commonHeader = {'Content-Type': 'text/html'};

function home(request,response) {
  if(request.url === "/") {
    if(request.method.toLowerCase() === "get") {
      response.writeHead(200, commonHeader);
      renderer.view("header",{},response);
      renderer.view("search",{},response);
      renderer.view("footer",{},response);
      response.end();  }
  } else {
    request.on("data", function(postBody) {
      var query = querystring.parse(postBody.toString());
      response.write(query.username);
      response.end();
    });
  }
}

function user(request,response) {
  var username = request.url.replace("/","");
  if(username.length > 0) {
    response.writeHead(200, commonHeader);
    renderer.view("header",{},response);
    

    var studentProfile = new Profile(username);
    studentProfile.on("end", function(profileJSON) {
      var values = {
        avatarUrl: profileJSON.gravatar_url,
        username: profileJSON.profile_name,
        badges: profileJSON.badges.length,
        javascriptPoints: profileJSON.points.JavaScript
      };

//      response.write(values.username + " has " + values.badges + " badges.\n");
      renderer.view("profile",values,response);
      renderer.view("footer",{},response);
      response.end();
      //show profile
    });
    studentProfile.on("error", function(error) {
      //show error
      renderer.view("error",{errorMessage: error.message},response);
      renderer.view("search",{},response);
      renderer.view("footer",{},response);
      response.end();
    });
    
  }
}

module.exports.home = home;
module.exports.user = user;