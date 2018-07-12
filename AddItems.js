// var EWODeferred = new $.Deferred();

// var VAADeferred = new $.Deferred();
// var ApprovalDeferred = new $.Deferred();
// var AdministratorDeferred = new $.Deferred();


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
		$('#ModalInfo :button').show();
		$('#ModalInfo').on('click', function(){
			location.reload();
		});
	};

	$('#ModalInfo').modal({backdrop: "static"})
}

function addItemsToSharePoint(){
	var DeferredList = {'EwoListDeferred': new $.Deferred(), 'VAAListDeferred': new $.Deferred()}
	DisplayModalWorking();
	try{
		//set main
		compilane.EWONo = $('#numberEWO').val();
		compilane.Title = $('#titleEWO').val();
		compilane.DRE = SetPeopleField('peoplePickerDRE_TopSpan');
		compilane.DRE = SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickerDRE'+"_TopSpan"].GetAllUserKeys().split(';');
		compilane.Workbook = $('.workbook').find(':selected').val();
		compilane.MY = ('.modelYear').val();
		compilane.Platform = $('.platform').val();
		compilane.PADNo = $('.numberPAD').val();
		compilane.TO = SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailReceivers'+"_TopSpan"].GetAllUserKeys().split(';');
		compilane.CC = $.merge(SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailMailCopy'+"_TopSpan"].GetAllUserKeys().split(';'), SPClientPeoplePicker.SPClientPeoplePickerDict['peoplePickermailPlatformCoordinators'+"_TopSpan"].GetAllUserKeys().split(';'))
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
			DisplayModalFail("I can't update item", true);
		});
	}
	catch(error){
		DisplayModalFail(error, true);
	}
}

function addToEWOList(EwoListDeferred) {
	var clientContext = new SP.ClientContext.get_current();	
	var oList = clientContext.get_web().get_lists().getByTitle('EWOList');

	var itemCreateInfo = new SP.ListItemCreationInformation();
	this.oListItem = oList.addItem(itemCreateInfo);
		oListItem.set_item('EWONo', compilane.EWONo);
		oListItem.set_item('Title', compilane.Title);
		oListItem.set_item('Initiator', compilane.DRE);
		oListItem.set_item('Workbook', compilane.Workbook);
		oListItem.set_item('MY', compilane.MY);
		oListItem.set_item('Platform', compilane.Platform);
		oListItem.set_item('PADNo', compilane.PADNo);
		oListItem.set_item('E_x002d_mail_x0020_Receivers', compilane.TO);
		oListItem.set_item('E_x002d_Mail_x0020_CC', compilane.CC);
		oListItem.set_item('AttachmentLink', compilane.AttachmentLink);
			if (compilane.Response !== null) oListItem.set_item('Response_x0020_needed_x003f_', compilane.Response) //?
			if (compilane.VAAType !== null) oListItem.set_item('VAA_x0020_type', compilane.VAAType);
			if (compilane.ReasonCode !== null) oListItem.set_item('ReasonCode', compilane.ReasonCode);
			if (compilane.VAAType !== null || compilane.VAAType.length !== 0) oListItem.set_item('VAA_x0020_type', compilane.VAAType);
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


