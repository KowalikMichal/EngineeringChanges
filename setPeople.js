function SetPeopleField() {

	var DefferSetPeopleFiled = new $.Deferred();
	var peoplePickerElementId = this.SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDRE_TopSpan;
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
var UserFileld = SetPeopleField();
console.log(UserFileld);