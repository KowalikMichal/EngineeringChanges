var EWODeferred = new $.Deferred();
var VAADeferred = new $.Deferred();
var ApprovalDeferred = new $.Deferred();
var AdministratorDeferred = new $.Deferred();


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
	DisplayModalWorking();
	addToEWOList();
//if static torque just add item to static torque part

// if VAA add to new list VAA

// add to EWO Cost, Approval List and Administrator List

	$.when(EWODeferred).done(function(){ //works or not?
		DisplayModalDone();
	}).fail(function(){
		DisplayModalFail("I can't update item", true);
	});
}



function addToEWOList(compilane) {

	var user = SP.FieldUserValue.fromUser(userMail);
	var clientContext = new SP.ClientContext.get_current();	
	var oList = clientContext.get_web().get_lists().getByTitle('EWOList');
	var itemCreateInfo = new SP.ListItemCreationInformation();
	this.oListItem = oList.addItem(itemCreateInfo);
// ADD COLUMNS
	oListItem.set_item('EWONo', compilane.EWONo); //EWO number
	oListItem.set_item('Title', compilane.Title);
	oListItem.set_item('Initiator', compilane.DRE);
	oListItem.set_item('Platform', compilane.Platform);
	oListItem.set_item('VPPS_x0027_s', compilane.VPPS); //VPPS's what
	oListItem.set_item('PADNo', compilane.PADNo);
	oListItem.set_item('Response_x0020_needed_x003f_', compilane.Response)
	oListItem.set_item('E_x002d_mail_x0020_Receivers', compilane.TO);
	oListItem.set_item('E_x002d_Mail_x0020_CC', compilane.CC);
	if (compilane.AttachmentLink !== null) oListItem.set_item('AttachmentLink', compilane.AttachmentLink);
	oListItem.set_item('MY', compilane.MY);
	oListItem.set_item('VAA_x0020_type', compilane.VAAType);
	oListItem.set_item('EWOLaunchDate', compilane.EWOLaunchDate);

	oListItem.update();
	clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceededaddToEWOList), Function.createDelegate(this, this.onQueryFailedaddToEWOList));

}

function onQuerySucceededaddToEWOList() {
	EWODeferred.resolve();
}

function onQueryFailedaddToEWOList(sender, args) {
	console.log('addToEWOList failed: ' + args.get_message() + '\n' + args.get_stackTrace());
	EWODeferred.reject();
}

function getUserInfo(peoplePickerElementId) {
	console.log('getUserInfo');
	//var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDRE_TopSpan;

	var users = peoplePickerElementId.GetAllUserInfo();
	var userMail = [];
	
	$.each(users, function(index, element){
		 $.when(GetUserIdFromUserName(element.Key)).done(function(data){
			$.map(data, function(n){
				userMail.push(SP.FieldUserValue.fromUser(n.Email));
			});
			if (userMail.length == users.length) return deferred.resolve(userMail);
		});
	});
}
function GetUserIdFromUserName(userName) {
		var siteUrl = _spPageContextInfo.siteAbsoluteUrl;
		var accountName = userName;
		return $.ajax({
					url: siteUrl + "/_api/web/siteusers(@v)?@v='" + 
						encodeURIComponent(accountName) + "'",
					method: "GET",
					headers: { "Accept": "application/json; odata=verbose" },
					success: function (data) {
						return data.d.Emai;
					},
					error: function (data) {
						console.log(JSON.stringify(data));
					}
				});
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
