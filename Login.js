// TEST DATA
// Email: Ultra@UltraEM.com
// Password: UltraEM1

// LOGIN
//-> Login Form: verify email and password, redirect or throw errors
$('#loginForm').submit(function() {
    loginUser($('#loginEmail').val(), $('#loginPassword').val());
  });
  
  function loginUser(email, pwd) {
    firebase.auth().signInWithEmailAndPassword(email, pwd).then(function(user) {
      //Store userId as local storage to 
      localStorage.userId = (firebase.auth().currentUser.uid);
      window.location.replace("./Main%20UI.html");
  
      // Idea: Make the re-direct an independant listener function that triggers when the user state changes (In Progress below)
    }, function(error) {
      //Idea: Make 'Login' button clickable only once valid Email & PW input
      printErrorMessage(error, email, pwd)
    });
  }
  
  //-> Back to Login button: show Login Form
  $('.backToLoginButton').click(function() {
    $('#signUpForm').hide();
    $('#forgotPasswordForm').hide();
    $('#loginForm').show();
    return false;
  });
  
  // FORGOT PASSWORD
  //-> Forgot Password button: hide/show Forgot Password Form
  $('#forgotPasswordButton').click(function() {
    $('#signUpForm').hide();
    $('#loginForm').hide();
    $('#forgotPasswordForm').show();
  });
  
  //-> Send Login Link button: verify email, placeholder-send email or throw errors, then return to Login Form
  $('#forgotPasswordForm').submit(function() {
    sendLoginLink($('#loginLinkEmail').val());
  });
  
  function sendLoginLink(email) {
    firebase.auth().sendPasswordResetEmail(email).then(function() {
  
      //Idea: add 'toast' message to confirm login link was sent
  
      $("#forgotPasswordForm input[type=email]").val('');
    }).catch(function(error) {
      //Idea: Make 'Send Login Link' button clickable only once valid Email input
      printErrorMessage(error, email)
    });
  }
  
  // SIGN UP
  //-> Sign Up button: hide/show Sign Up Form
  $('#signUpButton').click(function() {
    $('#forgotPasswordForm').hide();
    $('#loginForm').hide();
    $('#signUpForm').show();
  });
  
  //-> Create Account button: validate email and password, redirect or throw errors
  $('#signUpForm').submit(function() {
    signUpUser($('#signUpEmail').val(), $('#signUpPassword').val(), $('#signUpConfirmPassword').val());
  });
  
  function signUpUser(email, pwd, re_pwd) {
    // Ensure password and re_password match
    if (pwd != re_pwd) {
      alert("Passwords do not match.");
    } else {
      // Register the user with the Firebase API (NOTE: auto logs in)
      firebase.auth().createUserWithEmailAndPassword(email, pwd).then(function(userCredential) {
        var db = firebase.firestore();
        user = firebase.auth().currentUser
        localStorage.userId = (user.uid);
        //There's a much better way to do this using node.js, but for now this at least works. 
        db.collection('users').doc(user.uid).set({email: user.email}).then( function(user) {window.location.replace("./Main%20UI.html")});
      }, function(error) {
        printErrorMessage(error, email, pwd, re_pwd)
      })
    }
  }

  
  // ERROR MESSAGES
  function printErrorMessage(error, email, pwd, re_pwd) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  
    // Idea: Make new div outside of grid that floats in the middle of page and is used to display error and toast messages
    // Idea: Get specific error messages from JSON
  
    // Specific error messages
    if (email == "") {
      alert("Email required");
    } else if (pwd == "") {
      alert("Password must be filled out")
    } else if (errorCode === 'auth/user-not-found') {
      alert("The email you entered doesn't belong to an account. Please check your email and try again.")
    } else if (errorCode === 'auth/email-already-exists') {
      alert("The email you entered is not available.")
    } else if (errorCode === 'auth/invalid-email') {
      alert("The email you entered couldn't be verified. Please check your email and try again.")
    } else if (errorCode === 'auth/wrong-password') {
      alert("Sorry, your password was incorrect. Please double-check your password.")
    } else {
      alert("Error: " + errorMessage);
    }
  }
  
  //If login success, user = currentUSer, redirect to current live App landing page
  // firebase.auth().onAuthStateChanged(function(user) {
  //  if (user) {
  //    // If user is signed in, redirect to Ultra EM app
  //    window.location.replace("https://ultraem.netlify.app/");
  //  } else {
  // Placeholder for Logout condition, i.e., no user active
  //  }
  //});
  
  // Upon window loading, assign current user
  //window.onload = (event) => {
  //  var user = firebase.auth().currentUser;
  //};
  

