/*
TO-DO
Check for sign-in on Review Shift, Progress Report, Next Case links
    Send to signup if not signed in
*/

//Connect to the firestore
var db = firebase.firestore();
var time_score;
var view_score;
var decision_score = 0;
var isUserIdPresent = false;
var isUserCorrectOnCase = false;
var cPoints_correctAction = 400; // Int - Points awarded for the correct action
var cPoint_incorrectAction = 100; // Int - Points awarded for the incorrect action

var rememberBoxLink = "#";
var actionTakenIconLink = "#";

function recordUserSessionData(){
    console.log("Recording session data ");
    let tmpData = {
        totalScore : (time_score + decision_score + view_score),
        cTitle : localStorage.case1Title,
        keyLoc : localStorage.case1KeyLoc,
        userAction : localStorage.case1Action,
        case1KeyImg : "https://drive.google.com/uc?export=view&id=" + localStorage.case1KeyImg.trim(),
        case1Outcome : localStorage.case1Outcome,
        rememberBox : rememberBoxLink,
        actionIcon : actionTakenIconLink,
    }
    // Check if the csData list data structure exists.
    if (localStorage.cSData){
        console.log("user session data is already being tracked");
        let data = JSON.parse(localStorage.cSData);
        data.push(tmpData);
        localStorage.cSData = JSON.stringify(data);
    }else{
        console.log("no user data has been tracked so far, start tracking");
        // TODO : create new object - record data - create and add to list
        localStorage.cSData = JSON.stringify([tmpData]);
    }
}

function displayActionTaken(){
    //Show Action Taken
    document.getElementById("action").innerHTML = localStorage.case1Action;
    //display Explanation
    document.getElementById("explanation").innerText = (localStorage.case1Outcome);
    // Figure out the action icon to display
    let actionTmp = ""; let actionTakenIcon = localStorage.case1Action.trim();
    if (actionTakenIcon === "Observation") {
        actionTmp = '../ProgramFiles/Icons/obs.png';
    }else
    if (actionTakenIcon === "CT Scan") {
        actionTmp = '../ProgramFiles/Icons/ctScan.png';
    } else
    if (actionTakenIcon === "Surgery") {
        actionTmp = '../ProgramFiles/Icons/surg.png';
    } else
    if (actionTakenIcon === "Intervention") {
        actionTmp = '../ProgramFiles/Icons/intervention.png';
    }
    document.getElementById("actionicon").src = actionTmp;
    actionTakenIconLink = actionTmp; // will be saved to session data later =
    let remLinkTmp = "";
    //Show correct Remember Box
    let correctAction = localStorage.case1KeyAction.trim();
    if (correctAction === "Observation") {
        remLinkTmp = '../ProgramFiles/RememberBoxes/Light/RememberObs.svg';
    }else
    if (correctAction === "CT Scan") {
        remLinkTmp = '../ProgramFiles/RememberBoxes/Light/RememberCT.svg';
    }else
    if (correctAction === "Surgery") {
        remLinkTmp = '../ProgramFiles/RememberBoxes/Light/RememberSurg.svg';
    }else
    if (correctAction === "Intervention") {
        remLinkTmp = '../ProgramFiles/RememberBoxes/Light/RememberInt.svg';
    }
    document.getElementById("rememberBox").src = remLinkTmp;
    rememberBoxLink = remLinkTmp;

    //Score Calculator
    //console.log(decision_score);
    $('#decPoints1').text(decision_score);
    $('#imgPoints1').text(view_score);
    $('#timePoints1').text(time_score);
    localStorage.case1Score = time_score + decision_score + view_score;
    $('#totalPoints1').text(time_score + decision_score + view_score);
    $('#c1points').text(time_score + decision_score + view_score + " Points");

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
        recordUserSessionData();
    }
    else{
        console.log("No user id - could not save user session data");
        recordUserSessionData();
    }

}
function calculateDecisionScoreAndDisplay() {
    if (localStorage.case1Action === localStorage.case1KeyAction) {
        isUserCorrectOnCase = true; decision_score = cPoints_correctAction;
        document.getElementById("result").innerText = "Success!!";
        if (isUserIdPresent){
            var file_path = '/users/' + localStorage.userId + '/Actions/' + localStorage.case1KeyAction
            docRef = db.doc(file_path)
            addScore(docRef, 'correct')
        }else{
            console.log("No user id - not saving user case actions to db");
        }
    } else {
        isUserCorrectOnCase = false; decision_score = cPoint_incorrectAction;
        document.getElementById("result").innerText = "Uh Oh...";
        if (isUserIdPresent){
            var file_path = '/users/' + localStorage.userId + '/Actions/' + localStorage.case1KeyAction
            docRef = db.doc(file_path)
            addScore(docRef, 'incorrect')
        }else{
            console.log("No user id - not saving user case actions to db");
        }
    }
    displayActionTaken();
}
function getTimeAndVScore(){
    let min = parseInt(localStorage.minutes) ;
    let sec = parseInt(localStorage.seconds) ;
    let vScore = parseInt(localStorage.vScore) ;
    time_score = -1 * (min * 60) + sec;
    view_score = 20 * (vScore);
}

