var JSONFEED = 'https://spreadsheets.google.com/feeds/list/1dpcguZ2Ak0zc0Sh1WoPV0c0tXVxre3yGWC1Wo5ElWtc/1/public/basic?alt=json';

$(document).ready(function() {
  $.ajax({
    url: JSONFEED,
    success: function(data) {
      readData(data);
    }
  });
});
var user ;

function doga(category, action, label) {
  console.log('did GA');
  console.log(category, action, label);
  gtag('event', 'click', {
    'event_category': category,
    'event_action': action, 
    'event_label': label,
  });
}

function readData(data) {
  var partfeed = data.feed.entry;
  var divData = [];
  var length2 = Object.keys(partfeed).length;
  localStorage.caseList = JSON.stringify(caseList);
  var caseList = JSON.parse(localStorage.caseList);
  if (localStorage.retry == 'true'){
    i = localStorage.caseNum;
    localStorage.retry = false;
  } else {
  //console.log(length2);
  // random number for the row where the case will be pulled from
 
  var i = 0 + Math.floor(Math.random() * length2);
  // recursively assigns i if i already in the list (it's been done today)
  //During one web session, you'll do all of them before one repeats. 
  //Maybe there's a better design choice. 
  while (caseList.indexOf(i)!=-1){
      i = 0 + Math.floor(Math.random() * length2)
      if (caseList.length >= length2){
        //alert("you've done all of the cases");
        caseList = []
        i = 0 + Math.floor(Math.random() * length2)
        break}
    }
  caseList.push(i)
}
  localStorage.caseNum = i;
//  console.log("Case No: "+i);
  //console.log(i, ':i');
    var JSONrow = partfeed[i].content.$t.split(',');
    var row = [];
   //console.log('the Current Case Data is: ' + JSONrow);
    for (var j = 0; j < JSONrow.length; j++) {
      val = JSONrow[j].split(':')[1];
      row[j] = val;
    	title = row[0];
    }
    drawDiv(row, title, "#caseDetails");
    
  }


function drawDiv(divData, parent, loc) {
  if (divData == null) return null;

//  console.log("Case: " + title);
  localStorage.case1Title = title;
  scenario = $.trim(divData[1]);
  age = $.trim(divData[2]);
  gender = $.trim(divData[3]);
  tempc = $.trim(divData[4]);
  tempf = $.trim(divData[5]);
  bpsys = $.trim(divData[6]);
  bpdia = $.trim(divData[7]);
  hr = $.trim(divData[8]);
  oxy = $.trim(divData[9]);
  outcomeObs = $.trim(divData[10]);
  outcomeCT = $.trim(divData[11]);
  outcomeSurg = $.trim(divData[12]);
  outcomeInt = $.trim(divData[13]);
  ruqimg = $.trim(divData[14]);
  luqimg = $.trim(divData[15]);
  subximg = $.trim(divData[16]);
  bladderimg = $.trim(divData[17]);
  lungrimg = $.trim(divData[18]);
  lunglimg = $.trim(divData[19]);
  keyImg = $.trim(divData[20]);
  localStorage.case1KeyImg = keyImg;
  keyLocation = $.trim(divData[21]);
  localStorage.case1KeyLoc = keyLocation;
//  console.log("Key Location: "+localStorage.case1KeyLoc);
  keyAction = $.trim(divData[22]);
  localStorage.case1KeyAction = keyAction;
//  console.log("Key Action: " + localStorage.case1KeyAction);

  var $caseDiv = $("<div/>");
  var casedetails = $("<p></p>").html("A " + age + "-year-old " + gender + " " + scenario); 
  $caseDiv.prepend(casedetails);
  $('#caseDetails').append($caseDiv);
  $('#BP').text('BP:' + bpsys  + '/' + bpdia);
  $('#HR').text('HR:' + hr);
  $('#T').text('T: '  + tempc +'\u00B0C' + '/' + tempf + '\u00b0F');
  $('#O2').text('O2: ' + oxy);  
}

viewedRUQ = false;
viewedLUQ = false;
viewedSubxi = false;
viewedBladder = false;
viewedLungL = false;
viewedLungR = false;
viewcount = 0;

