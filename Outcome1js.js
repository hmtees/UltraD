//display case title & Key Image
document.getElementById("diagnosis").innerText = ("Case 1: " + localStorage.case1Title);
document.getElementById("keyImage").src = ("http://drive.google.com/uc?export=view&id=" + localStorage.case1KeyImg);

var time_score = -1*( parseInt(localStorage.minutes)*60 + parseInt(localStorage.seconds));
console.log("time score: " + time_score);
//Show Result
if (localStorage.case1Action === localStorage.case1KeyAction)
    {
        document.getElementById("result").innerText = "Success!!";
        var decision_score =400;
    }
    else {
        document.getElementById("result").innerText = "Uh Oh...";
        var decision_score =100;
    }
//Show Action Taken
document.getElementById("action").innerHTML = localStorage.case1Action;
console.log("You Chose: " + localStorage.case1Action);
console.log("Key Action: " + localStorage.case1KeyAction);
    //display image matching action
    //document.getElementById("actionIcon").src = ();
if (localStorage.case1Action === "Observation")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/obs.png'}

if (localStorage.case1Action === "CT Scan")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/ctScan.png'}

if (localStorage.case1Action === "Surgery")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/surg.png'}

if (localStorage.case1Action === "Intervention")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/intervention.png'}
//display Explanation
document.getElementById("explanation").innerText = (localStorage.case1Outcome);

//Show correct Remember Box
if (localStorage.case1KeyAction === "Observation")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberObs.svg'};

if (localStorage.case1KeyAction === "CT Scan")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberCT.svg'};

if (localStorage.case1KeyAction === "Surgery")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberSurg.svg'};

if (localStorage.case1KeyAction === "Intervention")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberInt.svg'};
//Score Calculator
console.log(decision_score);
$('#decPoints1').text(decision_score);

$('#timePoints1').text(time_score);
localStorage.case1Score = time_score + decision_score;
$('#totalPoints1').text(time_score+decision_score);
$('#c1points').text(time_score+decision_score+" Points");

