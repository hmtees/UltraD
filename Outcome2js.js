//display case title & Key Image
document.getElementById("diagnosis").innerText = ("Case 2: " + localStorage.case2Title);
document.getElementById("keyImage").src = ("http://drive.google.com/uc?export=view&id=" + localStorage.case2KeyImg);

var time_score = -1*( parseInt(localStorage.minutes)*60 + parseInt(localStorage.seconds));
console.log(time_score);
//Show Result
//Show correct Remember Box
if (localStorage.case2Action === localStorage.case2KeyAction)
    {
        document.getElementById("result").innerText = "Success!!";
        var decision_score =400;
    }
    else {
        document.getElementById("result").innerText = "Uh Oh...";
        var decision_score =100;
    }
//Show Action Taken
document.getElementById("action").innerHTML = localStorage.case2Action;
console.log("You Chose: " + localStorage.case2Action);
console.log("Key Action: " + localStorage.case2KeyAction);
    //display image matching action
    //document.getElementById("actionIcon").src = ();
if (localStorage.case2Action === "Observation")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/obs.png'}

if (localStorage.case2Action === "CT Scan")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/ctScan.png'}

if (localStorage.case2Action === "Surgery")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/surg.png'}

if (localStorage.case2Action === "Intervention")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/intervention.png'}
//display Explanation
document.getElementById("explanation").innerText = (localStorage.case2Outcome);



//Show correct Remember Box
if (localStorage.case2KeyAction === "Observation")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberObs.svg'}
if (localStorage.case2KeyAction === "CT Scan")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberCT.svg'}
if (localStorage.case2KeyAction === "Surgery")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberSurg.svg'}
if (localStorage.case2KeyAction === "Intervention")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberInt.svg'}
//Score Calculator


//Score Calculator
$('#decPoints1').text(decision_score);

$('#timePoints1').text(time_score);
localStorage.case2Score = time_score + decision_score;
$('#totalPoints1').text(time_score+decision_score);
$('#c2points').text(time_score+decision_score+" Points");
