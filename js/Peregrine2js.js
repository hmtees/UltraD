var JSONFEED = 'https://spreadsheets.google.com/feeds/list/1dpcguZ2Ak0zc0Sh1WoPV0c0tXVxre3yGWC1Wo5ElWtc/1/public/basic?alt=json';

//GA Setup
function doga(category, action, label) {
  console.log('did GA');
  console.log(category, action, label);
  gtag('event', 'click', {
    'event_category': category,
    'event_action': action, 
    'event_label': label,
  });
}

$(document).ready(function() {
  $.ajax({
    url: JSONFEED,
    success: function(data) {
      readData(data);
    }
  });
});
var user

function readData(data) {
  var casesFeedSheets = data.feed.entry;
  var n_Columns = Object.keys(casesFeedSheets).length;
  var choosenCaseIndex = 0;
  var casesDoneList = []; 

  console.log("CASES JSON KEYS");
  console.log(Object.keys(casesFeedSheets))
  console.log(casesFeedSheets);
  console.log("Length of Keys in part feed : " + n_Columns);

  if (localStorage.casesDoneList){
      console.log("TEST - Case list is populated in local storage");
      casesDoneList = JSON.parse(localStorage.casesDoneList); // Reading from local storage
      console.log(`Cases Done  \n : ${casesDoneList}`);
  }else{
      console.log("TEST - Case list is not populated. No cases are recorded for this session.");
  }
  if (localStorage.retry && localStorage.retry == 'true'){
    choosenCaseIndex = localStorage.caseNum;
  } else {
    choosenCaseIndex = Math.floor(Math.random() * n_Columns);
    localStorage.retry = "false";
    // Keep checking for a case that is not in the casesDoneList
    while (casesDoneList.indexOf( choosenCaseIndex )!== -1 )
    {
      if (casesDoneList.length >= casesFeedSheets.length){ // FEED
        alert("you've done all of the cases");
        casesDoneList = []
        choosenCaseIndex = 0 + Math.floor(Math.random() * n_Columns);
        break
      }else{
        choosenCaseIndex = 0 + Math.floor(Math.random() * n_Columns);
      }
    }
    casesDoneList.push(choosenCaseIndex) // Mark this cases as done
    // TODO - Maybe push this logic to when a user has actual submitted an action 
    // TODO - Track if user completes the case
    localStorage.casesDoneList = JSON.stringify(casesDoneList); // Writing to local storage
}
  localStorage.caseNum = choosenCaseIndex;
  console.log("Case No: " + choosenCaseIndex);
  var JSONrow = casesFeedSheets[choosenCaseIndex].content.$t.split(',');
  var row = [];
  for (var j = 0; j < JSONrow.length; j++) {
    val = JSONrow[j].split(':')[1];
    row[j] = val;
    title = row[0];
  }
  drawDiv(row, title, "#caseDetails"); // Display the data on the MAINUI Page
  }


function drawDiv(divData, thehistory, parent) {
  if (divData == null) return null;

  localStorage.case2Title = title;
 // console.log("Case 2: " + localStorage.case2Title);
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
  localStorage.case2KeyImg = keyImg;
  keyLocation = $.trim(divData[21]);
  keyAction = $.trim(divData[22]);
  localStorage.case2KeyAction = keyAction;
 // console.log("Key Action: " + localStorage.case2KeyAction);
  localStorage.case2KeyLoc = keyLocation
  
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
*/
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
  localStorage.Case2ViewScore = viewcount;
//  console.log("View Count: "+viewcount);
}


function switchLUQ() {
  newLocation = "Left Upper Quadrant";
  document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
  document.getElementById("activeWindow").src= ("https://drive.google.com/uc?export=view&id=" + luqimg);
  document.getElementById("luqicon").src=("../ProgramFiles/Icons/checked.png")
  viewedLUQ = true;
}

function switchRUQ() {
  newLocation = "Right Upper Quadrant";
  document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
  document.getElementById("activeWindow").src= ("https://drive.google.com/uc?export=view&id=" + ruqimg);
  document.getElementById("ruqicon").src=("../ProgramFiles/Icons/checked.png")
  viewedRUQ = true;
}

function switchSubxi() {
  newLocation = "Subxiphoid";
  document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
  document.getElementById("activeWindow").src= ("https://drive.google.com/uc?export=view&id=" + subximg);
  document.getElementById("subxicon").src=("../ProgramFiles/Icons/checked.png")
  viewedSubxi = true;
}

function switchBladder() {
  newLocation = "Pelvic";
  document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
  document.getElementById("activeWindow").src= ("https://drive.google.com/uc?export=view&id=" + bladderimg);
  document.getElementById("bladdericon").src=("../ProgramFiles/Icons/checked.png")
  viewedBladder = true;
}

function switchLungr() {
  newLocation = "Lung (R)";
  document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
  document.getElementById("activeWindow").src= ("https://drive.google.com/uc?export=view&id=" + lungrimg);
  document.getElementById("rLungicon").src=("../ProgramFiles/Icons/checked.png")
  viewedLungR = true;
}

function switchLungl() {
  newLocation = "Lung (L)";
  document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
  document.getElementById("activeWindow").src= ("https://drive.google.com/uc?export=view&id=" + lunglimg);
  document.getElementById("lLungicon").src=("../ProgramFiles/Icons/checked.png")
  viewedLungL = true;
}

//Action Buttons Here
function actionObs() {
    localStorage.case2Action = "Observation";
    localStorage.case2Outcome = outcomeObs;
    doga("case","finish_case","Obs");
  //  console.log("Action: " + localStorage.case2Action);
    window.location.href = "Outcome2.html";
    record_time(); 
    record_views();
}


function actionCT() {
    localStorage.case2Action = "CT Scan";
    localStorage.case2Outcome = outcomeCT;
  //  console.log("Action: " + localStorage.case2Action);
    doga("case","finish_case","CT");
    window.location.href = "Outcome2.html";
    record_time(); 
    record_views();
}

function actionSurg() {
    localStorage.case2Action = "Surgery";
    localStorage.case2Outcome = outcomeSurg;
  //  console.log("Action: " + localStorage.case2Action);
  doga("case","finish_case","Surg"); 
  window.location.href = "Outcome2.html";
    record_time(); 
    record_views();
}

function actionIntervene() {
    localStorage.case2Action = "Intervention";
    localStorage.case2Outcome = outcomeInt;
 //   console.log("Action: " + localStorage.case2Action);
  doga("case","finish_case","Int");   
  window.location.href = "Outcome2.html";
    record_time(); 
    record_views();
}
