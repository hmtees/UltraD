
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
          console.log(session_data.session_score)
          $('#shift-score').text(session_data.session_score)
          console.log(session_data.case_count)
          $('#case-count').text(session_data.case_count)
          $('#Accuracy').text(session_data.session_score/session_data.possible_points)
          
        })
 
      })  
    });


  function dropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }