
//Connect to the firestore
var db = firebase.firestore();
var time_score;
//var view_score;
var decision_score = 0;
var isUserIdPresent = false;
var isUserCorrectOnCase = false;
var cPoints_correctAction = 400; // Int - Points awarded for the correct action
var cPoint_incorrectAction = 100; // Int - Points awarded for the incorrect action

var rememberBoxLink = "#";
var actionTakenIconLink = "#";
let userData = {};
let isReviewingACase = false;

function populateUserData(onPopulationComplete){
    if (isReviewingACase){
        console.log("Populating user data from review Data");
        userData = JSON.parse(localStorage.reviewData) ;
    }else{
        console.log("Populating user data from localStorage");
        userData = {
            caseTitle : localStorage.case1Title.trim(),
            keyLoc : localStorage.case1KeyLoc.trim(),
            userAction : localStorage.case1Action.trim(),
            cAction : localStorage.case1KeyAction.trim(),
            caseKeyImg : localStorage.case1KeyImg.trim(),
            caseOutcome : localStorage.case1Outcome.trim(),
            min : parseInt(localStorage.minutes) ,
            sec : parseInt(localStorage.seconds) ,
            v_score : parseInt(localStorage.vScore) ,
        }
        if (localStorage.userId){
            userData.userId = localStorage.userId.trim()
        }else {console.log("User is not logged in");}
        //Remember box shows the correct action the user should have taken\
        switch(userData.cAction) {
            case "Observation":
                userData.rememberBox = '../ProgramFiles/RememberBoxes/Light/RememberObs.svg'
                break;
            case "CT Scan":
                userData.rememberBox = '../ProgramFiles/RememberBoxes/Light/RememberCT.svg';
                break;
            case "Surgery":
                userData.rememberBox = '../ProgramFiles/RememberBoxes/Light/RememberSurg.svg';
                break;
            case "Intervention":
                userData.rememberBox = '../ProgramFiles/RememberBoxes/Light/RememberInt.svg';
                break;
            default:
                throw new Error("This case does not have a record of the correct action the user should have taken");
        }
        // Action logo shows the action the user choose
        switch (userData.userAction) {
            case "Observation":
                userData.actionIcon = '../ProgramFiles/Icons/obs.png';
                break;
            case "CT Scan":
                userData.actionIcon = '../ProgramFiles/Icons/ctScan.png';
                break;
            case "Surgery":
                userData.actionIcon = '../ProgramFiles/Icons/surg.png';
                break;
            case "Intervention":
                userData.actionIcon = '../ProgramFiles/Icons/intervention.png';
                break;
            default:
                throw new Error("No record of the action the user performed");
        }
        rememberBoxLink = userData.rememberBox; actionTakenIconLink = userData.actionIcon;
        // scoring
        userData.time_score = -0.5 * (userData.min * 60) + userData.sec ;
        userData.view_score = 20 * (userData.v_score);
        isUserCorrectOnCase = userData.userAction === userData.cAction;
        userData.decisionScore = (isUserCorrectOnCase) ? cPoints_correctAction : cPoint_incorrectAction ;
        userData.totalScore = userData.decisionScore + userData.view_score + userData.time_score;
    }
    localStorage.case1Score = userData.totalScore;
    onPopulationComplete(); // Callback
}
/**
 * {
 *     case1Title : localStorage
 * }
 */
function recordUserSessionData(){
    console.log("Recording session data ");
    // Check if the csData list data structure exists.
    if (!isReviewingACase){
        // then save the user data
        if (localStorage.cSData){
            console.log("user session data is already being tracked");
            let data = JSON.parse(localStorage.cSData);
            data.push(userData);
            localStorage.cSData = JSON.stringify(data);
        }else{
            console.log("no user data has been tracked so far, start tracking");
            localStorage.cSData = JSON.stringify([userData]);
        }
    }
}
/**
 * Shows the case diagnosis, displays the FAST scan for the area the user is supposed to focus on
 * Shows the explanation for the case, caseOutcome.
 */
