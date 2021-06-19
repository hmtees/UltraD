let choosenCaseIndex = 0;
let casesDoneList = [];
let caseIdChosen = null;
var user
// Tracking # of views the user clicked on in a case sessions .
var viewcount = 0;
var viewedRUQ = false;
var viewedLUQ = false;
var viewedSubxi = false;
var viewedBladder = false;
var viewedLungL = false;
var viewedLungR = false;
//more secure way of updating this data with the user directly from firebase. 
var db = firebase.firestore();

//GA Setup
function doga(category, action, label) {
    console.log('did GA');
    console.log(category, action, label);
    gtag('event', 'click', {
        'event_category': category,
        'event_action': action,
        'event_label': label,
    });
}

const random = async (min, max) => Math.floor(Math.random() * (max - min)) + min;

async function getRandomCases() {
    let random_n = 0;
    let arr = []
    random_n = await random(0, parseInt(localStorage.nTotalCases));

    if (localStorage.casesDoneList) {
        arr = JSON.parse(localStorage.casesDoneList);
        if (arr.length < parseInt(localStorage.nTotalCases)) {
            let arrSet = new Set(arr);
            while (arrSet.has(random_n)) {
                random_n = await random(0, parseInt(localStorage.nTotalCases));
            }
        } else {
            alert("All cases are done all the cases. Resetting tracking");
        }
    }
    return random_n;
}

async function getCasesFromDB() {
    let db = firebase.firestore();
    const casesRef = db.collection('Cases');
    const allCases = await casesRef.get();
    let allCasesArr = [];
    allCases.forEach(function (doc) {
        // doc.data() -> for the data
        allCasesArr.push(doc.id);
    });
    return new Promise((resolve) => {
        resolve(allCasesArr);
    });
}

async function getIndex() {
    // just in case this is the first time user gets to page
    if (localStorage.retry === undefined){
        localStorage.retry = false;
    }
    // check if we are retrying a case from outcome page
    let isUserRetryingCase = JSON.parse(localStorage.retry);
    if ( isUserRetryingCase) {
        localStorage.retry = false;
        return localStorage.caseNum;
    }else{
        return await getRandomCases();
    }
}

async function populateCase() {
    await getCasesFromDB().then(
        async function (casesArr) {

            localStorage.nTotalCases = String(casesArr.length);
            localStorage.caseIdList = JSON.stringify(casesArr);
            console.log('Number of cases ' + casesArr.length);
            choosenCaseIndex = await getIndex();
            console.log("Case index " + choosenCaseIndex);
            caseIdChosen = casesArr[choosenCaseIndex];
            localStorage.setItem('caseNum', String(choosenCaseIndex));
            console.log(`Case_index=${choosenCaseIndex} , case_id=${casesArr[choosenCaseIndex]}`);

            const casesRef = firebase.firestore().collection('Cases').doc(caseIdChosen);
            const doc = await casesRef.get();

            if (!doc.exists) {
                console.log('No such document!');
            } else {
                var data = doc.data()
                await drawDivWithObj(data);
            }
        });
}

async function main() {
    await populateCase();
}


function markCaseDone() {
    if (localStorage.casesDoneList) {
        // use the existing one
        console.log("DEBUG : Case list exists");
        casesDoneList = JSON.parse(localStorage.casesDoneList);
    } else {
        // create a new one
        console.log("DEBUG : Case list does not exist");
        casesDoneList = [];
    }
    // Add this case to the list
    casesDoneList.push(parseInt(choosenCaseIndex))
    // Add the list to local Storage
    console.log("Writing cases done list to local storage");
    localStorage.casesDoneList = JSON.stringify(casesDoneList); // Writing to local storage
}

// divData is an object with the case
async function drawDivWithObj(caseObj, parent, loc) {
    if (caseObj == null) return null;
    console.log("Case: " + caseObj["title"]);
    localStorage.case1Title = caseObj["title"];
    //console.log(`TEST : CASE OBJECT ${JSON.stringify(caseObj)}` );
    scenario = caseObj["history"];
    age = caseObj["age"];
    gender = caseObj["sex"];
    tempc = caseObj["t"];
    tempf = caseObj["tf"];
    bpsys = caseObj["bps"];
    bpdia = caseObj["bpd"];
    hr = caseObj["hr"];
    oxy = caseObj["spo2"];
    outcomeObs = caseObj["observationoutcome"];
    outcomeCT = caseObj["ctoutcome"];
    outcomeSurg = caseObj["surgeryoutcome"];
    outcomeInt = caseObj["interventionoutcome"];
    ruqimg = caseObj["ruq"].trim(); // Need to trim to ensure that no spaces, are translated to %20 and the url is broken. 
    luqimg = caseObj["luq"].trim();
    subximg = caseObj["subxi"].trim();
    bladderimg = caseObj["bladder"].trim();
    lungrimg = caseObj["lungr"].trim();
    lunglimg = caseObj["lungl"].trim();
    keyImg = caseObj["keyimage"].trim();
    localStorage.case1KeyImg = caseObj["keyimage"].trim();
    keyLocation = caseObj["keylocation"];
    localStorage.case1KeyLoc = caseObj["keylocation"];
    console.log("Key Location: " + localStorage.case1KeyLoc);
    keyAction = caseObj["answer"];
    localStorage.case1KeyAction = caseObj["answer"];
    console.log("Key Action: " + localStorage.case1KeyAction);

    var $caseDiv = $("<div/>");
    var casedetails = $("<p></p>").html("A " + age + "-year-old " + gender + " " + scenario);
    $caseDiv.prepend(casedetails);
    $('#caseDetails').append($caseDiv);
    $('#BP').text(bpsys + '/' + bpdia);
    $('#HR').text(hr);
    $('#T').text(tempc + '\u00B0C' + '/' + tempf + '\u00b0F');
    $('#O2').text(oxy);
}
let sec = 0;
function pad(val) {
    return val > 9 ? val : "0" + val;
}
let timer = setInterval(function () {
    document.getElementById("seconds").innerHTML = pad(++sec % 60);
    document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
}, 1000);

