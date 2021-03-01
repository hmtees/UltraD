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
  console.log(user_data.total_score)
  $('#accuracy').text(user_data.total_score/user_data.total_possible_points)
  console.log(user_data.total_cases)
  $('#case-count').text(user_data.total_cases)
  $('#total-score').text(user_data.total_score)
});
  