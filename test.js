
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
	var oDataUrl = _spPageContextInfo.siteAbsoluteUrl;   + "/_api/web/getuserbyid("+ID+")";

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


function addToEWOList(EwoListDeferred) {
	var clientContext = new SP.ClientContext.get_current();	
	var oList = clientContext.get_web().get_lists().getByTitle('EWOList');

	var itemCreateInfo = new SP.ListItemCreationInformation();
	this.oListItem = oList.addItem(itemCreateInfo);
		oListItem.set_item('EWONo', compilane.EWONo);
		oListItem.set_item('Title', compilane.Title);
		oListItem.set_item('Initiator', compilane.DRE);
	oListItem.update();

	clientContext.executeQueryAsync(
		Function.createDelegate(this, function(){
			return EwoListDeferred.resolve();
		}),
		Function.createDelegate(this, function(sender, args){
			console.log('addToEWOList failed: ' + args.get_message() + '\n' + args.get_stackTrace());
			return EwoListDeferred.reject();
		})
	);
}

function main(){
	var DeferredList = {'EwoListDeferred': new $.Deferred()};

	addToEWOList(DeferredList.EwoListDeferred);

	$.when(DeferredList.EwoListDeferred).done(function(){
		console.log('ok');
	}).fail(function(){
		console.log('nok');
	})

}

main();


function getUserId(loginName) {
  var getIdDeferred = new $.Deferred();

    var context = new SP.ClientContext.get_current();
    this.user = context.get_web().ensureUser(loginName);
    context.load(this.user);

    context.executeQueryAsync(
         Function.createDelegate(null, function(){
          Deferred.resolve(this.user.get_id());
         }), 
         Function.createDelegate(null, function(sender, args){
          return null;
          alert('Query failed. Error: ' + args.get_message());
         })
    );
}

var id = $.when(getUserId(SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickerDRE'+"_TopSpan"].GetAllUserKeys())).done(function(ID){console.log('done' + ID)});

console.log('dupa');
console.log(id);


$.when(getUserId('i:0#.w|eur\\nzby07')).done(function(dupa){
  console.log(dupa)
})




function getUserKey(LoginName){
  var siteUrl = _spPageContextInfo.siteAbsoluteUrl;  
  var oDataUrl = siteUrl+ "/_api/web/siteusers?$select=Id&$filter=LoginName eq '"+LoginName.replace('#', '%23')+"'";
  console.log(oDataUrl);

  return $.ajax({
    url: oDataUrl,
    type: "GET",
    dataType: "json",
    async: false
    }).done( function(data){
      return data.Id;
    }).fail(function(errMessage){
      console.log(errMessage);
      return null;
    });

}

//  var zmienna = $.when(user(SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickerDRE'+"_TopSpan"].GetAllUserKeys())).done(function(returnData){
//    console.log(returnData.value[0].Id)
//    return returnData.value[0].Id;
//  }).fail(function(){
//    return;
//  });

// console.log('dupa');
// console.log(zmienna)


function addItemsToSharePoint(){
  var DeferredList = {'EwoListDeferred': new $.Deferred(), 'VAAListDeferred': new $.Deferred()}
  DisplayModalWorking();
  try{
    compilane.DRE =[];
    compilane.TO =[];
    compilane.CC =[];

    //set main
    compilane.EWONo = $('#numberEWO').val();
    compilane.Title = $('#titleEWO').val();
    compilane.Workbook = $('.workbook').find(':selected').val();
    compilane.MY = $('.modelYear').val();
    compilane.Platform = $('.platform').val();
    compilane.PADNo = $('.numberPAD').val();

    $.each(SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickerDRE'+"_TopSpan"].GetAllUserKeys().split(';'), function(index, login){
      $.when(getUserKey(login)).done(function(returnData){
        compilane.DRE.push(returnData.value[0].Id)
      });
    });

    $.each(SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailReceivers'+"_TopSpan"].GetAllUserKeys().split(';'), function(index, login){
      $.when(getUserKey(login)).done(function(returnData){
        compilane.TO.push(returnData.value[0].Id)
      });
    });

    $.each($.merge(SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailMailCopy'+"_TopSpan"].GetAllUserKeys().split(';'), SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailPlatformCoordinators'+"_TopSpan"].GetAllUserKeys().split(';')), function(index, login){
      $.when(getUserKey(login)).done(function(returnData){
        compilane.CC.push(returnData.value[0].Id)
      });
    }); 
      //set additional
      compilane.ReasonCode = ($('.RC option:selected').val() == '') ? null: $('.RC option:selected').val();
      compilane.AttachmentLink = ($('.attachments').val() == '') ? 'No Attachments available': $('.attachments').val();
      //VAA
      if($('.VAA-info').is(':visible')){
        compilane.SubType = 'Static/Controller Torque';
        $('.VAA-info input:checked').each(function(index,element){return element.value;});
        addToVAAList(DeferredList.VAAListDeferred);
      }
      else{
        DeferredList.VAAListDeferred.resolve();
      }

    addToEWOList(DeferredList.EwoListDeferred);
// add to EWO Cost, Approval List and Administrator List

    $.when(DeferredList.EwoListDeferred, DeferredList.VAAListDeferred).done(function(){
      DisplayModalDone();
    }).fail(function(){
      DisplayModalFail("I can't update item", false);
    });
  }
  catch(error){
    DisplayModalFail(error, true);
  }
}