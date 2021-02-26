var JSONFEED = 'https://spreadsheets.google.com/feeds/list/1dpcguZ2Ak0zc0Sh1WoPV0c0tXVxre3yGWC1Wo5ElWtc/1/public/basic?alt=json';

$(document).ready(function() {
  $.ajax({
    url: JSONFEED,
    success: function(data) {
      readData(data);
    }
  });
});

function readData(data) {
  var partfeed = data.feed.entry;
  var divData = [];
  var length2 = Object.keys(partfeed).length-1;
  //console.log(length2)
  var i = 0 + Math.floor(Math.random() * length2);
    var JSONrow = partfeed[i].content.$t.split(',');
    var row = [];
   // console.log('the Current Case Data is: ' + JSONrow);
    for (var j = 0; j < JSONrow.length; j++) {
      val = JSONrow[j].split(':')[1];
      row[j] = val;
    if (i !== 0) {
    	title = row[0];
    }
    }
      drawDiv(row, title, "#caseDetails");
    
  }


function drawDiv(divData, thehistory, parent) {
  if (divData == null) return null;

  console.log("Case: " + title);
  localStorage.case3Title = title;
  console.log("Case 3: " + localStorage.case3Title);
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
  localStorage.case3KeyImg = keyImg;
  keyLocation = $.trim(divData[21]);
  keyAction = $.trim(divData[22]);
  localStorage.case3KeyAction = keyAction;
  console.log("Key Action: " + localStorage.case3KeyAction);
  localStorage.case3KeyLoc = keyLocation;
  
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

/*
function showActions() {
    let x = document.getElementById("actionBox");
    if (viewedRUQ,viewedLUQ,viewedSubxi,viewedBladder,viewedLungR,viewedLungL === true) {
        x.style.display = "block";}
    else {x.style.display = "none";}
}
showActions();
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
  localStorage.Case3ViewScore = viewcount;
  console.log("View Count: "+viewcount);
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
    localStorage.case3Action = "Observation";//want to store this choice and reference it later (in Albo)
    localStorage.case3Outcome = outcomeObs;
    console.log("Action: " + localStorage.case3Action);
        //something about using cookies & enabling samesite -- error seen bc developing on client side. Might look different when deployed.
    window.location.href = "Outcome3.html";
    record_time(); 
    record_views();
}


function actionCT() {
    localStorage.case3Action = "CT Scan";
    localStorage.case3Outcome = outcomeCT;
    console.log("Action: " + localStorage.case3Action);
    window.location.href = "Outcome3.html";
    record_time(); 
    record_views();
}

function actionSurg() {
    localStorage.case3Action = "Surgery";
    localStorage.case3Outcome = outcomeSurg;
    console.log("Action: " + localStorage.case3Action);
    window.location.href = "Outcome3.html";
    record_time(); 
    record_views();
}

function actionIntervene() {
    localStorage.case3Action = "Intervention";
    localStorage.case3Outcome = outcomeInt;
    console.log("Action: " + localStorage.case3Action);
    window.location.href = "Outcome3.html";
    record_time(); 
    record_views();
}