/*
function showActions() {
    let x = document.getElementById("actionBox");
    if (viewedRUQ,viewedLUQ,viewedSubxi,viewedBladder,viewedLungR,viewedLungL === true) {
        x.style.display = "block";}
    else {x.style.display = "none";}
}
//showActions();
*/

let sec = 0;
function pad(val) {return val > 9 ? val : "0" + val;}
let timer = setInterval(function () {
    document.getElementById("seconds").innerHTML = pad(++sec % 60);
    document.getElementById("minutes").innerHTML = pad(parseInt(sec/60, 10));
}, 1000);


setTimeout(function () {
    clearInterval(timer);}, 999999);
//to-do: record time at point of selection - save as variable

function switchLUQ() {
    newLocation = "Left Upper Quadrant";
    document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
    document.getElementById("activeWindow").src= ("https://drive.google.com/uc?export=view&id=" + luqimg);
    viewedLUQ = true;
}

function switchRUQ() {
    newLocation = "Right Upper Quadrant";
    document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
    document.getElementById("activeWindow").src= ("https://drive.google.com/uc?export=view&id=" + ruqimg);
    viewedRUQ = true;
}

function switchSubxi() {
    newLocation = "Subxiphoid";
    document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
    document.getElementById("activeWindow").src= ("https://drive.google.com/uc?export=view&id=" + subximg);
    viewedSubxi = true;
}

function switchBladder() {
    newLocation = "Pelvic";
    document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
    document.getElementById("activeWindow").src= ("https://drive.google.com/uc?export=view&id=" + bladderimg);
    viewedBladder = true;
}

function switchLungr() {
    newLocation = "Lung (R)";
    document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
    document.getElementById("activeWindow").src= ("https://drive.google.com/uc?export=view&id=" + lungrimg);
    viewedLungR = true;
}

function switchLungl() {
    newLocation = "Lung (L)";
    document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
    document.getElementById("activeWindow").src= ("https://drive.google.com/uc?export=view&id=" + lunglimg);
    viewedLungL = true;
}

//location button control
$(document).ready(function () {
	$('button').on('click', function() {
    $(this).addClass('active');
  });
});



function record_time(){
  localStorage.minutes = document.getElementById("minutes").innerHTML;
  localStorage.seconds = $('#seconds').html()}

function record_views() {
  if (viewedRUQ) {viewcount ++;}
  if (viewedLUQ) {
    viewcount ++;}
  if (viewedSubxi) {
    viewcount ++;}
  if (viewedBladder) {
    viewcount ++;}
  if (viewedLungL) {
    viewcount ++;}
  if (viewedLungR) {
    viewcount ++;}
  localStorage.Case1ViewScore = viewcount;
//  console.log("View Count: "+viewcount);
}

//Action Buttons Here
function actionObs() {
    localStorage.case1Action = "Observation";
    localStorage.case1Outcome = outcomeObs;
 //   console.log("Action: " + localStorage.case1Action);
    record_time();
    record_views();
    doga("case","finish_case","Obs");
    window.location.href = "Outcome1.html";
}


function actionCT() {
    localStorage.case1Action = "CT Scan";
    localStorage.case1Outcome = outcomeCT;
 //   console.log("Action: " + localStorage.case1Action);
    record_time();
    record_views();
    doga("case","finish_case","CT");
    window.location.href = "Outcome1.html";
}

function actionSurg() {
    localStorage.case1Action = "Surgery";
    localStorage.case1Outcome = outcomeSurg;
 //   console.log("Action: " + localStorage.case1Action);
    record_time();
    record_views();
    doga("case","finish_case","Surg");
    window.location.href = "Outcome1.html";
}

function actionIntervene() {
    localStorage.case1Action = "Intervention";
    localStorage.case1Outcome = outcomeInt;
 //   console.log("Action: " + localStorage.case1Action);
    record_time();
    record_views();
    doga("case","finish_case","Int");
    window.location.href = "Outcome1.html";
}

//more secure way of updating this data with the user directly from firebase. 

var db = firebase.firestore();

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    var file_path = '/users/' + user.uid+ '/sessions';
    var docref = db.collection(file_path).doc()
docref.set({
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
})

    console.log('hello user', user.uid)
  }
  else {
    // User is signed out.
    console.log('no user apparently')
  }
})



