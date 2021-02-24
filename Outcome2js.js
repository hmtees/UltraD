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

var sessionID;
var file_path = '/users/' + localStorage.userId +'/sessions'
//add a session doc with random generated id and set timestamp to now

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
            session_score : firebase.firestore.FieldValue.increment(time_score+decision_score),
            possible_points : firebase.firestore.FieldValue.increment(400)
        });
        // get the session ID, go to the cases there. Set the case number and the score
        var session_file_path = '/users/' + localStorage.userId +'/sessions/' + sessionID +'/cases'
        // this works, but it feels bad
        db.collection(session_file_path).doc('case2').set({
            score : time_score + decision_score,
            case_number : parseInt(localStorage.caseNum)
        }) 
        var user_file_path = '/users'
        db.collection(user_file_path).doc(localStorage.userId).update({
            total_score: firebase.firestore.FieldValue.increment(time_score+decision_score),
            total_cases: firebase.firestore.FieldValue.increment(1),
            total_possible_points: firebase.firestore.FieldValue.increment(400)
        })   
    });

})
$('#c2points').text(time_score+decision_score+" Points");

