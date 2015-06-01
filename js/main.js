//save Profile info
var currentUser;
//Initialize Parse SDK to make calls to DB
Parse.initialize("mOtvpjGrdBIUBBpujn6llVOMch917NWmvZG4phYE", "ZUMGy8u0ko4oqPhWH2CwL5GqXs6kRjSjaiKTtRIT");

// If the user is logging in for the first time i.e signing up , their data is retireved from facebook and saved to the db. 
//This function handles saving of the data to the DB

function saveUserInfo(response) {
    console.log(response);
    currentUser = Parse.User.current();
    currentUser.set("name", response.name);
    currentUser.set("FBid", response.id);
    currentUser.set("email", response.email);
    currentUser.set("profilePic", response.profilePic.data.url);
    window.localStorage.setItem("uFriends", JSON.stringify(response.friends.data));
    currentUser.save(null, {
        success: function(currentUser) {
            console.log("saved user info successfully ");
            location.pathname = 'CP3003_Dinner_Party/html/completeProfile.html';
        },
        error: function(currentUser, error) {

            alert("Failed to save User Information.   " + error.message);
        }

    });

}

function getStuff() {
}

var grocSel;
var menuSel;

function saveMenu(menuID) {
    menuSel = menuID;
}

function saveSelection(grocID) {
    grocSel = grocID;
}


// Called when user commits to bringing certain grocery for an event. We add the current user to the user column in the groceryList table and then save. 

function commitGroc() {
    var groceryId = grocSel;
    grocSel = null;
    var groc = Parse.Object.extend("groceryList");
    var query = new Parse.Query(groc);
    query.equalTo("objectId", groceryId);

    query.first({
        success: function(grocObj) {

            grocObj.set('user', Parse.User.current());
            grocObj.save(null, {
                success: function(saveSuccess) {
                    alert("Success: Host has been notified");
                    $("#" + groceryId).hide();

                },
                error: function(dinnerEvent, error) {
                    alert(error.message);
                }
            });

        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

}



//USed to retrieve and generate statistics based on invited guests, food preferences, restrictions

function loadFoodPref(invited) {

    var allPrefs = [];
    var allRes = [];
    var query = new Parse.Query(Parse.User);
    query.containedIn("FBid", invited);
    query.find({
        success: function(guestPrefs) {
            for (var i = 0; i < guestPrefs.length; i++) {
                if (guestPrefs[i].attributes.favCuisine) {
                    for (var j = 0; j < guestPrefs[i].attributes.favCuisine.length; j++) {
                        allPrefs.push(guestPrefs[i].attributes.favCuisine[j]);
                    }
                }


                if (guestPrefs[i].attributes.foodRestriction) {
                    for (var j = 0; j < guestPrefs[i].attributes.foodRestriction.length; j++) {
                        allRes.push(guestPrefs[i].attributes.foodRestriction[j]);
                    }
                }
            }

            calculateFoodData(allPrefs, allRes, invited.length);

        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });


}


function findOccurences(arr) {

    var a = [],
        b = [],
        prev;

    arr.sort();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== prev) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length - 1]++;
        }
        prev = arr[i];
    }

    return [a, b];

}


// Caclulates stats based on loadFoodPeefs() output

function calculateFoodData(preferences, restrictions, guestCount) {
    prefPercentage = [];
    var occurences = findOccurences(preferences);
    var uniqueRestrictions = restrictions.getUnique();
    for (var i = 0; i < occurences[0].length; i++) {
        var prefObj = {};
        prefObj.name = occurences[0][i];
        prefObj.pc = (occurences[1][i] / guestCount) * 100;
        prefPercentage.push(prefObj);
    }

    for (var i = 0; i < prefPercentage.length; i++) {
        $('#prefacc').append("<li>" + prefPercentage[i].name + " ------>  " + prefPercentage[i].pc + " %</li>");
    }

    for (var j = 0; j < uniqueRestrictions.length; j++) {
        $('#foodresacc').append("<li> " + uniqueRestrictions[j] + "</li>");
    }
}