function displayExplanation() {
    // DISPLAY EXPLANATION | DIAGNOSIS | KEYIMAGE
    document.getElementById("explanation").innerText = (userData.caseOutcome);
    document.getElementById("diagnosis").innerText = (`Case : ${userData.caseTitle}` );
    document.getElementById("keyImage").src = `../caseData/${userData.caseKeyImg}.gif`;
    // DISPLAY RESULT OF ACTION
    if (userData.decisionScore === cPoints_correctAction)
    {
        document.getElementById("result").innerText = "Success!!";
        if (isUserIdPresent){
            var file_path = '/users/' + localStorage.userId + '/Actions/' + localStorage.case1KeyAction
            docRef = db.doc(file_path)
            addScore(docRef, 'correct')
        }else{
            console.log("No user id - not saving user case actions to db");
        }
    }
    else {
        document.getElementById("result").innerText = "Uh Oh...";
        if (isUserIdPresent){
            var file_path = '/users/' + localStorage.userId + '/Actions/' + localStorage.case1KeyAction
            docRef = db.doc(file_path)
            addScore(docRef, 'incorrect')
        }else{
            console.log("No user id - not saving user case actions to db");
        }
    }
    // DISPLAY ACTION TAKEN
    document.getElementById("action").innerHTML = userData.userAction;
    document.getElementById("explanation").innerText = userData.caseOutcome;
    document.getElementById("actionicon").src = userData.actionIcon;
    document.getElementById("rememberBox").src = userData.rememberBox;
    // DISPLAY SCORES
    $('#decPoints1').text(userData.decisionScore);
    $('#imgPoints1').text(userData.view_score);
    $('#timePoints1').text(userData.time_score);
    $('#totalPoints1').text(userData.totalScore);
    $('#c1points').text(userData.totalScore + " Points");
    // RECORD USER ACTION TO DB - AND SESSION STORAGE
    if (isUserIdPresent){
        //go to the sessions collection for current user
        var file_path = '/users/' + localStorage.userId + '/sessions'
        //add a session doc with random generated id and set timestamp to now
        collectionRef = db.collection(file_path);
        //get the most recent session
        var sessionID;
        collectionRef.orderBy('timestamp', 'desc').limit(1).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data())
                globalThis.sessionID = doc.id
                console.log(sessionID + 'session')
                session_file_path = '/users/' + localStorage.userId + '/sessions'
                var sessionRef = db.collection(session_file_path).doc(sessionID)
                sessionRef.update({
                    case_count: 1,
                    session_score: time_score + decision_score + view_score,
                    possible_points: 400
                })
                // get the session ID, go to the cases there. Set the case number and the score
                var session_file_path = '/users/' + localStorage.userId + '/sessions/' + sessionID + '/cases'
                // this works, but it feels bad
                db.collection(session_file_path).doc('case1').set({
                    score: time_score + decision_score + view_score,
                    case_number: parseInt(localStorage.caseNum)
                })
                var user_file_path = '/users'
                var correct = localStorage.case1Action === localStorage.case1KeyAction
                if (correct) {
                    db.collection(user_file_path).doc(localStorage.userId).update({
                        total_correct: firebase.firestore.FieldValue.increment(1),
                        total_score: firebase.firestore.FieldValue.increment(time_score + decision_score + view_score),
                        total_cases: firebase.firestore.FieldValue.increment(1),
                        total_possible_points: firebase.firestore.FieldValue.increment(400)
                    })
                } else {
                    db.collection(user_file_path).doc(localStorage.userId).update({
                        total_score: firebase.firestore.FieldValue.increment(time_score + decision_score + view_score),
                        total_cases: firebase.firestore.FieldValue.increment(1),
                        total_possible_points: firebase.firestore.FieldValue.increment(400)
                    })
                }
            });
        });
    }
    else{
        console.log("No user id - could not save user session data");
    }
    recordUserSessionData();
}
function checkIfUidPresent(){
    if (localStorage.userId){
        isUserIdPresent = true;
    }else{
        isUserIdPresent = false;
    }
    displayExplanation();
}
function addScore(docRef, status) {

    // In a transaction, add the new rating and update the aggregate totals
    return db.runTransaction((transaction) => {
        return transaction.get(docRef).then((result) => {
            if (!result.exists) {
                throw "Document does not exist!";
            }
            // Compute new number of ratings
            if (!result.data().hasOwnProperty('KeyActionCount')) {
                var KeyActionCount = 1;

            } else {
                var KeyActionCount = result.data().KeyActionCount + 1;
            }
            // Compute new average rating

            if (status == 'correct') {
                if (!result.data().hasOwnProperty('Correct')) {
                    var correctCount = 1
                } else {
                    var correctCount = result.data().Correct
                    correctCount++
                }
            } else {
                var correctCount = result.data().Correct
            }
            var percentCorrect = correctCount / KeyActionCount;

            // Commit to Firestore
            transaction.update(docRef, {
                Correct: correctCount,
                KeyActionCount: KeyActionCount,
                percentCorrect: percentCorrect
            });
        });
    });
}
function progressNextCase() {
    window.location.replace('MainUI.html');
}
function retryCase(){
    localStorage.retry = true;
    console.log("Retry Case is enabled.");
    // Correction for casesDone tracking
    if (localStorage.casesDoneList) {
        let casesDone = JSON.parse(localStorage.casesDoneList);
        casesDone.pop(); // remove the most recent case added.
        localStorage.casesDoneList = JSON.stringify(casesDone);
    } else {
        throw new Error('Cases Done list should have populated');
    }
    // Correction for shift review tracking
    if (localStorage.cSData){
        let csData = JSON.parse(localStorage.cSData);
        csData.pop(); // remove the most recent case added.
        localStorage.cSData = JSON.stringify(csData);
    }
    window.location.replace('MainUI.html');
}
async function checkPreviousNavigationPoint() {
    // localStorage.review is set in the shift review script.
    if (localStorage.review === undefined){
        localStorage.review = false;
    }

    if(JSON.parse(localStorage.review) === true ){
        console.log('localStorage.review is true. Reviewing case from shift review');
        if (localStorage.reviewData){
            // Use the data here for the page display purposes.
            isReviewingACase = true;
        }
        localStorage.review = false; // reset flag
        populateUserData(checkIfUidPresent)
    }
    else{
        console.log('localStorage.review is false. Continue as usual');
        populateUserData(checkIfUidPresent)
    }
}
// MAIN ENTRY POINT
$(document).ready(async function () {
    await checkPreviousNavigationPoint();
});