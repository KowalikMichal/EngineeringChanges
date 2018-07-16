var counter = 0;
var compilane= {};

$(function(){
	SP.SOD.executeFunc('sp.js', 'SP.ClientContext',function(){
		var InitializePeoplePicker = {'peoplePickerDRE' : 'generalInfoOfEWO', 'peoplePickerMePlaner' : 'planner', 'peoplePickerMPDProcessor': 'processor', 'peoplePickerMeGL': 'GL', 'peoplePickermailReceivers': 'mailReceivers', 'peoplePickermailMailCopy': 'mailCopy', 'peoplePickermailPlatformCoordinators': 'platformCoordinators', 'peoplePickermailVAACoordinators': 'VAACoordinators'};

		$.when($.each(InitializePeoplePicker, function(key, ClassName){
			if (key == 'peoplePickerDRE') initializePeoplePicker(key, false, ClassName)
			else initializePeoplePicker(key, true, ClassName);
		})).done(function(){
			readyFunction();
		})
	});
});

//// initialize people picker
function initializePeoplePicker(peoplePickerElementId, AllowMultipleValues, customClass) {
	var schema = {};
	schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
	schema['SearchPrincipalSource'] = 15;
	schema['ResolvePrincipalSource'] = 15;
	schema['AllowMultipleValues'] = AllowMultipleValues;
	schema['MaximumEntitySuggestions'] = 50;
	schema['Width'] = '100%';

	this.SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema);
	//delete the same user
	this.SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerElementId + '_TopSpan'].OnUserResolvedClientScript = function (peoplePickerId, selectedUsersInfo) {
		var users = selectedUsersInfo;
		for(var i = 0; i < users.length - 1; i++) if(users[users.length - 1].Key == users[i].Key) this.DeleteProcessedUser();
	};

	$('#'+peoplePickerElementId+'_TopSpan').addClass(customClass);
	$('#'+peoplePickerElementId+'_TopSpan').addClass('form-control');
}

function readyFunction(){
	if (localStorage.getItem('usersData') == null) UserlocalStorage();
	if (localStorage.getItem('PadPlaners') == null) PadPlanerslocalStorage();

	$('input[type="text"]').change(function(){
		this.value = $.trim(this.value);
	});

	$('#numberEWO').focusout(function(){
		checkEWO('EWO%20List', $('#numberEWO').val()); //old list
		checkEWO('EWOList', $('#numberEWO').val());  //new list
	});

	$(".generalInfoOfEWO").change(function(){
		hidePadData();
	});

	$("#checkGeneralData").on('click',function(){ 
		hidePadData();
		validation();	
	});

	$('body').on('click', '.addSection', function(){
		clonePadSection(counter);
		counter++;
	}); 

	$('body').on('click', '#doSummary', function(){
		secondValidation();
	}); 

	$('body').on('click', '.removeSection', function(){
		if ($(this).closest(".section").hasClass('clone')){ 
			//do nothing, prevent remove clone section
		}else if ($('.removeSection').length > 1){
			$(this).parent().fadeOut(300, function(){
				$(this).parent().parent().remove();
				return false;
			})
		}
		return false;
	});

	$(".PAD-analysis" ).on( "change", ".workbook", function() {
		var platformAndMY=checkPlatform(this.value);
		var currentRowPAD=$(this).parents(".row");
		currentRowPAD.find(".platform").val(platformAndMY.platform);
		currentRowPAD.find(".modelYear").val(platformAndMY.MY);
	});

	$('#staticTorque').on('click',function (){
		if ($("#staticTorque").is(":checked")){
			$("#titleEWO").val("NIN - Static Torque Update");
			SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickerDRE'+"_TopSpan"].AddUserKeys("i:0#.w|eur\\rzqwqd");
		}else{
			$("#titleEWO").val("");
			$("#nameDRE").val("");
			SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickerDRE'+"_TopSpan"].DeleteProcessedUser();
		}
	});

	$(".PAD-analysis" ).on("change", ".numberPAD", function() {
		if ($(this).closest('.section').find(':selected').length == 0) return;

		var PeeopleKey = {'Planer': [], 'MPD': [], 'GL': []}; 
		var PeoplePikcerWorkbook = [];
		
		var padPersonId = findEngineersFromPAD(this.value , $(this).closest('.section').find(':selected').attr('data-Workbook'));

		if (padPersonId == null || padPersonId.length == 0) return;

		$(this).closest('.section').find("div[id*='peoplePicker']").map(function(index, element){
			if (element.id.indexOf('_TopSpan') > -1 && element.id.indexOf('AutoFillDiv') == -1) PeoplePikcerWorkbook.push(element.id);
		});

		if (CheckPeopleField(PeoplePikcerWorkbook[0])) SPClientPeoplePicker.SPClientPeoplePickerDict[PeoplePikcerWorkbook[0]].DeleteProcessedUser();
		if (CheckPeopleField(PeoplePikcerWorkbook[1])) SPClientPeoplePicker.SPClientPeoplePickerDict[PeoplePikcerWorkbook[1]].DeleteProcessedUser();
		if (CheckPeopleField(PeoplePikcerWorkbook[2])) SPClientPeoplePicker.SPClientPeoplePickerDict[PeoplePikcerWorkbook[2]].DeleteProcessedUser();

		$.each(padPersonId[0].Planer, function(index, element){$.when(GetUserKey(element)).done(function(data){PeeopleKey.Planer.push(data.LoginName);});});
		$.each(padPersonId[0].MPD, function(index, element){$.when(GetUserKey(element)).done(function(data){PeeopleKey.MPD.push(data.LoginName);});});
		$.each(padPersonId[0].GL, function(index, element){$.when(GetUserKey(element)).done(function(data){PeeopleKey.GL.push(data.LoginName);});});

		SPClientPeoplePicker.SPClientPeoplePickerDict[PeoplePikcerWorkbook[0]].AddUserKeys(PeeopleKey.Planer.join(";"));
		SPClientPeoplePicker.SPClientPeoplePickerDict[PeoplePikcerWorkbook[1]].AddUserKeys(PeeopleKey.MPD.join(";"));
		SPClientPeoplePicker.SPClientPeoplePickerDict[PeoplePikcerWorkbook[2]].AddUserKeys(PeeopleKey.GL.join(";"));
	});

	$('#create').on('click', function(){
		addItemsToSharePoint();
	});
}