// helper func
Array.prototype.getUnique = function() {
    var u = {},
        a = [];
    for (var i = 0, l = this.length; i < l; ++i) {
        if (u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}



// Retrieves Friend name from local storage
function getFriendName(friendID) {

    var friendString = window.localStorage.getItem('uFriends');
    var friendList = JSON.parse(friendString);
    for (var i = 0; i < friendList.length; i++) {
        if (friendList[i].id == friendID) {
            return friendList[i].name;
        }
    }
}



//Called when user wants to view an event.
// Retrieves event with objectId that is passed. 
// Displays event info on page. 

function retrieveEvent(objectId) {
    var dinnerEvent = Parse.Object.extend("dinnerEvents");
    var query = new Parse.Query(dinnerEvent);

    query.equalTo("objectId", objectId);
    query.include("host");
    query.first({
        success: function(results) {
            var eMEnu = results.get("menu");
            var hos = results.get('host');
            hosName = hos.get('name');
            var u1 = Parse.User.current();
            if (u1.get('name') == hosName) {

                $('#attList').removeClass('hide');
                var att = results.get('attending');
                if (att) {
                    for (var i = 0; i < att.length; i++) {
                        $("#friendRSVP").append("<a href='#'  id='" + att[i] + "' class='list-group-item'> <img  src='https://graph.facebook.com/" + att[i] + "/picture' />" + getFriendName(att[i]) + "</a>");
                    }
                    $('#attTab').append("(" + att.length + ")");
                } else {
                    $('#attTab').append(" (0)");
                }

                var inv1 = results.get('invited');
                if (!inv1) {
                    inv1 = [];
                }
                for (var i = 0; i < inv1.length; i++) {
                    $("#invitedGList").append("<a href='#'  id='" + inv1[i] + "' class='list-group-item'> <img  src='https://graph.facebook.com/" + inv1[i] + "/picture' />" + getFriendName(inv1[i]) + "</a>");
                }
                $('#invTab').append("(" + inv1.length + ")");

                $('#groLabel').html("Pending Grocery");

            }
            var groc = Parse.Object.extend("groceryList");

            var query = new Parse.Query(groc);
            query.equalTo("event", results);
            query.find({
                success: function(results2) {
                    
                    for (var j = 0; j < results2.length; j++) {
                        if (!results2[j].get("user")) {
                            $("#eventPageGrocery").append("<a href='#' class='list-group-item' onClick='saveSelection(this.id);' id= '" + results2[j].id + "'> " + results2[j].get("groceryName") + "</a>");
                        }


                    }



                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
            var host = results.get("host");
            document.getElementById("hostName").innerHTML = host.get("name");
            if (u1.get("name") == hosName) {
                $('#hostName').append("(me)");
            }
            document.getElementById("eventPic").src = host.get("profilePic");
            document.getElementById("eventName").innerHTML = results.get("name");
            document.getElementById("eventDesc").innerHTML = results.get("description");
            document.getElementById("eventAdd").innerHTML = results.get("address");
            var evDateTime = new Date(results.get("eventDate"));
            document.getElementById("time").innerHTML = evDateTime.getHours() + ":" + (evDateTime.getMinutes() < 10 ? '0' : '') + evDateTime.getMinutes() + " hrs" + " on " + evDateTime.toDateString();
            var menuL = results.get("menu");
            for (i = 0; i < menuL.length; i++) {
                $("#eventPageMenu").append("<a href='#' class='list-group-item'>" + menuL[i] + "</a>");
            }

        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

}


// Generate Friend List

function loadFriends() {
    invitedArr = [];
    var userFriendListString = window.localStorage.getItem("uFriends");
    var userFriendList = JSON.parse(userFriendListString);
    for (var i = 0; i < userFriendList.length; i++) {
        $("#evFriendList").append("<a href='#' onClick='addFriend(this.id);' id='" + userFriendList[i].id + "' class='list-group-item'> <img  src='https://graph.facebook.com/" + userFriendList[i].id + "/picture' /><span class='listItemMargin'> " + userFriendList[i].name + "</span></a>");
    }
    //$('#searchlist').append("<script type='application/javascript'> $('#evFriendList').btsListFilter('#searchinput', {delay:500,itemChild: 'span'});</script>");
    //  $('#evFriendList').btsListFilter('#searchinput', {delay:900,itemChild: 'span'});
}
//$('#evFriendList').btsListFilter('#searchinput', {itemChild: 'span'});
function saveProfile() {

    currentUser = Parse.User.current();
    var favtxt = $('#cuisineTxt').value();
    var favArr = [];
    favArr = favtxt.split(',');
    var resText = $('#resTxt').value();
    var resArr = [];
    resArr = resText.split(',');
    currentUser.set("favCuisine", favArr);
    currentUser.set("foodRestriction", resArr);
    currentUser.save(null, {
        success: function(currentUser) {
            // Now let's update it with some new data. In this case, only cheatMode and score
            // will get sent to the cloud. playerName hasn't changed.
            alert("saved successfully")
                // location.pathname = 'html/profile.html';
            location.pathname = 'CP3003_Dinner_Party/html/home.html';
        },
        error: function(currentUser, error) {
            alert("Failed to save food preferences   . " + error.message);
        }
    });
}
var currentDate = new Date();


function retrieveProfile(FBid) {
    var FBID
    if (!Fbid) {
        user = Parse.User.current();
    } else {
        //get object from parse 
    }
}

// Retrieves and displays Current User's Profile 

function loadProfile() {
    user1 = Parse.User.current();
    profilePic = user1.get("profilePic");

    document.getElementById("profilepic").src = profilePic;
    name = user1.get("name");
    document.getElementById("profileName").innerHTML = name;

   
    for (var i = 0; i < user1.get('foodRestriction').length; i++) {
        $('#foodRestrictions').append("<li>" + user1.attributes.foodRestriction[i] + "</li>")
    }
    for (var i = 0; i < user1.get('favCuisine').length; i++) {
        $('#favCuisine').append("<li>" + user1.attributes.favCuisine[i] + "</li>")
    }
    loadFriends();
}


//Get Recpe of selecteed menu item
function getRecipe() {

    getRecipeJson(menuSel);

}


function getRecipeJson(keyword) {
    var apiKey = "dvx5J6b03p7tRzESS2Fd9ZepAwZ8l8fG";
    var titleKeyword = keyword;
    var url = "http://api.bigoven.com/recipes?pg=1&rpp=25&title_kw=" + titleKeyword + "&api_key=" + apiKey;
    $.ajax({
        type: "GET",
        dataType: 'json',
        cache: false,
        url: url,
        success: function(data) {
            console.log(data);
            if(!data.Results[0]) {
                alert("no recipe found");
                
            }
            var urls = data.Results[0].WebURL;
            var w = window.open();
            w.location = urls;
        }
    });
}


var menuArr = [];
var groceryArr = [];
var invitedArr = [];


// Add User input dish to menu list 
function addDish() {
    var menuItem = document.getElementById("menuText").value;
    menuArr.push(menuItem);
    $("#menuLists").append("<a href='#' class='list-group-item' id='" + menuItem + "' onClick ='saveMenu(this.id)'>" + menuItem + "</a>");
    document.getElementById("menuText").value = '';
}

// Add User input grocery item  to grocery list 
function addGrocery() {
    var groceryItem = document.getElementById("groceryText").value;
    groceryArr.push(groceryItem);
    $("#groceryLists").append("<a href='#' class='list-group-item'>" + groceryItem + "</a>");
    document.getElementById("groceryText").value = '';
}

//Add friend to invite list 
function addFriend(id) {
    invitedArr.push(id);
    var ufriends = JSON.parse(window.localStorage.getItem("uFriends"));
    for (var i = 0; i < ufriends.length; i++) {
        if (ufriends[i].id == id) {
            $('#friendTags').addTag(ufriends[i].name);
        }
    }
}


// Returns Date, Day and month in words for date obj that is passed. Used to populate calender icons on Dashboard.
function getDateInfo(dateStr) {
    
    var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    dateObj = new Date(dateStr);
    var dateInfo = {};
    dateInfo.eMonth = months[dateObj.getMonth()];
    dateInfo.eDay = days[dateObj.getDay()];
    dateInfo.eDate = dateObj.getDate();
    // alert(JSON.stringify(dateInfo));
    return dateInfo;
}


// Generates & Displays Dashboard UI

function setDashboard(dashboard) {

    for (var i = 0; i < dashboard.upcomingEvents.length; i++) {
        var hostinfo = dashboard.upcomingEvents[i].get("host");
        console.log(dashboard.upcomingEvents[i].attributes);
        var dateIconInfo = getDateInfo(dashboard.upcomingEvents[i].attributes.eventDate);
        $("#upcomingList").append("<a href='#' class='list-group-item'><time class='icon pull-left'><em>" + dateIconInfo.eDay + "</em><strong>" + dateIconInfo.eMonth + "</strong><span>" + dateIconInfo.eDate + "</span></time><h4  id='" + dashboard.upcomingEvents[i].id + "'  onClick = 'viewEvent(this.id,false);'>" + dashboard.upcomingEvents[i].attributes.name + " </h4></a>");
    }


    for (var i = 0; i < dashboard.hostList.length; i++) {
        var dateIconInfo = getDateInfo(dashboard.hostList[i].attributes.eventDate);
       
        $("#hostList").append("<a href='#' class='list-group-item'><time class='icon pull-left'><em>" + dateIconInfo.eDay + "</em><strong>" + dateIconInfo.eMonth + "</strong><span>" + dateIconInfo.eDate + "</span></time><h4  id='" + dashboard.hostList[i].id + "'  onClick = 'viewEvent(this.id,false);'>" + dashboard.hostList[i].attributes.name + "</h4></a>");
    }



    for (var i = 0; i < dashboard.recentEvents.length; i++) {

        var dateIconInfo = getDateInfo(dashboard.recentEvents[i].attributes.eventDate);
        $("#recentList").append("<a href='#' class='list-group-item'><time class='icon pull-left'><em>" + dateIconInfo.eDay + "</em><strong>" + dateIconInfo.eMonth + "</strong><span>" + dateIconInfo.eDate + "</span></time><h4  id='" + dashboard.recentEvents[i].id + "'  onClick = 'viewEvent(this.id,fasle);'>" + dashboard.recentEvents[i].attributes.name + "</h4></a>");
    }

    for (var i = 0; i < dashboard.invitedList.length; i++) {

        var dateIconInfo = getDateInfo(dashboard.invitedList[i].attributes.eventDate);
        $("#invitedlist").append("<a href='#' class='list-group-item'><time class='icon pull-left'><em>" + dateIconInfo.eDay + "</em><strong>" + dateIconInfo.eMonth + "</strong><span>" + dateIconInfo.eDate + "</span></time><h4  id='" + dashboard.invitedList[i].id + "'  onClick = 'viewEvent(this.id,true);'>" + dashboard.invitedList[i].attributes.name + "</h4></a>");

    }
    // alert(dashboard.reminders.length);
    for (var i = 0; i < dashboard.reminders.length; i++) {
        console.log("yes " + dashboard.reminders[i]);
        var dateIconInfo = getDateInfo(dashboard.reminders[i].attributes.event.attributes.eventDate);
        $("#reminderList").append("<a href='#' class='list-group-item'><time class='icon pull-left'><em>" + dateIconInfo.eDay + "</em><strong>" + dateIconInfo.eMonth + "</strong><span>" + dateIconInfo.eDate + "</span></time><h4  id='" + dashboard.reminders[i].attributes.event.id + "'  onClick = 'viewEvent(this.id,true);'>" + dashboard.reminders[i].attributes.groceryName + "<span class ='groceryEvent'>  <br>(" + dashboard.reminders[i].attributes.event.attributes.name + ")</span></h4></a>");

    }
}

$('#tPanel').click(function(e) {
    alert("click");
    e.preventDefault()
    $(this).tab('show');
})



function viewEvent(eID, invited) {
    eventLoad = {};
    eventLoad.invited = invited;
    eventLoad.eID = eID;
    window.localStorage.setItem("viewEvent", JSON.stringify(eventLoad));
    location.pathname = 'CP3003_Dinner_Party/html/viewEvent.html';

}



function rsvpNow() {
    var x = window.localStorage.getItem("viewEvent")
    var y = JSON.parse(x);

    var dinnerEvent = Parse.Object.extend("dinnerEvents");
    var query = new Parse.Query(dinnerEvent);
    query.equalTo("objectId", y.eID);
    query.first({
        success: function(results) {
            rsvpButton("Going", results);

        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });



}

//Handles event where user 'Joins'/ 'Declines Event Invitation'
function rsvpButton(rsvp, eventObj) {
    var cUser = Parse.User.current();
    var idArr = [];
    if (rsvp == "Going") {
        idArr.push(cUser.get("FBid"));
        eventObj.set("attending", idArr);
        var index = eventObj.attributes.invited.indexOf(idArr[0]);
        if (index > -1) {
            eventObj.attributes.invited.splice(index, 1);
            //current FB ID Delete }
        }

        eventObj.save();
        $('#bGroup').hide();

        //current user fb id - add to going
    } else {
        var index = eventObj.attributes.invited.indexOf(idArr);
        if (index > -1) {
            eventObj.attributes.invited.splice(index, 1);
            eventObj.save();
            location.pathname = 'CP3003_Dinner_Party/html/home.html'
                //current FB ID Delete }
        }

    }
}


//Retrieves all associated events for current user and sorts them by upcoming, recent, grocery reminders & invites

function retrieveDashboard() {
    var upcomingEvents = [];
    var recentEvents = [];
    var groceryList = [];
    var invitedList = [];
    var reminders = [];
    var hostList = [];
    var dashObj = {};
    var currentDate = new Date();
    var query = new Parse.Query(Parse.User);
    var myUser = Parse.User.current();
    query.equalTo("FBid", myUser.get("FBid"));
    query.first({
        success: function(comments) {
            relation = comments.relation("myEvents");

            relation.query().find({
                success: function(userEvents) {
                    for (i = 0; i < userEvents.length; i++) {

                        var eDate = new Date(userEvents[i].attributes.eventDate);
                        
                        if (eDate > currentDate) {

                            if (userEvents[i].attributes.invited.indexOf(myUser.get("FBid")) > -1) {
                                invitedList.push(userEvents[i]);
                            }
                            if (userEvents[i].attributes.attending) {
                                if (userEvents[i].attributes.attending.indexOf(myUser.get("FBid")) > -1) {
                                    upcomingEvents.push(userEvents[i]);
                                    //alert(userEvents[i].id);
                                    var GroceryList = Parse.Object.extend("groceryList");
                                    var query1 = new Parse.Query(GroceryList);

                                    query1.include("event");
                                    query1.include("user");
                                    query1.equalTo("event", userEvents[i]);
                                    query1.equalTo("user", Parse.User.current());
                                    query1.find({
                                        success: function(grocery) {

                                            for (i = 0; i < grocery.length; i++) {
                                                //alert("pushing");
                                                reminders.push(grocery[i]);
                                            }

                                        },
                                        error: function(error) {
                                            alert(JSON.stringify(error));
                                        }
                                    });

                                }
                            }
                            if (userEvents[i].attributes.host.id == myUser.id) {

                                hostList.push(userEvents[i]);
                            }

                        } else if (userEvents[i].attributes.attending != undefined && userEvents[i].attributes.attending.indexOf(myUser.get("FBid")) > -1) {
                            
                            recentEvents.push(userEvents[i]);
                        }

                    }

                    setTimeout(function() {
                        dashObj.recentEvents = recentEvents;
                        dashObj.invitedList = invitedList;
                        dashObj.upcomingEvents = upcomingEvents;
                        dashObj.reminders = reminders;
                        dashObj.hostList = hostList;
                        //  alert(JSON.stringify(dashObj.reminders));
                        setDashboard(dashObj);

                    }, 2000)

                }
            });


        },
        error: function(error) {
            alert(error.message);
        }
    });


}




//Caches new event information when user moves on to add food options. 

function createEvent2() {
    formData = {};

    formData.name = document.getElementById("evName").value;
    if (formData.name == '') {
        alert("Please enter a name for your event ");
        return;
    }
    formData.description = document.getElementById("evDesc").value;
    if (formData.description == '') {
        alert("Please enter a description for your event ");
        return;
    }
    formData.address = document.getElementById("evAddr").value;
    if (formData.address == '') {
        alert("Please enter an address for your event ");
        return;
    }
    formData.date = new Date(document.getElementById("evDT").value);
    if (document.getElementById("evDT").value == '') {
        alert("Please enter a date/time for your event ");
        return;
    }

    formData.invited = invitedArr;
    if (formData.invited.length == 0) {
        alert("Please invite some friends ");
        return;
    }
    var fData = JSON.stringify(formData);
    // var fData = formData;
    window.localStorage.setItem("eventObj", fData);
    location.pathname = 'CP3003_Dinner_Party/html/createEvent2.html';
    //formData.inviteList = friendList;    
}

function wip() {
    alert("Creating an event without food options is not supported in this release. Kindly press the  'Add Food Options' button to continue");
}


//Retireves cached event info and adds new fields obtained from the food options page
function createEvent() {
    var temp = window.localStorage.getItem("eventObj");
    var temp1 = JSON.parse(temp);


    eventObj3 = temp1;
    var xyz = eventObj3.date;
    eventObj3.date = new Date(xyz);
    eventObj3.menu = menuArr;
    eventObj3.groceryArr = groceryArr;
    //  eventObj3.invited.push("10155401563870276");
    saveEvent(eventObj3);


}

//saves event + groceries  to DB

function saveEvent(eventObj) {


    var dinnerEvents = Parse.Object.extend("dinnerEvents");
    var dinnerEvent = new dinnerEvents();



    dinnerEvent.set("name", eventObj.name);
    dinnerEvent.set("eventDate", eventObj.date);
    dinnerEvent.set("menu", eventObj.menu);
    dinnerEvent.set("invited", eventObj.invited);
    dinnerEvent.set("description", eventObj.description);
    dinnerEvent.set("address", eventObj.address);
    dinnerEvent.set("host", Parse.User.current());


    dinnerEvent.save(null, {
        success: function(dinnerEvent) {
            
            for (var i = 0; i < eventObj.groceryArr.length; i++) {
                var Grocery = Parse.Object.extend("groceryList");
                var groceryList = new Grocery();
                groceryList.set("groceryName", eventObj.groceryArr[i]);
                groceryList.set("event", dinnerEvent);
                groceryList.save(null, {
                    success: function(grocerySuc) {
                        console.log("saved groc info successfully ");
                        console.log(grocerySuc.id);

                        if (i == (eventObj.groceryArr.length - 1)) {
                            location.pathname = 'CP3003_Dinner_Party/html/home.html';
                        }

                    },
                    error: function(currentUser, error) {

                        alert("Failed to save User Groceries   " + JSON.stringify(error));
                    }

                })
            }

            setTimeout(function() {
                alert("Event Saved")
                location.pathname = 'CP3003_Dinner_Party/html/home.html';
            }, 2000);;
        },
        error: function(dinnerEvent, error) {
            alert(error.message);
        }
    });

}


//Handles Log out
    function logOut () {
        Parse.User.logOut();
        location.pathname ='CP3003_Dinner_Party/index.html';
    }