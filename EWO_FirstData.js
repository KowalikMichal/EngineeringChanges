var engineersForEWO={planner:[],processor:[],gl:[],list:""};
var actualSelection;
//used for final engineers matching
var mailReceivers={mail:[]}; //possible to add name
var cc={mail:[]};//possible to add name

var platforms=[]; //actually workbookw
var platformCoordinators=[]; //guys for given workbooks

var plannersAndGL={planner:[],gl:[]};

var deferred = new $.Deferred();
var counter = null;
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

//// people picker
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

/*
//for every peoplepicker on the page 
for(var key in SPClientPeoplePicker.SPClientPeoplePickerDict){ 
	console.log(key);
}
*/

function readyFunction(){
	$('#numberEWO').focusout(function(){
		checkEWO('EWO%20List', $('#numberEWO').val());
	});

	$(".generalInfoOfEWO").change(function(){
		hidePadData();
	});
	
	$("#checkGeneralData").click(function(){ 
		hidePadData();
		validateNumber();	
	});
	
	$("#addDRE").click(function(){ 
		getDataToAddDRE($("#nameDRE").val(),$("#mailDRE").val());
	});
	
	$('body').on('click', '.addSection', function(){
		if (counter == null) counter = 1;
		clonePadSection(counter);
		counter++;
	}); 
	
	$('body').on('click', '#doSummary', function(){
		secondValidation();
	}); 


	$('body').on('click', '.removeSection', function(){
		if ($(this).closest(".section").hasClass('clone')){ 
			//do nothing
		}else if ($('.removeSection').length > 1){
			$(this).parent().fadeOut(300, function(){
				$(this).parent().parent().remove();
				return false;
			})
		}else{
			DisplayModalFail("At least one PAD section needs to be fulfilled!", false);
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
			SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickerDRE'+"_TopSpan"].AddUserKeys("toni.konz@opel.com");
		}else{
			$("#titleEWO").val("");
			$("#nameDRE").val("");
			SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickerDRE'+"_TopSpan"].DeleteProcessedUser();
		}
	});
	
	$(".PAD-analysis" ).on( "change", ".numberPAD", function() {
		actualSelection=$(this);
		findEngineersFromPAD(this.value , $(this).parents(".row").find(".workbook").val());
	});
}
/*
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
	var matches, substringRegex;

	// an array that will be populated with substring matches
	matches = [];

	// regex used to determine if a string contains the substring `q`
	substrRegex = new RegExp(q, 'i');

	// iterate through the pool of strings and for any string that
	// contains the substring `q`, add it to the `matches` array
	$.each(strs, function(i, str) {
	  if (substrRegex.test(str)) {
		matches.push(str);
	  }
	});
	cb(matches);
  };
};
*/
function validateNumberLength(selectorID){
	$( "#validationMessage" ).append( "<p clas='errorInfo'>Number EWO has to have 7 (or 10) digits.</p>" );
	isWrong(selectorID);
}

//*************************************************************************
//********************Fields easy validation ******************************
//*************************************************************************	

function validateNumber(){
	$(".alert-danger").children().remove();
	$(".alert-danger").hide();

	var selectorID="#numberEWO";
	removerErrorClass(selectorID);
	
	if($(selectorID).val().indexOf("(")==-1){
		if(!isNaN($(selectorID).val())){
			if($(selectorID).val().length!=7){
				validateNumberLength(selectorID);
			}
		}else{
			$("#validationMessage").append("<p clas='errorInfo'>Number EWO has to be number.</p>");
			isWrong(selectorID);
	}
	}else{
		if($(selectorID).val().length!=10){
			validateNumberLength(selectorID);
		}
 }
	selectorID="#titleEWO";
	validateTitle(selectorID);	
}

function validateTitle(selectorID){
	removerErrorClass(selectorID);
	if(!isNaN($(selectorID).val()) ||$(selectorID).val()==""){
		$("#validationMessage" ).append( "<p clas='errorInfo'>Title shouldn't be only numbers and/or empty </p>");
		isWrong(selectorID);
	}
	selectorID = "#peoplePickerDRE_TopSpan_HiddenInput";
	validateDRE(selectorID);
}
function validateDRE(selectorID){
	removerErrorClass(selectorID);
	
	if ($('#peoplePickerDRE_TopSpan_HiddenInput').val() == '[]' || $('#peoplePickerDRE_TopSpan_HiddenInput').val() == ''){
		$("#validationMessage").append("<p clas='errorInfo'>DRE field is empty </p>");
		isWrong(selectorID);
	}
	else {
		var nameDRE = $.parseJSON($('#peoplePickerDRE_TopSpan_HiddenInput').val());
		if(nameDRE[0].hasOwnProperty('Description')) checkOveralValidation();
	}	
}

