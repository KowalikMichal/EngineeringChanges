function GetUserKey(ID){
	var returnUserKey;
	var siteUrl = _spPageContextInfo.siteAbsoluteUrl;  
	var oDataUrl = siteUrl + "/_api/web/getuserbyid("+ID+")";

	return $.ajax({
		url: oDataUrl,
		async: false,
		type: "GET",
		dataType: "json",
		}).done( function(data){
			data.LoginName;
		}).fail(function(errMessage){
			console.log(errMessage);
		});
}

function CheckPeopleField(peoplePicker_TopSpan_HiddenInput){
	try{
		var PeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePicker_TopSpan_HiddenInput];
		if (PeoplePicker.GetAllUserKeys() == "" || PeoplePicker.GetAllUserKeys() == undefined) return false;
		else return true;	
	}
	catch(error){
		return false;
	}
}
function CheckPlaform(Platform) {
	var siteUrl = _spPageContextInfo.siteAbsoluteUrl;  
	var oDataUrl = siteUrl + "/_api/web/lists/getbytitle('PlatformCoordinators')/items?$&expand=PlatformCoordinators&$filter=(Platform eq'"+ Platform +"')";
	
	return $.ajax({
		url: oDataUrl,
		async: false,
		type: "GET",
		dataType: "json",
		}).done( function(data){
			data.value[0].PlatformCoordinatorsId;
			console.log('done');
		}).fail(function(errMessage){
			console.log(errMessage);
		});
}

function peoplePickermailVAACoordinators(){
	var mails = [];
	$('#peoplePickermailVAACoordinators').parent().parent().removeAttr('hidden');
	
	if($(".frontAxle").is(":checked")) mails.push("sebastian.maier@opel.com");
	if($(".rearAxle").is(":checked")) mails.push("franz.sabo@opel.com");
	if($(".plantVAA").is(":checked")) mails.push("jacek.pedrycz@opel.com");

	for (var index in mails){
		SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailVAACoordinators'+"_TopSpan"].AddUserKeys(mails[index]);
	}
}