//*************************************************************************
//********************Fields easy validation ******************************
//*************************************************************************	
function isWrong(ID){
	console.log(ID);
	$(ID).parent().addClass('has-error');
}

function hidePadData(){
	if ($(".PAD-analysis").css('display') == "none"){
		// element is hidden do nothing
	}else{
		$(".PAD-analysis").hide();
	}
}

function validation(){
	$('#validationMessage').children().remove();
	$('.has-error').removeClass('has-error');

	if (!CheckPeopleField('peoplePickerDRE_TopSpan')){
		$('#peoplePickerDRE').parent().parent().addClass('has-error');
		console.log('peoplePickerDRE missing');
	}

	$('input[type="text"]').filter('[required]:visible').each(function(index, element){
		if (IsStrNullOrEmpty(element.value)){
			DisplayModalFail("Empty Fields!", false);
			return;
		}
		if (!(IsStrNullOrEmpty(element.value))) {
			if (element.id == 'numberEWO'){
				if (!(element.value.length == 7 || (element.value.length == 10 && element.value.indexOf(")") !== -1) && element.value.indexOf("(") !== -1)){
					isWrong('#' + element.id);
					$("#validationMessage" ).append( "<p clas='errorInfo'>EWO Number shouldn't be only numbers and/or empty</p>");
				}
			}
			if (element.id == 'titleEWO' && !isNaN(element.value)){
				isWrong('#' + element.id);
				$("#validationMessage" ).append( "<p clas='errorInfo'>Title shouldn't be only numbers and/or empty</p>");
			}
		}
	});
	if ($('#validationMessage').children().length > 0 ) $(".alert-danger").show();

	if($('.has-error').length == 0){
		$(".alert-danger").hide();
		$(".PAD-analysis").show();
		$(".summaryBtn").show();
		if ($("#infoVAA").is(":checked")) $(".VAA-info").show();
	}
}

//*************************************************************************
//********************Check if EWO exist*************************************
//*************************************************************************

function checkEWO(listName, EWONo) {  
	var siteUrl = _spPageContextInfo.siteAbsoluteUrl;  
	var oDataUrl = siteUrl + "/_api/web/lists/getbytitle('"+listName+"')/items?$select=Title&$filter=(n7af eq'"+ EWONo +"')";

	$.ajax({
		url: oDataUrl,
		type: "GET",
		dataType: "json",
		}).done( function(data){
			if(data.value.length > 0) DisplayModalFail('EWO number exist on database!', false);
		}).fail(function(errMessage){
			console.log('Error in checkEWO: '+errMessage);
		});
}

//************************************************************************
//********************Clone pad section & add remove link*****************
//************************************************************************

