///variable 
var engineersForEWO={planner:[],processor:[],gl:[],list:""};
var actualSelection;
//used for final engineers matching
var mailReceivers={mail:[]}; //possible to add name
var cc={mail:[]};//possible to add name

var platforms=[]; //actually workbookw
var platformCoordinators=[]; //guys for given workbooks

var plannersAndGL={planner:[],gl:[]};

var deferred = new $.Deferred(); //delete after optymalization -> used in addToEwo
var counter = 0;
var compilane= {'Planner': [], 'Processor': [],  'GL': [],'VAACoordinators': []};