function isWrong(ID){
	$(ID).parent().addClass('has-error');
}

function removerErrorClass(ID){
	var checkError = $(ID).parent().hasClass("has-error") ? true: false;
	if(checkError) $(ID).parent().removeClass('has-error');
}
/*
function setTrimValue(ID){
	if(/^\s/.test($(ID).val())|| /\s$/.test($(ID).val())){
		var correctValue =$.trim( $(ID).val());
		$(ID).val(correctValue);
	}
}
*/
function isEmpty(str){
	return !str.replace(/^\s+/g, '').length; 
}
function checkOveralValidation(){
	if(checkErrorClass("#numberEWO") || checkErrorClass("#peoplePickerDRE_TopSpan_HiddenInput") || (checkErrorClass("#titleEWO"))){
		DisplayModalFail("Check correctness!", false);
		$(".alert-danger").show();
	}
	else{
		$(".PAD-analysis").show();
		$(".summaryBtn").show();
		if($("#infoVAA").is(":checked")) $(".VAA-info").show();
		compilane.EWONo = $('#numberEWO').val();
		compilane.Title = $('#titleEWO').val();
		compilane.DRE = SetPeopleField('peoplePickerDRE_TopSpan');
	}
}

function checkErrorClass(ID){
	if($(ID).parent().hasClass("has-error")){
		return true;
	}
	return false;
}

function hidePadData(){
	if ($(".PAD-analysis").css('display') == "none"){
		// element is hidden do nothing
	}else{
		$(".PAD-analysis").hide();
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
			DisplayModalFail('Error in checkEWO: '+errMessage, false);
		});
}

//************************************************************************
//********************Clone pad section & add remove link*****************
//************************************************************************

function clonePadSection(counter){
	var template = null;
	template = $(".clone").clone().find("input").val("").end();
	template.removeClass('clone');
	var tempInitializePeoplePicker = ['peoplePickerMePlaner' + counter, 'peoplePickerMPDProcessor' + counter, 'peoplePickerMeGL' + counter];
	
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
			infoPlatformMY.platform="GAMMA 9Bxx"
			infoPlatformMY.MY="2020"
			break;
	}
	return infoPlatformMY;
}

function findEngineersFromPAD(PAD,platform){

	$( "#validationMessage" ).empty();
	$( "#validationMessage" ).hide();
	
	var list= $('.PAD-analysis').find(":selected").attr('data-listName')
	engineersForEWO.planner=[];
	engineersForEWO.processor=[];
	engineersForEWO.gl=[];
	engineersForEWO.list="";
	
	engineersForEWO.list=list;
	var clientContext = SP.ClientContext.get_current();
	var oList = clientContext.get_web().get_lists().getByTitle('PAD&Planners'); 
	var camlQuery = new SP.CamlQuery();

								 camlQuery.set_viewXml(
													  '<View><Query><Where><Eq><FieldRef Name=\'PAD_x0020_NO\'/>' +
													  '<Value Type=\'Text\'>' + PAD + '</Value></Eq></Where></Query>' +
													  '</View>'
													  );
	collListItem = oList.getItems(camlQuery);
	console.log(collListItem);
	clientContext.load(collListItem);
	clientContext.executeQueryAsync(Function.createDelegate(this, this.onPADSuccess), Function.createDelegate(this, this.onPADFail));	
}