/**
 * Shows the case diagnosis, displays the FAST scan for the area the user is supposed to focus on
 * Shows the explanation for the case, caseOutcome.
 */
function displayExplanation() {
    document.getElementById("explanation").innerText = (localStorage.case1Outcome);
    //display case title & Key Image
    document.getElementById("diagnosis").innerText = ("Case : " + localStorage.case1Title);
    document.getElementById("keyImage").src = `../caseData/${localStorage.case1KeyImg.trim()}.gif`;
    getTimeAndVScore();
    calculateDecisionScoreAndDisplay();
}
function checkIfUidPresent(){
    if (localStorage.userId){
        isUserIdPresent = true;
    }else{
        isUserIdPresent = false;
    }
    displayExplanation();
}
//Function for adding the correct or incorrect actions to the database
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
async function addUserActionsToSessionHistory() {
    console.log("Tracking user action history");
    /**
     * case_history = {
     *     case1KeyImg : ,
     *     case1KeyLoc : ,
     *     case1KeyAction : ,
     *     case1Title : ,
     *     case1Action : ,
     *     case1Outcome : ,
     *     minutes : ,
     *     seconds : ,
     *     case1ViewScore : ,
     *     case1Score : ,
     * }
     * TODO - Add this to the list of user actions.
     * TODO - Remember to deque the session addition when a user retries.
     */
}
function progressNextCase() {
    window.location.replace('MainUI.html');
}
function sameCase() {
    localStorage.retry = true
    // since user if retrying, remove this case from cases done 
    if (localStorage.casesDoneList) {
        let casesDone = JSON.parse(localStorage.casesDoneList);
        casesDone.pop(); // remove the most recent case added. 
        localStorage.casesDoneList = JSON.stringify(casesDone);
    } else {
        throw new Error('Cases Done list should have populated');
    }
    window.location.replace('MainUI.html');
}

async function checkPreviousNavigationPoint() {
    /**
     * Check localstorage.review. Usually set from mainUi script before navigation to page. goToOutcome()
     */
    if (localStorage.review === null){
        console.log('LocalStorage.review is not set up yet');
    }else if(localStorage.review ){
        console.log('localStorage.review is true. Reviewing case from shift review');
        // TODO : Check the localStorage.reviewData as well before displaying the data.
        // TODO : If this flag is true and the data is not there then throw an error, alert the user, navigate to the shift review page. - Might have to this about this.
        localStorage.review = false; // reset flag
        checkIfUidPresent(); //TODO : Change such that outcome page shows the information from the shift review page.
        // TODO : Gather data needed and supply it from the localstorage.reviewData
        // TODO : Under shift review provide this data from localStorage.reviewData = localStorage.csData[index]
        // TODO before navigation from the shift review page when clicked
        // TODO : Change event listener for the on click for the list to a function - this function will set localstorage.review and localStorage.reviewData
        // TODO : Outcome page should show this and reset the data objects (2)

    }else{
        // set up and reviewing
        console.log('localStorage.review is false. Continue as usual');
        checkIfUidPresent();
    }
}

/**
 * Main Entry point to the script. First check the previous navigation point to
 * know what data to show on the screen.
 */
$(document).ready(async function () {
    await checkPreviousNavigationPoint();
});