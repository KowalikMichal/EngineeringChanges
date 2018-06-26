var MailsReceivers= {'TO': [], 'CC': [], 'VAA': []};

function displaySummaryMails(){
	checkIfVAANeedsToBeSend();
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
	});
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
				}
			});
		});
	});
}

function checkIfVAANeedsToBeSend(){
	if($("#infoVAA").is(":checked")){
		$('#peoplePickermailVAACoordinators').parent().removeAttr('hidden');
		if($(".frontAxle").is(":checked")) SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailVAACoordinators'+"_TopSpan"].AddUserKeys("sebastian.maier@opel.com");
		if($(".rearAxle").is(":checked")) SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailVAACoordinators'+"_TopSpan"].AddUserKeys("franz.sabo@opel.com");
		if($(".plantVAA").is(":checked")) SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailVAACoordinators'+"_TopSpan"].AddUserKeys("jacek.pedrycz@opel.com");
	}

}

function determinePlatformCoordinators(workbook){
	var mails=[];
	switch(workbook){
		case "Z": 
				mails=["francesco.cau@opel.com","guenter.andreas.schieb@opel.com"," frank.sauer@opel.com"];
				 break;
		case "P3/P7":
				mails=["guido.wagner@opel.com","angela.dudek@opel.com ","cristina.gonzalez.alcala@opel.com","bernd.langer@opel.com"];
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
		/*for(var i=0;i<mails.length;i++){
			platformCoordinators=checkIfIsInside( platformCoordinators,mails[i]);
		}*/
		for (var index in mails){
			SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailPlatformCoordinators'+"_TopSpan"].AddUserKeys(mails[index]);
		}
}