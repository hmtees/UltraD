var JSONFEED = 'https://spreadsheets.google.com/feeds/list/1dpcguZ2Ak0zc0Sh1WoPV0c0tXVxre3yGWC1Wo5ElWtc/1/public/basic?alt=json';

$(document).ready(function() {
  $.ajax({
    url: JSONFEED,
    success: function(data) {
      readData(data);
    }
  });
});

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
  //console.log(length2)
  var caseList = JSON.parse(localStorage.caseList)
  // if the retry button was clicked, this will be true and then it will skip
  //the new case assignment
  if (localStorage.retry=='true'){
    i = localStorage.caseNum
    localStorage.retry = false
  } 
  //otherwise assign new case number
  else {
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
  localStorage.caseList = JSON.stringify(caseList)
}
  localStorage.caseNum = i;
  console.log("Case No: "+i);
  //console.log(i, ':i');
    var JSONrow = partfeed[i].content.$t.split(',');
    var row = [];
   // console.log('the Current Case Data is: ' + JSONrow);
    for (var j = 0; j < JSONrow.length; j++) {
      val = JSONrow[j].split(':')[1];
      row[j] = val;
    	title = row[0];
    }
      drawDiv(row, title, "#caseDetails");
    
  }


function drawDiv(divData, thehistory, parent) {
  if (divData == null) return null;

  localStorage.case4Title = title;
//  console.log("Case 4: " + localStorage.case4Title);
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
  localStorage.case4KeyImg = keyImg;
  keyLocation = $.trim(divData[21]);
  keyAction = $.trim(divData[22]);
  localStorage.case4KeyAction = keyAction;
 // console.log("Key Action: " + localStorage.case4KeyAction);
  localStorage.case4KeyLoc = keyLocation;
  
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

let sec = 0;
function pad(val) {return val > 9 ? val : "0" + val;}
let timer = setInterval(function () {
    document.getElementById("seconds").innerHTML = pad(++sec % 60);
    document.getElementById("minutes").innerHTML = pad(parseInt(sec/60, 10));
}, 1000);

setTimeout(function () {
    clearInterval(timer);}, 999999);

function record_time(){
  localStorage.minutes = document.getElementById("minutes").innerHTML;
  localStorage.seconds = $('#seconds').html()
}

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
  localStorage.Case4ViewScore = viewcount;
 // console.log("View Count: "+viewcount);
}


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

//Action Buttons Here
function actionObs() {
    localStorage.case4Action = "Observation";
    localStorage.case4Outcome = outcomeObs;
 //   console.log("Action: " + localStorage.case4Action);
    doga("case","finish_case","Obs");
    window.location.href = "Outcome4.html";
    record_time(); 
    record_views();
}


function actionCT() {
    localStorage.case4Action = "CT Scan";
    localStorage.case4Outcome = outcomeCT;
  //  console.log("Action: " + localStorage.case4Action);
    doga("case","finish_case","CT");
    window.location.href = "Outcome4.html";
    record_time(); 
    record_views();
}

function actionSurg() {
    localStorage.case4Action = "Surgery";
    localStorage.case4Outcome = outcomeSurg;
  //  console.log("Action: " + localStorage.case4Action);
  doga("case","finish_case","Surg");  
  window.location.href = "Outcome4.html";
    record_time(); 
    record_views();
}

function actionIntervene() {
    localStorage.case4Action = "Intervention";
    localStorage.case4Outcome = outcomeInt;
  //  console.log("Action: " + localStorage.case4Action);
    doga("case","finish_case","Int"); 
    window.location.href = "Outcome4.html";
    record_time();
    record_views();
}