function onPADSuccess(){
	var list=engineersForEWO.list;
	var listItemInfo = '';
	var listItemEnumerator = collListItem.getEnumerator();
	while (listItemEnumerator.moveNext()){
		var oListItem = listItemEnumerator.get_current();
		if(!oListItem.get_item(list)){
			DisplayModalFail("Please check the number PAD for this workbook - nothing is shown in PAD Planners", false);
			$( "#validationMessage" ).append( "<p clas='errorInfo'>Refer to <a href='https://share.opel.com/sites/MEACEWO/Lists/PADPlanners/All%20Items.aspx' target='_blank'>PAD Planners on SP</a> to check the issue</p>" );
			$("#validationMessage").show();
			break;
		}
		//var planner=oListItem.get_item(list)[0].$4K_1;
		console.log(oListItem.get_item(list)[0]);
		var plannerMail=oListItem.get_item(list)[0].$6_2;	
		//var processor=oListItem.get_item('MPD')[0].$4K_1;
		var processorMail=oListItem.get_item('MPD')[0].$6_2;
		//var gl=oListItem.get_item('GL')[0].$4K_1;
		var glMail=oListItem.get_item('GL')[0].$6_2;
		
		if(oListItem.get_item(list).length==2){
			var plannerMail2=oListItem.get_item(list)[1].$6_2;
			var glMail2=oListItem.get_item('GL')[1].$6_2;
		}
	}		
	
	engineersForEWO.planner.push(plannerMail);
	engineersForEWO.processor.push(processorMail);
	engineersForEWO.gl.push(glMail);
			
	if(plannerMail2) engineersForEWO.planner.push(plannerMail2);
	if(glMail2) engineersForEWO.gl.push(glMail2)
	
	SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickerMePlaner'+"_TopSpan"].AddUserKeys(engineersForEWO.planner.join(";"));
	SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickerMPDProcessor'+"_TopSpan"].AddUserKeys(engineersForEWO.processor.join(";"));
	SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickerMeGL'+"_TopSpan"].AddUserKeys(engineersForEWO.gl.join(";"));
}

function onPADFail(sender, args){
	DisplayModalFail('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace(), false);
}

function secondValidation(){
	var validation2=true;

	if($("#staticTorque").is(":checked")){
		var arrWithClass =[".modelYear",".workbook",".platform"];
	}else{
		var arrWithClass =[".modelYear",".workbook",".platform",".planner",".processor",".GL"];
	}
	for (var i=0;i<arrWithClass.length;i++){
			validation2 = iterateOverClass(arrWithClass[i]);
		if (!validation2){
			return false;
		}
	}
	if(validation2){
		$(".summaryBtn").show();
		$(".summaryInfo").show();
		$(".createBtn").show();

		displaySummaryMails();
		createMailToVAA();
	}
}

function iterateOverClass(className){
	var validation=true;
	$(className).each(function(){
			if(this.value!=""){ 
			}else{
				DisplayModalFail("Please fulfill necessary data" ,false);
				validation=false;
				return false;
			}
		});
	return validation;
}
/*
function checkIfIsInside(array,element){
	if (array.length==0) array.push(element);
	else{
		if(array.indexOf(element)>=0) {
			//do nothing
		}else{
			array.push(element);
		}
	}
	return array;
}

function appendSummaryData(selector){
	console.log(selector);
	$(selector).each(function(index){
		if(selector==".planner"){
			var plannerField=this.value;
			console.log('plannerField is:' + plannerField);
			console.log(index);
				if ((plannerField).indexOf(";")!=-1){
						var res = pla/nnerField.split(";");
						for(var i=0;i<res.length;i++){
							mailReceivers.mail=checkIfIsInside(mailReceivers.mail,res[i]);
						}
				}
				else{
					mailReceivers.mail=checkIfIsInside(mailReceivers.mail,this.value);
					}				
		}
		else if(selector==".workbook"){
			platforms=checkIfIsInside(platforms,this.value);
		}
		else{
			var ccField=this.value;
					if ((ccField).indexOf(";")!=-1){
						var res = ccField.split(";");
						for(var i=0;i<res.length;i++){
							cc.mail=checkIfIsInside(cc.mail,res[i]);
						}
					}
					else{
						cc.mail=checkIfIsInside(cc.mail,this.value);
					}
			}
		
	})
		for(var i=0;i<platforms.length;i++){
			console.log(platforms[i]);
			determinePlatformCoordinators(platforms[i])
		}
};

*/

function SetPeopleField(peoplePickerElementId) {
	var peoplePickerElementId = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerElementId];
	var DefferSetPeopleFiled = new $.Deferred();
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
	console.log(DefferSetPeopleFiled.state());
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
};