setTimeout(function () {
    clearInterval(timer);
}, 999999);



function goToOutcome(){
    console.log("Navigating to outcome");
    localStorage.review = false;
    window.location.replace('Outcome.html');
}

function switchLUQ() {
    newLocation = "Left Upper Quadrant";
    document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
    document.getElementById("activeWindow").src = `../caseData/${luqimg}.gif`;
    document.getElementById("luqicon").src = ("../ProgramFiles/Icons/checked.png")
    viewedLUQ = true;
}
function switchRUQ() {
    newLocation = "Right Upper Quadrant";
    document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
    document.getElementById("activeWindow").src = `../caseData/${ruqimg}.gif`;
    document.getElementById("ruqicon").src = ("../ProgramFiles/Icons/checked.png")
    viewedRUQ = true;
    viewcount++;
}
function switchSubxi() {
    newLocation = "Subxiphoid";
    document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
    document.getElementById("activeWindow").src = `../caseData/${subximg}.gif`;
    document.getElementById("subxicon").src = ("../ProgramFiles/Icons/checked.png")
    viewedSubxi = true;
    viewcount++;
}
function switchBladder() {
    newLocation = "Pelvic";
    document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
    document.getElementById("activeWindow").src =`../caseData/${bladderimg}.gif`;
    document.getElementById("bladdericon").src = ("../ProgramFiles/Icons/checked.png")
    viewedBladder = true;
    viewcount++;
}
function switchLungr() {
    newLocation = "Lung (R)";
    document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
    document.getElementById("activeWindow").src =`../caseData/${lungrimg}.gif`;
    document.getElementById("rLungicon").src = ("../ProgramFiles/Icons/checked.png")
    viewedLungR = true;
    viewcount++;
}
function switchLungl() {
    newLocation = "Lung (L)";
    document.getElementById("currentLocation").innerText = ("Current Location: " + newLocation);
    document.getElementById("activeWindow").src = `../caseData/${lunglimg}.gif`;
    document.getElementById("lLungicon").src = ("../ProgramFiles/Icons/checked.png")
    viewedLungL = true;
    viewcount++;
}

function record_time() {
    localStorage.minutes = parseInt(document.getElementById("minutes").innerHTML);
    localStorage.seconds = parseInt(document.getElementById('seconds').innerHTML);
}

function record_views() {
    localStorage.vScore = viewcount;
}

//Action Buttons Here
function actionObs() {
    markCaseDone()
    localStorage.case1Action = "Observation";
    localStorage.case1Outcome = outcomeObs;
    //   console.log("Action: " + localStorage.case1Action);
    record_time();
    record_views();
    doga("case", "finish_case", "Obs");
    goToOutcome();
}

function actionCT() {
    markCaseDone()
    localStorage.case1Action = "CT Scan";
    localStorage.case1Outcome = outcomeCT;
    //   console.log("Action: " + localStorage.case1Action);
    record_time();
    record_views();
    doga("case", "finish_case", "CT");
    goToOutcome();
}

function actionSurg() {
    markCaseDone()
    localStorage.case1Action = "Surgery";
    localStorage.case1Outcome = outcomeSurg;
    //   console.log("Action: " + localStorage.case1Action);
    record_time();
    record_views();
    doga("case", "finish_case", "Surg");
    goToOutcome();
}

function actionIntervene() {
    markCaseDone()
    localStorage.case1Action = "Intervention";
    localStorage.case1Outcome = outcomeInt;
    //   console.log("Action: " + localStorage.case1Action);
    record_time();
    record_views();
    doga("case", "finish_case", "Int");
    goToOutcome();
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        var file_path = '/users/' + user.uid + '/sessions';
        var docref = db.collection(file_path).doc()
        docref.set({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        console.log('hello user', user.uid)
    } else {
        // User is signed out.
        console.log('no user apparently')
    }
})

$(document).ready(async function () {
    // Script entry point
    await main();
});