var MailsReceivers= {'TO': [], 'CC': [], 'VAA': []};

function displaySummaryMails(){
	checkIfVAANeedsToBeSend();

	console.log(couter);

	$.map($('.clone .planner'), function(n){
		//add mail to summary
		//GetUserNameToSetPeoplePicker('123@opel.com')
		compilane.Planner.push(SetPeopleField(n.id));
	});
	$.map($('.clone .processor'), function(n){
		compilane.Processor.push(SetPeopleField(n.id));
	});
	$.map($('.clone .GL'), function(n){
		compilane.GL.push(SetPeopleField(n.id));
	});

	if (counter !== 0){
		for (var index in counter){
			//inex 0,1,2,3,5 ->klasa
			$.map($('.planner .'+index), function(n){
				console.log(n);
			});
		}
	}

/*

	var PeoplePickerSummary = {'Processors': [], 'Planners': [], 'GL': []};
	PeoplePickerSummary['TO'] = ('peoplePickerDRE_TopSpan');

	$.map($('.planner'), function(n){PeoplePickerSummary['Planners'].push(n.id);});
	$.map($('.processor'), function(n){PeoplePickerSummary['Processors'].push(n.id);});
	$.map($('.GL'), function(n){PeoplePickerSummary['GL'].push(n.id);});
	//PlatformCoordinators ?

	$.each(PeoplePickerSummary['Planners'], function(val, peoplePickerElement){
		appendSummaryMails(SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerElement], 'TO');
	});

	$.each(PeoplePickerSummary['Processors'], function(val, peoplePickerElement){
		appendSummaryMails(SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerElement], 'CC');
	});

	$.each(PeoplePickerSummary['GL'], function(val, peoplePickerElement){
		appendSummaryMails(SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerElement], 'CC');
	});*/
}

function appendSummaryMails(peoplePickerElementId_ToSpan, appendTo) {
	var users = peoplePickerElementId_ToSpan.GetAllUserInfo();
	$.each(users, function(index, element){
		 $.when(GetUserIdFromUserName(element.Key)).done(function(data){
			$.map(data, function(n){
				switch(appendTo){
					case "TO":
						MailsReceivers['TO'].push(SP.FieldUserValue.fromUser(n.Email));
						SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailReceivers'+"_TopSpan"].AddUserKeys(n.Email);
						break;
					case "CC":
						MailsReceivers['TO'].push(SP.FieldUserValue.fromUser(n.Email));
						SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailMailCopy'+"_TopSpan"].AddUserKeys(n.Email);
						break;
					case "DRE":
						MailsReceivers['CC'].push(SP.FieldUserValue.fromUser(n.Email));
						SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailMailCopy'+"_TopSpan"].AddUserKeys(n.Email);
						break;
				}
			});
		});
	});
}

function checkIfVAANeedsToBeSend(){
	compilane.VAACoordinators = [];
	if($("#infoVAA").is(":checked")){
		var mails = [];
		$('#peoplePickermailVAACoordinators').parent().removeAttr('hidden');

		if($(".frontAxle").is(":checked")) mails.push("sebastian.maier@opel.com");
		if($(".rearAxle").is(":checked")) mails.push("franz.sabo@opel.com");
		if($(".plantVAA").is(":checked")) mails.push("jacek.pedrycz@opel.com");

		for (var index in mails){
			SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailVAACoordinators'+"_TopSpan"].AddUserKeys(mails[index]);
			compilane.VAACoordinators.push(SP.FieldUserValue.fromUser(mails[index]));	
		}
	}
}

function SetPeopleField(peoplePickerElementId) {
	var DefferSetPeopleFiled = new $.Deferred();

	var peoplePickerElementId = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerElementId];
	var users = peoplePickerElementId.GetAllUserInfo();
	var userMail = [];
	var ReturnValue = null;
	
	$.each(users, function(index, element){
		 $.when(GetUserNameToSetPeopleField(element.Key, DefferSetPeopleFiled)).done(function(data){
			$.map(data, function(n){
				userMail.push(SP.FieldUserValue.fromUser(n.Email));
				if (userMail.length == users.length) DefferSetPeopleFiled.resolve(userMail);
			});
		});
	});

	DefferSetPeopleFiled.done(function(userMail){
		ReturnValue = userMail;
	}).fail(function(){
		DisplayModalFail('User not find', false);
	});
	return ReturnValue;
}

function GetUserNameToSetPeopleField(userName, DefferSetPeopleFiled) {
		var siteUrl = _spPageContextInfo.siteAbsoluteUrl;
		var accountName = userName;
		return $.ajax({
					url: siteUrl + "/_api/web/siteusers(@v)?@v='" + 
						encodeURIComponent(accountName) + "'",
					method: "GET",
					async: false,
					headers: { "Accept": "application/json; odata=verbose" },
					success: function (data) {
						return data.d.Emai;
					},
					error: function (data) {
						console.log(JSON.stringify(data));
						return DefferSetPeopleFiled.reject();
					}
				});
}

function GetUserNameToSetPeoplePicker(userName) {
		var siteUrl = _spPageContextInfo.siteAbsoluteUrl;
		var accountName = userName;
		return $.ajax({
					url: siteUrl + "/_api/web/siteusers(@v)?@v='" + 
						encodeURIComponent(accountName) + "'",
					method: "GET",
					async: false,
					headers: { "Accept": "application/json; odata=verbose" },
					success: function (data) {
						return data.d.Emai;
					},
					error: function (data) {
						console.log(JSON.stringify(data));
						return null;
					}
				});
}

function CheckPeopleField(peoplePicker_TopSpan_HiddenInput){
		var nameDRE = $.parseJSON($(peoplePicker_TopSpan_HiddenInput).val());

		if (!(nameDRE.length == 0 || nameDRE == null)){
			if(nameDRE[0].hasOwnProperty('Description')) return true;
			else return false;
		}
		else return false;
}

function determinePlatformCoordinators(workbook){
	var mails=[];
	switch(workbook){
		case "Z": 
				mails=["francesco.cau@opel.com","guenter.andreas.schieb@opel.com"," frank.sauer@opel.com"];
				 break;
		case "P3/P7":
				mails=["guido.wagner@opel.com","angela.dudek@opel.com","cristina.gonzalez.alcala@opel.com","bernd.langer@opel.com"];
				 break;
		case "J": 
				mails=["guido.wagner@opel.com","cristina.gonzalez.alcala@opel.com"];
				break;
		/*case "0M":
		case "0X":*/
		case "0S":
				mails=["cristina.gonzalez.alcala@opel.com","bernd.langer@opel.com","guido.wagner@opel.com"];
				 break;
		case "B": 
				mails=["olaf.recha@opel.com", "marcus.sattler-schneider@opel.com","willi.blohm@opel.com","przemyslaw.wloka@opel.com","rui.canteiro@opel.com"];
				break;
		case "P(all plants)":
				mails=["olaf.recha@opel.com","willi.blohm@opel.com","przemyslaw.wloka@opel.com","rui.canteiro@opel.com"];
				break;
		case "0W":
				mails=["dieter.regner@opel.com","jacek.pedrycz@opel.com","przemyslaw.wloka@opel.com","zofia.guzy@opel.com"];
				break;
		}

		for (var index in mails){
			SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailPlatformCoordinators'+"_TopSpan"].AddUserKeys(mails[index]);
			compilane.CC.push(SP.FieldUserValue.fromUser(mails[index]));	
		}
}