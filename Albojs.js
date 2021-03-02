/*things to do
show remember image on hover
display action info on Action pages
display location info on location pages
display cases on progress report
show actual score from each case

 //should these be separate js functions? would it help continuity having 1 big sheet or can things be referenced?
*/

//displaying Location Info
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