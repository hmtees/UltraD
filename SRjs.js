
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

shiftpoints = +localStorage.case1Score + +localStorage.case2Score + +localStorage.case3Score + +localStorage.case4Score + +localStorage.case5Score;
$('#shiftpoints').text(shiftpoints);

//If click shift review, clear local localStorage
$("#new-shift").click(function() {
  console.log('starting new shift, clearing storage');
    localStorage.clear();
    

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