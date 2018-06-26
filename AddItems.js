var EWODeferred = new $.Deferred();
var VAADeferred = new $.Deferred();
var ApprovalDeferred = new $.Deferred();
var AdministratorDeferred = new $.Deferred();


function addItemsToSharePoint(){
	$('#ModalInfo :button').hide()
	$('#ModalInfo').find('.icon-box').append('<div class="loader"></div>')
	
	$('#ModalInfo').find('.modal-header').addClass('Working');
	$('#ModalInfoBody').html('<h4>Working on it!</h4><p>Please give me a moment...</p>');
	$('#ModalInfo').modal({backdrop: "static"});

	addToEWOList();
//if static torque just add item to static torque part

// if VAA add to new list VAA

// add to EWO Cost, Approval List and Administrator List
	$.when(EWODeferred).done(function(){
		$('#ModalInfo :button').show()
		$('#ModalInfo').find('.icon-box').html('<i class="glyphicon glyphicon-ok"></i>');
		$('#ModalInfo').find('.modal-header').removeClass('Working').addClass('Successful');
		$('#ModalInfoBody').html('<h4>Great!</h4><p>EWO has been created successfully.</p>');
		
		$('#ModalInfo').on('click', function(){
			location.reload();
		});

		$('#ModalInfo').modal({backdrop: "static"});
	}).fail(function(){
		$('#ModalInfo :button').show()
		$('#ModalInfo').find('.icon-box').html('<i class="glyphicon glyphicon-remove"></i>');
		$('#ModalInfo').find('.modal-header').removeClass('Working').addClass('Error');
		$('#ModalInfoBody').html('<h4>Ooops!</h4><p>Something went wrong :(</p>');
		
		$('#ModalInfo').on('click', function(){
			location.reload();
		});

		$('#ModalInfo').modal({backdrop: "static"})
		});
}

function addToEWOList() {
	getUserInfo();
	deferred.done(function(userMail) {
		var user = SP.FieldUserValue.fromUser(userMail);
		var clientContext = new SP.ClientContext.get_current();	
		var oList = clientContext.get_web().get_lists().getByTitle('EWOList');
		var itemCreateInfo = new SP.ListItemCreationInformation();
		this.oListItem = oList.addItem(itemCreateInfo);
// ADD COLUMNS
		oListItem.set_item('Title', 'Example title');
		oListItem.set_item('Initiator', userMail);
		
		oListItem.update();
		clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceededaddToEWOList), Function.createDelegate(this, this.onQueryFailedaddToEWOList));
	});
}

function onQuerySucceededaddToEWOList() {
	EWODeferred.resolve();
}

function onQueryFailedaddToEWOList(sender, args) {
	console.log('addToEWOList failed: ' + args.get_message() + '\n' + args.get_stackTrace());
	EWODeferred.reject();
}

function getUserInfo(peoplePickerElementId) {
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
//new
var MailsReceivers= {'TO': [], 'CC': []};
function appendSummaryMails(peoplePickerElementId_ToSpan, appendTo) {
	var users = peoplePickerElementId_ToSpan.GetAllUserInfo();
	
	$.each(users, function(index, element){
		 $.when(GetUserIdFromUserName(element.Key)).done(function(data){
			$.map(data, function(n){
				switch(appendTo){
					case "CC":
						MailsReceivers['CC'].push(SP.FieldUserValue.fromUser(n.Email));
						break;
					case "TO":
						MailsReceivers['TO'].push(SP.FieldUserValue.fromUser(n.Email));
						break;
				}
			});
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


/*
for(var key in SPClientPeoplePicker.SPClientPeoplePickerDict){
   //for every peoplepicker on the page
   var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[key];
   //check out the peoplepicker object - there's a lot more you can do with it
   console.log(picker);

   //haven't found out what the second parameter does actually but it works like this 
   picker.BatchAddUserKeysOperation(['domain\\loginname'], 0);
}



*/