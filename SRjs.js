
//Code for toggling
$("#toggle-chart").click(function() {
    $(".chart").toggle();
  });
  
//Display the localStorage of the first 5 cases  
$('#case1').text(localStorage.case1Title);
$('#case2').text(localStorage.case2Title);
$('#case3').text(localStorage.case3Title);
$('#case4').text(localStorage.case4Title);
$('#case5').text(localStorage.case5Title);
$('#case1KeyLoc').text(localStorage.case1KeyLoc);
$('#case2KeyLoc').text(localStorage.case2KeyLoc);
$('#case3KeyLoc').text(localStorage.case3KeyLoc);
$('#case4KeyLoc').text(localStorage.case4KeyLoc);
$('#case5KeyLoc').text(localStorage.case5KeyLoc);
$('#score1').text(localStorage.case1Score);
$('#score2').text(localStorage.case2Score);
$('#score3').text(localStorage.case3Score);
$('#score4').text(localStorage.case4Score);
$('#score5').text(localStorage.case5Score);

//Firestore Code updates this
//shiftpoints = +localStorage.case1Score + +localStorage.case2Score + +localStorage.case3Score + +localStorage.case4Score + +localStorage.case5Score;
//$('#shiftpoints').text(shiftpoints);

//If click shift review, clear local localStorage
$("#new-shift").click(function() {
  console.log('starting new shift, clearing storage');
    localStorage.clear();
    

  });


//hide shift review links if no data for those shifts yet.
// Copied from Stack overflow to implement string format function
//https://stackoverflow.com/questions/20729823/jquery-string-format-issue-with-0
String.prototype.format = function() {
  var str = this;
  for (var i = 0; i < arguments.length; i++) {       
    var reg = new RegExp("\\{" + i + "\\}", "gm");             
    str = str.replace(reg, arguments[i]);
  }
  return str;
}

for (var i = 1; i <= 5;i++ ){
  if (localStorage.getItem('case{0}Score'.format(i)) === null) {
  $('#case{0}review'.format(i)).toggle();
  }
}


var file_path = '/users/' + localStorage.userId +'/sessions'
var db = firebase.firestore();

collectionRef = db.collection(file_path);

collectionRef.orderBy('timestamp', 'desc').limit(1).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // get the session ID, go to the cases there. Set the case number and the score
        globalThis.sessionID = doc.id
        var session_file_path = '/users/' + localStorage.userId +'/sessions'
        sessionRef = db.collection(session_file_path).doc(sessionID)
        // get session data
        sessionRef.get().then((doc)=>{
          var session_data = doc.data()
      //    console.log(session_data.session_score)
          $('#shift-score').text(session_data.session_score)
        //  console.log(session_data.case_count)
          $('#case-count').text(session_data.case_count)
          $('#Accuracy').text(session_data.session_score/session_data.case_count)
          
        })
 
      })  
    });

function RandomLoc() {
  var locLinks = [
    "Location-RUQ.html",
    "Location-LUQ.html",
    "Location-Subxi.html",
    "Location-Bladder.html",
    "Location-Lung.html"
  ];
  var max = (locLinks.length)
  var randomNumber = Math.floor(Math.random()*max);
  var link = locLinks[randomNumber];
  window.location.href = link;
}

function ShowRandomLoc() {
  var locNames = [
    "Right Upper Quadrant",
    "Left Upper Quadrant",
    "Subxiphoid",
    "Bladder",
    "Lungs"
  ];
  var max = (locNames.length);
  var randomNumber = Math.floor(Math.random()*max);
  var ReviewLoc = locNames[randomNumber];
  document.getElementById("ReviewLocation").innerHTML =ReviewLoc;
  if (ReviewLoc === "Right Upper Quadrant") 
    {document.getElementById("rLocLink").href ="./Location-RUQ.html"};
  if (ReviewLoc === "Left Upper Quadrant") 
    {document.getElementById("rLocLink").href ="./Location-LUQ.html"};
  if (ReviewLoc === "Subxiphoid") 
    {document.getElementById("rLocLink").href ="./Location-Subxi.html"};
  if (ReviewLoc === "Bladder") 
    {document.getElementById("rLocLink").href ="./Location-Bladder.html"};
  if (ReviewLoc === "Lungs") 
    {document.getElementById("rLocLink").href ="./Location-Lung.html"};

}

function ShowRandomAxn() {
  var axnNames = [
    "Observation",
    "CT Scan",
    "Surgery",
    "Intervention"
  ];
  var max = (axnNames.length);
  var randomNumber = Math.floor(Math.random()*max);
  var ReviewAxn = axnNames[randomNumber];
  document.getElementById("ReviewAction").innerHTML =ReviewAxn;
  if (ReviewAxn === "Observation") 
    {document.getElementById("rAxnLink").href ="./ActionInfo-Obs.html"};
  if (ReviewAxn === "CT Scan") 
    {document.getElementById("rAxnLink").href ="./ActionInfo-CT.html"};
  if (ReviewAxn === "Surgery") 
    {document.getElementById("rAxnLink").href ="./ActionInfo-Surgery.html"};
  if (ReviewAxn === "Intervention") 
    {document.getElementById("rAxnLink").href ="./ActionInfo-Intervene.html"};

}

function ShowReviews() {
  ShowRandomLoc();
  ShowRandomAxn();
}

function RandomAxn() {
  var axnLinks = [
    "ActionInfo-Obs.html",
    "ActionInfo-CT.html",
    "ActionInfo-Surgery.html",
    "ActionInfo-Intervene.html",
  ];
  var max = (axnLinks.length)
  var randomNumber = Math.floor(Math.random()*max);
  var link = axnLinks[randomNumber];
  window.location.href = link;
}

//The code below is used to build a chart from the data in the table
function BuildChart(labels, values, chartTitle) {
  var ctx = document.getElementById("progressChart").getContext('2d');
  var progressChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels, // x-axis labels, in this table that would be the Case #
      datasets: [{
        label: chartTitle, // Name the series
        data: values, // Values to be plotted, in this table that will be the student's scores
        backgroundColor: [ // Specify custom colors
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [ // Add custom color borders
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 0 // Specify bar border width
      }]
    },
    options: {
      responsive: true, // Instruct chart js to respond nicely.
      maintainAspectRatio: false, // Add to prevent default behavior of full-width/height 
    }
  });
  return progressChart;
}

var table = document.getElementById('progressTable');
var json = []; // First row needs to be headers 
var headers = [];
for (var i = 0; i < table.rows[0].cells.length; i++) {
  headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
}

// Go through cells 
for (var i = 1; i < table.rows.length; i++) {
  var tableRow = table.rows[i];
  var rowData = {};
  for (var j = 0; j < tableRow.cells.length; j++) {
    rowData[headers[j]] = tableRow.cells[j].innerHTML;
  }

  json.push(rowData);
}

// Map JSON values back to label array
var labels = json.map(function(e) {
  return e.case;
});

// Map JSON values back to values array
var values = json.map(function(e) {
  return e.score;
});

var chart = BuildChart(labels, values, "Shift Score Progress");
