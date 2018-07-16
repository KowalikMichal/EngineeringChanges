function DisplayModalWorking(){
	$('#ModalInfo').find('.icon-box').html(' ');

	$('#ModalInfo :button').hide()
	$('#ModalInfo').find('.icon-box').append('<div class="loader"></div>')
	
	$('#ModalInfo').find('.modal-header').addClass('Working');
	$('#ModalInfoBody').html('<h4>Working on it!</h4><p>Please give me a moment...</p>');
	$('#ModalInfo').modal({backdrop: "static"});
}

function DisplayModalDone(){
	$('#ModalInfo :button').show()
	$('#ModalInfo').find('.icon-box').html('<i class="glyphicon glyphicon-ok"></i>');
	$('#ModalInfo').find('.modal-header').removeClass('Working').addClass('Successful');
	$('#ModalInfoBody').html('<h4>Great!</h4><p>EWO has been created successfully.</p>');
		
	$('#ModalInfo').on('click', function(){
		location.reload();
	});

	$('#ModalInfo').modal({backdrop: "static"});
}

function DisplayModalFail(error, reload){
	$('.btn-success').hide();
	$('#ModalInfo').find('.icon-box').html('<i class="glyphicon glyphicon-remove"></i>');
	$('#ModalInfo').find('.modal-header').removeClass('Working').addClass('Error');
	$('#ModalInfoBody').html('<h4>Ooops!</h4><p>Something went wrong :(</p><p>'+error+'</p>');
	
	if (reload) {
		localStorage.removeItem('PadPlaners');
		localStorage.removeItem('usersData');

		$('#ModalInfo :button').show();
		$('#ModalInfo').on('click', function(){
			location.reload();
		});
	};

	$('#ModalInfo').modal({backdrop: "static"})
}

function getItemTypeForListName(name) {
	return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
}

