$("#signup").click(function() {
    $("#first").fadeOut("fast", function() {
    $("#second").fadeIn("fast");
    });
    });
    
    $("#signin").click(function() {
    $("#second").fadeOut("fast", function() {
    $("#first").fadeIn("fast");
    });
    });
    
    
       /*      $(function() {
               $("form[name='login']").validate({
                 rules: {
                   
                   email: {
                     required: true,
                     email: true
                   },
                   password: {
                     required: true,
                     
                   }
                 },
                  messages: {
                   email: "Please enter a valid email address",
                  
                   password: {
                     required: "Please enter password",
                    
                   }
                   
                 },
                 submitHandler: function(form) {
                   form.submit();
                 }
               });
             });
             
    
    */
    $(function() {
      
      $("form[name='registration']").validate({
        rules: {
          firstname: "required",
          lastname: "required",
          email: {
            required: true,
            email: true
          },
          password: {
            required: true,
            minlength: 5
          }
        },
        
        messages: {
          firstname: "Please enter your first name",
          lastname: "Please enter your last name",
          password: {
            required: "Please provide a password",
            minlength: "Your password must be at least 5 characters long"
          },
          email: "Please enter a valid email address"
        },
      
        submitHandler: function(form) {
          form.submit();
        }
      });
    });
    
//-> Create Account button: validate email and password, redirect or throw errors
$('#signUpForm').submit(function() {
  signUpUser($('#signUpFirst').val(), $('#signUpLast').val(), $('#signUpEmail').val(), $('#signUpPassword').val(), $('#signUpConfirmPassword').val(), $('#signUpsignUpSchool').val(), $('#signUpsignUpGradYear').val())
});

var firstname=signUpUser($('#signUpFirst'));
var lastname=signUpUser($('#signUpLast'));
var email=signUpUser($('#signUpEmail'));
var school=signUpUser($('#signUpSchool'));
var gradyear=signUpUser($('#signUpGradYear'));


function signUpUser(firstname,lastname, email, pwd, re_pwd, school, gradyear) {
  // Ensure password and re_password match
  if (pwd != re_pwd) {
    alert("Passwords do not match.");
  } else {
    // Register the user with the Firebase API (NOTE: auto logs in)
    firebase.auth().createUserWithEmailAndPassword(email,pwd).then(function(userCredential) {
      var db = firebase.firestore();
      user = userCredential.User;
      localStorage.userId = (user.uid);
      console.log("New User: "+localStorage.userId);
      console.log()
      //There's a much better way to do this using node.js, but for now this at least works. 
      db.collection('users').doc(user.uid).set({email: user.email})
      db.collection('users').doc(user.uid).collection('Actions').doc('Surgery').set({Correct:0})
      db.collection('users').doc(user.uid).collection('Actions').doc('CT Scan').set({Correct:0})
      db.collection('users').doc(user.uid).collection('Actions').doc('Intervention').set({Correct:0})
      db.collection('users').doc(user.uid).collection('Actions').doc('Observation').set({Correct:0}).then( function(user) {window.location.replace("./Main%20UI.html")});
    }, function(error) {
      printErrorMessage(error, email, pwd, re_pwd)
    })
  }
}
