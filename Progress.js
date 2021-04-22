$(document).ready(function() {

    $('#LeftLungImage').hide()
    $('#RightLungImage').hide()
    $('#SubXImage').hide()
    $('#RUQImage').hide()
    $('#LUQImage').hide()
    $('#BladderImage').hide()
  
    $('#lLungicon').hover(function() {
      $('#LeftLungImage').show()
    }, function() {
      $('#LeftLungImage').hide()
    })
  
    $('#rLungicon').hover(function() {
      $('#RightLungImage').show()
    }, function() {
      $('#RightLungImage').hide()
    })
  
    $('#subxicon').hover(function() {
      $('#SubXImage').show()
    }, function() {
      $('#SubXImage').hide()
    })
  
    $('#ruqicon').hover(function() {
      $('#RUQImage').show()
    }, function() {
      $('#RUQImage').hide()
    })
  
    $('#luqicon').hover(function() {
      $('#LUQImage').show()
    }, function() {
      $('#LUQImage').hide()
    })
  
    $('#bladdericon').hover(function() {
      $('#BladderImage').show()
    }, function() {
      $('#BladderImage').hide()
    })
  
  });

var file_path = '/users/'
var db = firebase.firestore();


//showing User Stats
userRef = db.collection(file_path).doc(localStorage.userId)
        // get session data
userRef.get().then((doc)=>{
  var user_data = doc.data()
 // console.log(user_data.total_score)
  var accuracy = ((user_data.total_correct/user_data.total_cases)*100).toFixed(2)+'%'
  $('#accuracy').html(accuracy)
  //console.log(user_data.total_cases)
  $('#case-count').text(user_data.total_cases)
  $('#total-score').text(user_data.total_score)
  $('#score-average').text(user_data.total_score/user_data.total_cases)
});

var file_path_actions = '/users/' + localStorage.userId +'/Actions';
//console.log(file_path_actions);
db.collection(file_path_actions).get()
.then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
    console.log('#' + doc.id + ' percent_correct: ' + (doc.data().percentCorrect)*100);
    id = doc.id.replace(/\s+/g, '');
    percentCorrect = (doc.data().percentCorrect*100).toFixed(0) + '%'
    $("[name="+id+"]").text(percentCorrect)
  })
});

db.collection(file_path_actions).orderBy('percentCorrect').limit(1)
.get()
.then((querySnapshot)=>{
  querySnapshot.forEach((doc)=>{
    $('#missedActionText').html(doc.id);
    if(doc.id == 'CT Scan'){
      $('#missedActionLink').attr('href','ActionInfo-CT.html')
 //     console.log("Most Missed: "+doc.id)
    }else if(doc.id == 'Intervention'){
      $('#missedActionLink').attr('href','ActionInfo-Intervene.html')
 //     console.log("Most Missed: "+doc.id)
    }else if (doc.id == 'Observation'){
      $('#missedActionLink').attr('href','ActionInfo-Obs.html')
  //    console.log("Most Missed: "+doc.id)
    }else if (doc.id == 'Surgery'){ 
    $('#missedActionLink').attr('href','ActionInfo-Surgery.html')
  //  console.log("Most Missed: "+doc.id)
    }
  })
}
);

function ShowRandomLoc() {
  var locNames = [
    "Right Upper Quadrant",
    "Left Upper Quadrant",
    "Subxiphoid",
    "Bladder",
    "Lungs"
  ];
  var max = (locNames.length);
  var randomNumber = Math.floor(Math.random()*max);
  var ReviewLoc = locNames[randomNumber];
  document.getElementById("ReviewLocation").innerHTML =ReviewLoc;
  if (ReviewLoc === "Right Upper Quadrant") 
    {document.getElementById("rLocLink").href ="./Location-RUQ.html"};
  if (ReviewLoc === "Left Upper Quadrant") 
    {document.getElementById("rLocLink").href ="./Location-LUQ.html"};
  if (ReviewLoc === "Subxiphoid") 
    {document.getElementById("rLocLink").href ="./Location-Subxi.html"};
  if (ReviewLoc === "Bladder") 
    {document.getElementById("rLocLink").href ="./Location-Bladder.html"};
  if (ReviewLoc === "Lungs") 
    {document.getElementById("rLocLink").href ="./Location-Lung.html"};

}