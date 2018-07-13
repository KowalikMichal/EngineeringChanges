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
	console.log(oDataUrl);
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
	var LoginName = [];
	$('#peoplePickermailVAACoordinators').parent().parent().removeAttr('hidden');
	
	if($(".frontAxle").is(":checked")) LoginName.push("i:0#.w|eur\\czts15");
	if($(".rearAxle").is(":checked")) LoginName.push("i:0#.w|eur\\hzndtp");
	if($(".plantVAA").is(":checked")) LoginName.push("i:0#.w|ad\\fzncjc");

	for (var index in LoginName){
		SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailVAACoordinators'+"_TopSpan"].AddUserKeys(LoginName[index]);
	}
}

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
				console.log('done');
				return data.Id;
			}).fail(function(errMessage){
				console.log('fail');
				return null;
			});

}