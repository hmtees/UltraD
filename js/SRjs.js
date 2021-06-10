// Script Variables
const outComeDetailPage = "Outcome.html";
let caseCounter = 1;

// Script Functions
function preSet() {
    String.prototype.format = function () {
        var str = this;
        for (var i = 0; i < arguments.length; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            str = str.replace(reg, arguments[i]);
        }
        return str;
    }
    for (var i = 1; i <= 5; i++) {
        if (localStorage.getItem('case{0}Score'.format(i)) === null) {
            $('#case{0}review'.format(i)).toggle();
        }
    }
    var file_path = '/users/' + localStorage.userId + '/sessions'
    var db = firebase.firestore();
    collectionRef = db.collection(file_path);
    collectionRef.orderBy('timestamp', 'desc').limit(1).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // get the session ID, go to the cases there. Set the case number and the score
            globalThis.sessionID = doc.id
            var session_file_path = '/users/' + localStorage.userId + '/sessions'
            sessionRef = db.collection(session_file_path).doc(sessionID)
            // get session data
            sessionRef.get().then((doc) => {
                var session_data = doc.data()
                //    console.log(session_data.session_score)
                $('#shift-score').text(session_data.session_score)
                //  console.log(session_data.case_count)
                $('#case-count').text(session_data.case_count)
                $('#Accuracy').text(session_data.session_score / session_data.case_count)

            })

        })
    });
}
//The code below is used to build a chart from the data in the table
function BuildChart(labels, values, chartTitle) {
    var ctx = document.getElementById("progressChart").getContext('2d');
    var progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // x-axis labels, in this table that would be the Case #
            datasets: [{
                label: chartTitle, // Name the series
                data: values, // Values to be plotted, in this table that will be the student's scores
                backgroundColor: [ // Specify custom colors
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [ // Add custom color borders
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 0 // Specify bar border width
            }]
        },
        options: {
            responsive: true, // Instruct chart js to respond nicely.
            maintainAspectRatio: false, // Add to prevent default behavior of full-width/height
        }
    });
    return progressChart;
}

/**
 * Given the list of user actions on cases and display a
 * list of a summary of actions for cases taken by the user
 * @param detailsList : A list with each object having the following fields
 * {
 *     totalScore : Int -> view score + title score + decision score,
        cTitle : String -> case tile,
        keyLoc : String -> Case key location on body ,
        userAction : String -> Action the user made on case,
 * }
 */
function shiftReviewMain(detailsList,) {
    // Get fixed element from html
    let tableBody = document.getElementById("table_body");
    // Iterate list and display summary for each user
    let totalPoints = 0; let counter = 1;
    let progressLabels = []; let progressValues=[] ; // labels => represents case #, values => the score per case
    detailsList.forEach(function (detail) {
        // create row element
        let tableRowElement = document.createElement("tr");
        // create data elements
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");
        let td5 = document.createElement("td");
        // add data to data elements
        td1.innerText = String(caseCounter);
        caseCounter++; // col case num
        td2.innerText = detail.totalScore; // col 2  Score
        td3.innerText = detail.cTitle; // col 3 Case title
        td4.innerText = detail.keyLoc // col 4 case key location
        totalPoints += parseInt(detail.totalScore);
        // add hyperlink to outcome to user action column. linking back to outcome page
        let td5a = document.createElement("a")
        td5a.setAttribute("href", outComeDetailPage);
        td5a.innerText = detail.userAction; // col 5 case key action
        td5.appendChild(td5a);
        // add data to rows
        tableRowElement.appendChild(td1);
        tableRowElement.appendChild(td2);
        tableRowElement.appendChild(td3);
        tableRowElement.appendChild(td4);
        tableRowElement.appendChild(td5);
        // add row to table
        tableBody.appendChild(tableRowElement);
        // each row represents a case performed by the user.
        progressLabels.push(counter++); progressValues.push(parseInt(detail.totalScore));
    });
    let sfScoreListElement = document.getElementById('shift-score');
    let caseCount = document.getElementById('case-count');
    let avg = document.getElementById('Accuracy');
    let avgPoints = totalPoints / detailsList.length;
    sfScoreListElement.innerText = `${String(totalPoints)} points`;
    caseCount.innerText = `${String(detailsList.length)}`;
    avg.innerText = `${parseInt(avgPoints)} points.`;
    // Build out the progress chart
    BuildChart(progressLabels,progressValues, "Progress Chat");
}

async function shiftReviewNew(){
    await shiftReviewResetTasks();
    window.location.replace("MainUI.html");
}
async function shiftReviewResetTasks(){
    // Reset the localstorage
    let localStorageKeyList = ["case1Title", "cSData", "case1KeyAction", "case1Score", "vScore", "case1Action",
        "case1KeyImg", "case1Outcome", "caseNum",
        "casesDoneList", "case1KeyLoc", "minutes", "seconds", "caseIdList", "nTotalCases"]
    console.log("Clearing local storage");
    localStorageKeyList.forEach(function(key){
        localStorage.removeItem(key);
        // resetting for the next session;
    });
}
// EVENT HANDLERS
function goToProgressReport() {  window.location.replace('ProgressReport.html');  }
function continueReview(){ window.location.replace("MainUI.html"); }

/**
 * Main Entry point for the Shift Review Script
 */
$(document).ready(async function () {
    if (localStorage.cSData) {
        shiftReviewMain(JSON.parse(localStorage.cSData));
    } else {
        alert("No Shift Data. No case data recorded for user.");
        window.location.replace('MainUI.html');
    }
});

