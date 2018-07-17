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

function CheckPlaform(Platform){
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
	$('#peoplePickermailVAACoordinators').parent().parent().removeAttr('hidden');
	var LoginName = [];
		if($(".frontAxle").is(":checked")) LoginName.push("i:0#.w|eur\\czts15");
		if($(".rearAxle").is(":checked")) LoginName.push("i:0#.w|eur\\hzndtp");
		if($(".plantVAA").is(":checked")) LoginName.push("i:0#.w|ad\\fzncjc");
	for (var index in LoginName){
		SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailVAACoordinators'+"_TopSpan"].AddUserKeys(LoginName[index]);
	}
}

function getUserKey(LoginName){
	var returnID = null;
	$.map(JSON.parse(localStorage.getItem('usersData')), function(n){if (n.LoginName.toUpperCase() ==LoginName.toUpperCase()) returnID = n.Id;});
	if (returnID == null){
		var siteUrl = _spPageContextInfo.siteAbsoluteUrl;  
		var oDataUrl = siteUrl+ "/_api/web/siteusers?$select=Id,LoginName&$filter=LoginName eq ('"+LoginName.replace('#', '%23')+"')";
		$.ajax({
			url: oDataUrl,
			type: "GET",
			dataType: "json",
			async: false
		}).done( function(data){
			returnID = data.value[0].Id;
			var updateLocal = JSON.parse(localStorage.getItem('usersData'));
			updateLocal.push(data.value[0]);
			localStorage.setItem('usersData', JSON.stringify(updateLocal));
		}).fail(function(errMessage){
			alert("Can't find users!");
		});
	}
	return returnID;
}

function UserlocalStorage(){
	var siteUrl = _spPageContextInfo.siteAbsoluteUrl;  
	var oDataUrl = siteUrl+ "/_api/web/siteusers?$select=Id,LoginName";
	$.ajax({
		url: oDataUrl,
		type: "GET",
		dataType: "json",
		async: false
	}).done( function(data){
		localStorage.setItem('usersData', JSON.stringify(data.value));
	}).fail(function(errMessage){
		alert("Can't find users!");
	});
}

function findEngineersFromPAD(PADNo, ColumWorkbook){
	var personId = [];
		$.map(JSON.parse(localStorage.getItem('PadPlaners')), function(n){ if (n["PAD_x0020_NO"] == PADNo) personId.push({'PadNo': n["PAD_x0020_NO"], 'Planer': n[ColumWorkbook], 'GL': n["GLId"], 'MPD': n["MPDId"]});});
		if (personId == null || personId.length == 0){
			DisplayModalFail("Please check the number PAD for this workbook - nothing is shown in PAD Planners", false);
			$( "#validationMessage" ).append( "<p clas='errorInfo'>Refer to <a href='https://share.opel.com/sites/MEACEWO/Lists/PADPlanners/All%20Items.aspx' target='_blank'>PAD Planners on SP</a> to check the issue</p>" );
			$("#validationMessage").show();
		}
	return personId;
}

function PadPlanerslocalStorage(){
	var siteUrl = _spPageContextInfo.siteAbsoluteUrl;  
	var oDataUrl = siteUrl + "/_api/web/lists/getbytitle('PAD&Planners')/items?&$top=1000";
	$.ajax({
		url: oDataUrl,
		type: "GET",
		dataType: "json",
		async: false
	}).done( function(data){
		localStorage.setItem('PadPlaners', JSON.stringify(data.value));
	}).fail(function(errMessage){
		alert("Can't find users in PadPlanerslocalStorage!");
	});
}