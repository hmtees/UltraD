//display case title & Key Image
document.getElementById("diagnosis").innerText = ("Case 3: " + localStorage.case3Title);
document.getElementById("keyImage").src = ("https://drive.google.com/uc?export=view&id=" + localStorage.case3KeyImg);

var time_score = -1*( parseInt(localStorage.minutes)*60 + parseInt(localStorage.seconds));
var view_score = 20*( (localStorage.Case1ViewScore));

console.log(time_score);
//Show Result
if (localStorage.case3Action === localStorage.case3KeyAction)
    {
        document.getElementById("result").innerText = "Success!!";
        //give 400 points
        var decision_score =400;
    }
    else {
        document.getElementById("result").innerText = "Uh Oh...";
        //give 100 points
        var decision_score =100;
    }
//Show Action Taken
document.getElementById("action").innerHTML = localStorage.case3Action;
console.log("You Chose: " + localStorage.case3Action);
console.log("Key Action: " + localStorage.case3KeyAction);
    //display image matching action
    //document.getElementById("actionIcon").src = ();
if (localStorage.case3Action === "Observation")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/obs.png'}

if (localStorage.case3Action === "CT Scan")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/ctScan.png'}

if (localStorage.case3Action === "Surgery")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/surg.png'}

if (localStorage.case3Action === "Intervention")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/intervention.png'}
//display Explanation
document.getElementById("explanation").innerText = (localStorage.case3Outcome);

//Show correct Remember Box
if (localStorage.case3KeyAction === "Observation")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberObs.svg'};

if (localStorage.case3KeyAction === "CT Scan")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberCT.svg'};

if (localStorage.case3KeyAction === "Surgery")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberSurg.svg'};
    
if (localStorage.case3KeyAction === "Intervention")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberInt.svg'};
//Score Calculator
$('#decPoints3').text(decision_score);
$('#imgPoints3').text(view_score);
$('#timePoints3').text(time_score);
localStorage.case3Score = time_score + decision_score+ view_score;
$('#totalPoints3').text(time_score+decision_score+ view_score);
$('#c3points').text(time_score+decision_score+view_score+" Points");

var sessionID;
var file_path = '/users/' + localStorage.userId +'/sessions'
var db = firebase.firestore();

collectionRef = db.collection(file_path);

collectionRef.orderBy('timestamp', 'desc').limit(1).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data())
        globalThis.sessionID = doc.id
        console.log(sessionID + 'session')
        session_file_path = '/users/' + localStorage.userId + '/sessions'
        var sessionRef = db.collection(session_file_path).doc(sessionID)
        sessionRef.update({
            case_count: firebase.firestore.FieldValue.increment(1),
            session_score : firebase.firestore.FieldValue.increment(total_score),
            possible_points : firebase.firestore.FieldValue.increment(400)
        });
        // get the session ID, go to the cases there. Set the case number and the score
        var session_file_path = '/users/' + localStorage.userId +'/sessions/' + sessionID +'/cases'
        // this works, but it feels bad
        db.collection(session_file_path).doc('case3').set({
            score : total_score,
            case_number : parseInt(localStorage.caseNum)
        })
        var user_file_path = '/users'
        db.collection(user_file_path).doc(localStorage.userId).update({
            total_score: firebase.firestore.FieldValue.increment(total_score),
            total_cases: firebase.firestore.FieldValue.increment(1),
            total_possible_points: firebase.firestore.FieldValue.increment(400)
        })    
    });

})