function addItemsToSharePoint(){
	var DeferredList = {'EwoListDeferred': new $.Deferred(), 'VAAListDeferred': new $.Deferred(), 'EWOCostListDeferred':new $.Deferred(), 'EWOApprovalListDeferred': new $.Deferred()};

	DisplayModalWorking();
	try{
		console.trace();
		compilane.DRE =[];
		compilane.TO =[];
		compilane.CC =[];
		compilane.PlanerKey = '';
		compilane.PlanerId =  [];

		//set main
		compilane.EWONo = $('#numberEWO').val();
		compilane.Title = $('#titleEWO').val();
		compilane.Workbook = $('.workbook').find(':selected').val();
		compilane.MY = $('.modelYear').val();
		compilane.Platform = $('.platform').val();
		compilane.PADNo = $('.numberPAD').val();

		$.each(SPClientPeoplePicker.SPClientPeoplePickerDict, function(index, element){
			if (element.TopLevelElementId.indexOf('MePlaner') > -1){
				compilane.PlanerKey += element.GetAllUserKeys() + ';';
			}
		});

		$.each(compilane.PlanerKey.split(';').filter(function(element){if(!IsStrNullOrEmpty(element)) return true;}), function(index, login){
			$.when(getUserKey(login)).done(function(returnData){
				compilane.PlanerId.push(returnData);
			});
		});

		$.when(getUserKey(SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickerDRE'+"_TopSpan"].GetAllUserKeys())).done(function(returnData){
			compilane.DRE = returnData;
		});

		$.each(SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailReceivers'+"_TopSpan"].GetAllUserKeys().split(';'), function(index, login){
			$.when(getUserKey(login)).done(function(returnData){
				compilane.TO.push(returnData);
			});
		});

		$.each(SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailReceivers'+"_TopSpan"].GetAllUserKeys().split(';'), function(index, login){
			$.when(getUserKey(login)).done(function(returnData){
				compilane.TO.push(returnData);
			});
		});

		$.each($.merge(SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailMailCopy'+"_TopSpan"].GetAllUserKeys().split(';'), SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailPlatformCoordinators'+"_TopSpan"].GetAllUserKeys().split(';')), function(index, login){
			$.when(getUserKey(login)).done(function(returnData){
				compilane.CC.push(returnData);
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

		addToEWOList('EWOList', DeferredList.EwoListDeferred);
		addToEWOCost('EWO COSTS', DeferredList.EWOCostListDeferred); //error
		addToEWOApproval('EWO Approval List', DeferredList.EWOApprovalListDeferred);

		$.when(DeferredList.EwoListDeferred, DeferredList.VAAListDeferred, DeferredList.EWOCostListDeferred, DeferredList.EWOApprovalListDeferred).done(function(){
			DisplayModalDone();
		}).fail(function(){
			DisplayModalFail("I can't update item", false);
		});
	}
	catch(error){
		DisplayModalFail('Catch error: '+error, false);
	}
}

function addToEWOList(listName, EwoListDeferred) {
	var itemType = getItemTypeForListName(listName);
	var siteUrl = _spPageContextInfo.webAbsoluteUrl;
	var itemProperties = {};
		itemProperties['EWONo'] = compilane.EWONo;
		itemProperties['Title'] = compilane.Title;
		itemProperties['InitiatorId'] = compilane.DRE;
		itemProperties['Workbook'] = compilane.Workbook;
		itemProperties['MY'] = compilane.MY;
		itemProperties['Platform'] = compilane.Platform;
		itemProperties['PADNo'] = compilane.PADNo;
		itemProperties["E_x002d_mail_x0020_ReceiversId"] = {'results':compilane.TO};
		itemProperties["E_x002d_Mail_x0020_CCId"] = {'results':compilane.CC};
		itemProperties['AttachmentLink'] = compilane.AttachmentLink;
		if (compilane.VAAType !== null) itemProperties['VAA_x0020_type'] = compilane.VAAType;
		if (compilane.ReasonCode !== null) itemProperties['ReasonCode'] = compilane.VAAType;
		itemProperties["__metadata"] = { "type": itemType };

	$.ajax({
		url: siteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items",
		type: "POST",
		contentType: "application/json;odata=verbose",
		data: JSON.stringify(itemProperties),
		headers: {
			"Accept": "application/json;odata=verbose",
			"X-RequestDigest": $("#__REQUESTDIGEST").val()
		},
		success: function () {
			return EwoListDeferred.resolve();
		},
		error: function (error) {
			console.log(error);
			return EwoListDeferred.reject();
		}
	});
}

function addToVAAList(VAAListDeferred){
	var clientContext = new SP.ClientContext.get_current();	
	var oList = clientContext.get_web().get_lists().getByTitle('EWO%20Static%20Torque');

	var itemCreateInfo = new SP.ListItemCreationInformation();
	this.oListItem = oList.addItem(itemCreateInfo);
		oListItem.set_item('Title', compilane.Title);
		oListItem.set_item('Number', compilane.EWONo);
		oListItem.set_item('Model_x0020_Year', compilane.MY);
		oListItem.set_item('Platform', compilane.Platform);
		oListItem.set_item('Workbook', compilane.Workbook);
		oListItem.set_item('Sub_x002d_Type', compilane.SubType);
		oListItem.set_item('AttachmentLink', compilane.AttachmentLink);
	oListItem.update();

	clientContext.executeQueryAsync(
		Function.createDelegate(this, function(){
			return VAAListDeferred.resolve();
		}),
		Function.createDelegate(this, function(sender, args){
			console.log('addToEWOList failed: ' + args.get_message() + '\n' + args.get_stackTrace());
			return VAAListDeferred.reject();
		})
	);
}

function addToEWOCost(listName, EWOCostListDeferred){
	var context = new SP.ClientContext.get_current();
	var itemAdd= [];

	for (var i=0; i < compilane.PlanerId.length; i++){
		console.trace();
		var contactItem = multipeaddToEWOCost(context, listName, compilane.PlanerId[i], JSON.parse(localStorage.getItem('PadPlaners')).map(function(n){if (n['MPDId'] == compilane.PlanerId[i]) return n.GLId;}));
			itemAdd.push(contactItem);
	}

	context.executeQueryAsync(
	function() {
		console.log(itemAdd.length + ' contacts have been created');
		return EWOCostListDeferred.resolve();    
	},
	function(sender, args) {
		console.log(args.get_message());
		EWOCostListDeferred.reject();
	});
}

function multipeaddToEWOCost(context, listName, PlnerId, GLId){
	var web = context.get_web();
	var list = web.get_lists().getByTitle(listName);
	var itemCreateInfo = new SP.ListItemCreationInformation();
	var PlanerField = new SP.FieldUserValue();
		PlanerField.set_lookupId(PlnerId);
	var GLField = new SP.FieldUserValue();
		GLField.set_lookupId(GLId);
	var listItem = list.addItem(itemCreateInfo);
		listItem.set_item('Title', compilane.EWONo);
		listItem.set_item('Planner', PlanerField); //can't set by id
		listItem.set_item('Group_x0020_Leader', GLField); //can't set by id
	listItem.update();
	return listItem;
}

function addToEWOApproval(listName, EWOApprovalListDeferred){
	var clientContext = new SP.ClientContext.get_current();	
	var oList = clientContext.get_web().get_lists().getByTitle(listName);

	var itemCreateInfo = new SP.ListItemCreationInformation();
	this.oListItem = oList.addItem(itemCreateInfo);
		oListItem.set_item('Title', compilane.Title);
		oListItem.set_item('ptwm', compilane.EWONo);
		oListItem.set_item('p5pj', compilane.AttachmentLink);
		oListItem.set_item('No_x0020_of_x0020_Planers', compilane.PlanerId.length);
		oListItem.set_item('_x0061_tj7', compilane.PlanerId);
	oListItem.update();

	clientContext.executeQueryAsync(
		Function.createDelegate(this, function(){
			return EWOApprovalListDeferred.resolve();
		}),
		Function.createDelegate(this, function(sender, args){
			console.log('addToEWOList failed: ' + args.get_message() + '\n' + args.get_stackTrace());
			return EWOApprovalListDeferred.reject();
		})
	);
}

// UNDER CONSTRUCTION
//********************
//*******************
function createMailToVAA(){
	var addresses = "marcin.plisz@opel.com;";
	var body = "Hello," +"<br/>"+
	"Please check the attached WO and send your comment ASAP to Jacek Pedrycz."+"<br/>"+
	"For further question please contact to:" + $("#nameDRE").val() + "<"+ $("#mailDRE").val()+">"; 
	var subject = "EWO " + $("#numberEWO").val();
	
	var href = "mailto:" + addresses + "?"
		 + "subject=" + subject + "&"
		 + "body=" + body;
	var wndMail;
	wndMail = window.open(href, "_blank", "scrollbars=yes,resizable=yes,width=10,height=10");
	if(wndMail){
		wndMail.close();    
	}
}