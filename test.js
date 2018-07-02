
var tets;
function CheckPlaform(listName, Platform) {
	var siteUrl = _spPageContextInfo.siteAbsoluteUrl;  
	var oDataUrl = siteUrl + "/_api/web/lists/getbytitle('"+listName+"')/items?$&expand=PlatformCoordinators&$filter=(Platform eq'"+ Platform +"')";
	
	$.ajax({
		url: oDataUrl,
		type: "GET",
		dataType: "json",
		}).done( function(data){
			test = data.value[0].PlatformCoordinatorsId;
			$.each(test, function(key, value){
				GetUserKey(value);
			});
		}).fail(function(errMessage){
			console.log(errMessage);
		});
}
GetUserKey('1197');
function GetUserKey(ID){
	var siteUrl = _spPageContextInfo.siteAbsoluteUrl;  
	var oDataUrl = siteUrl + "/_api/web/getuserbyid("+ID+")";

	$.ajax({
		url: oDataUrl,
		type: "GET",
		dataType: "json",
		}).done( function(data){
			console.log(data.LoginName);
			return data.LoginName;
		}).fail(function(errMessage){
			console.log(errMessage);
		});

}

CheckPlaform('PlatformCoordinators', 'Z');  //test



/////////
////////
///////

function createListItem(context,listTitle,itemProperties){
    var web = context.get_web();
    var list = web.get_lists().getByTitle(listTitle);
    var itemCreateInfo = new SP.ListItemCreationInformation();
    var listItem = list.addItem(itemCreateInfo);

    for(var propName in itemProperties) {
       listItem.set_item(propName, itemProperties[propName]) 
    }
    listItem.update();
    return listItem;
}



//Usage
var contactItems = [];
var context = new SP.ClientContext.get_current();
var contactProperties  = {'Title': 'Doe','Initiator': 112};

//1.Prepare multiple list items
for(var i = 0; i < 3; i++) {
   var contactItem = createListItem(context,'EWOList',contactProperties);
   contactItems.push(contactItem);
}   
//2. Submit request to the server to create list items
context.executeQueryAsync(
      function() {
          console.log(contactItems.length + ' contacts have been created');        
      },
      function(sender, args) {
        console.log(args.get_message());
      }
   );


//112


//get user id in group
  var clientContext = SP.ClientContext.get_current();
    var website = clientContext.get_web();
    currentUser = website.ensureUser("EUR\NZBY07");
    clientContext.load(website);
    clientContext.load(currentUser);
    clientContext.executeQueryAsync(onRequestSucceeded, onRequestFailed);

    function onRequestSucceeded() {
       var userid =  currentUser.get_id();
    }

    function onRequestFailed(sender, args) {
        //error handling
        alert('Error: ' + args.get_message());
    }


//get user ID to set peoplefield
function getUserInfo() {

    // Get the people picker object from the page.
    var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickerDRE'+"_TopSpan"];

    // Get information about all users.
    var users = peoplePicker.GetAllUserInfo();
    var userInfo = '';
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        for (var userProperty in user) { 
            userInfo += userProperty + ':  ' + user[userProperty] + '<br>';
        }
    }
    console.log(userInfo);

    // Get user keys.
    var keys = peoplePicker.GetAllUserKeys();
    console.log(keys);

    // Get the first user's ID by using the login name.
    getUserId(users[0].Key);
}

// Get the user ID.
function getUserId(loginName) {
    var context = new SP.ClientContext.get_current();
    this.user = context.get_web().ensureUser(loginName);
    context.load(this.user);
    context.executeQueryAsync(
         Function.createDelegate(null, ensureUserSuccess), 
         Function.createDelegate(null, onFail)
    );
}

function ensureUserSuccess() {
    console.log(this.user.get_id());
}

function onFail(sender, args) {
    alert('Query failed. Error: ' + args.get_message());
}

getUserInfo();