function clonePadSection(counter){
	alert();
	var tempInitializePeoplePicker = ['peoplePickerMePlaner' + counter, 'peoplePickerMPDProcessor' + counter, 'peoplePickerMeGL' + counter];
	var template = null;

	template = $(".clone").clone().find("input").val("").end();
	template.removeClass('clone').addClass(counter);

	template.find('#peoplePickerMePlaner').attr('id', tempInitializePeoplePicker[0]);
	template.find('#peoplePickerMPDProcessor').attr('id', tempInitializePeoplePicker[1]);
	template.find('#peoplePickerMeGL').attr('id', tempInitializePeoplePicker[2]);

	$(".PAD-analysis").append(template);

	initializePeoplePicker(tempInitializePeoplePicker[0], true,'generalInfoOfEWO planner');
	initializePeoplePicker(tempInitializePeoplePicker[1], true,'generalInfoOfEWO processor');
	initializePeoplePicker(tempInitializePeoplePicker[2], true,'generalInfoOfEWO GL');
}

function checkPlatform(book){
	var infoPlatformMY={};

	switch(book){
		case "P3/P7":
			infoPlatformMY.platform="GAMMA P3/P7";
			infoPlatformMY.MY="2018";
			break;
		case "Z":
			infoPlatformMY.platform="EPSILON";
			infoPlatformMY.MY="2020";
			break;
		/*case "J":
		case "0M":
		case "0X": */
		case "0S":
			infoPlatformMY.platform="GAMMA";
			infoPlatformMY.MY="2018";
			break;
		/*case "B":
		case "P(all plants)":*/
		case "0W":
			infoPlatformMY.platform="GAMMA";
			infoPlatformMY.MY="2018";
			break;
		case "9BUO":
			infoPlatformMY.platform="GAMMA 9Bxx";
			infoPlatformMY.MY="2020";
			break;
	}
	return infoPlatformMY;
}

function secondValidation(){
	$('.has-error').removeClass('has-error');

	$.each($('.PAD-analysis').children('div'), function(index, element){
		$.map($(this).find("div[id*='peoplePicker']"), function(element){
			if (element.id.indexOf('_TopSpan') > -1 && element.id.indexOf('AutoFillDiv') == -1){
				if (!CheckPeopleField(element.id)){
					$('#'+element.id).parent().parent().addClass('has-error');
				}
			}
		});
		if($('.workbook', this).find(':selected').val() == 'Please pick workbook') isWrong($('.workbook', this));
		if(~~$('.modelYear', this).val() == 0) isWrong($('.modelYear', this));
		if($('.platform', this).val() == '') isWrong($('.platform', this));
		if(~~$('.numberPAD', this).val() == 0) isWrong($('.numberPAD', this));
	});

	if($('.VAA-info').is(':visible')){
		if($('.type').find('input:checkbox:checked').length == 0){$('.type').addClass('has-error');}
		if($('.plant').find('input:checkbox:checked').length == 0){$('.plant').addClass('has-error');}
	}

	if($('.has-error').length == 0){
		$(".summaryBtn").show();
		$(".summaryInfo").show();
		$(".createBtn").show();

		displaySummary();
		//createMailToVAA();
	}
}

function displaySummary(){
	var PlatformCoordinators = {'Id': '', 'Email': [], 'ID': []}; 
	peoplePickermailVAACoordinators();

	$.each($('.PAD-analysis').children('div'), function(index, element){$.when(CheckPlaform($('.workbook', this).val())).done(function(data){PlatformCoordinators.Id += (data.value[0].PlatformCoordinatorsId)});});
	PlatformCoordinators.ID = PlatformCoordinators.Id.split(',');
	$.each(PlatformCoordinators.ID, function(index, element){$.when(GetUserKey(element)).done(function(data){PlatformCoordinators.Email.push(data.LoginName);});});

	SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailPlatformCoordinators'+"_TopSpan"].AddUserKeys(PlatformCoordinators.Email.join(";"));

	$.each(SPClientPeoplePicker.SPClientPeoplePickerDict, function(index, element){
		if (element.TopLevelElementId.indexOf('MePlaner') > -1){
			SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailReceivers'+"_TopSpan"].AddUserKeys(element.GetAllUserKeys());
		}
		if (element.TopLevelElementId.indexOf('MPDProcessor') > -1 || element.TopLevelElementId.indexOf('peoplePickerMeGL') > -1){
			SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailMailCopy'+"_TopSpan"].AddUserKeys(element.GetAllUserKeys());
		}
	});
}