var db = firebase.firestore();

//display case title & Key Image
document.getElementById("diagnosis").innerText = ("Case 4: " + localStorage.case4Title);
document.getElementById("keyImage").src = ("https://drive.google.com/uc?export=view&id=" + localStorage.case4KeyImg);
var time_score = -1*( parseInt(localStorage.minutes)*60 + parseInt(localStorage.seconds));
var view_score = 20*( (localStorage.Case4ViewScore));

//Show Result
if (localStorage.case4Action === localStorage.case4KeyAction)
    {
        document.getElementById("result").innerText = "Success!!";
        var decision_score =400;
        var file_path = '/users/' + localStorage.userId + '/Actions/' + localStorage.case4KeyAction
        docRef = db.doc(file_path)
        addScore(docRef, 'correct')

    }
    else {
        document.getElementById("result").innerText = "Uh Oh...";
        var decision_score =100;
        var file_path = '/users/' + localStorage.userId + '/Actions/' + localStorage.case4KeyAction
        docRef = db.doc(file_path)
        addScore(docRef, 'incorrect')

    }
//Show Action Taken
document.getElementById("action").innerHTML = localStorage.case4Action;
//console.log("You Chose: " + localStorage.case4Action);
//console.log("Key Action: " + localStorage.case4KeyAction);
    //display image matching action
if (localStorage.case4Action === "Observation")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/obs.png'}

if (localStorage.case4Action === "CT Scan")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/ctScan.png'}

if (localStorage.case4Action === "Surgery")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/surg.png'}

if (localStorage.case4Action === "Intervention")
    {document.getElementById("actionicon").src= './ProgramFiles/Icons/intervention.png'}
//display Explanation
document.getElementById("explanation").innerText = (localStorage.case4Outcome);

//Show correct Remember Box
if (localStorage.case4KeyAction === "Observation")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberObs.svg'};

if (localStorage.case4KeyAction === "CT Scan")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberCT.svg'};

if (localStorage.case4KeyAction === "Surgery")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberSurg.svg'};

if (localStorage.case4KeyAction === "Intervention")
    {document.getElementById("rememberBox").src= './ProgramFiles/RememberBoxes/Light/RememberInt.svg'};
//Score Calculator
$('#decPoints4').text(decision_score);
$('#imgPoints4').text(view_score);
$('#timePoints4').text(time_score);
localStorage.case4Score = time_score + decision_score+ view_score;
$('#totalPoints4').text(time_score+decision_score+ view_score);
$('#c4points').text(time_score+decision_score+view_score+" Points");

var sessionID;
var file_path = '/users/' + localStorage.userId +'/sessions'

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
            session_score : firebase.firestore.FieldValue.increment(time_score+decision_score+view_score),
            possible_points : firebase.firestore.FieldValue.increment(400)
        });
        // get the session ID, go to the cases there. Set the case number and the score
        var session_file_path = '/users/' + localStorage.userId +'/sessions/' + sessionID +'/cases'
        // this works, but it feels bad
        db.collection(session_file_path).doc('case4').set({
            score : time_score+decision_score+view_score,
            case_number : parseInt(localStorage.caseNum)
        })  
        var user_file_path = '/users'
        var correct = localStorage.case4Action === localStorage.case4KeyAction
        if (correct){
            db.collection(user_file_path).doc(localStorage.userId).update({
                total_correct: firebase.firestore.FieldValue.increment(1),
                total_score: firebase.firestore.FieldValue.increment(time_score+decision_score+view_score),
                total_cases: firebase.firestore.FieldValue.increment(1),
                total_possible_points: firebase.firestore.FieldValue.increment(400)
            }) 
        }else{
        db.collection(user_file_path).doc(localStorage.userId).update({
            total_score: firebase.firestore.FieldValue.increment(time_score+decision_score+view_score),
            total_cases: firebase.firestore.FieldValue.increment(1),
            total_possible_points: firebase.firestore.FieldValue.increment(400)
        })  
    } 
    });

})
function addScore(docRef, status) {

    // In a transaction, add the new rating and update the aggregate totals
    return db.runTransaction((transaction) => {
        return transaction.get(docRef).then((result) => {
            if (!result.exists) {
                throw "Document does not exist!";
            }
            // Compute new number of ratings
            if (!result.data().hasOwnProperty('KeyActionCount')){
                var KeyActionCount =  1;

            }else{
                var KeyActionCount = result.data().KeyActionCount + 1;
            }
            // Compute new average rating

            if ( status == 'correct'){
                if (!result.data().hasOwnProperty('Correct')){
                    var correctCount = 1
                }
                else{var correctCount = result.data().Correct
                    correctCount ++
                    console.log('is this the problem' + correctCount)
                }
            }else {var correctCount = result.data().Correct}
            var percentCorrect = correctCount / KeyActionCount;

            // Commit to Firestore
            transaction.update(docRef, {
                Correct: correctCount,
                KeyActionCount: KeyActionCount,
                percentCorrect : percentCorrect
            });
        });
    });
}