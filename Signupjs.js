$( document ).ready(mainDriver);

async function registerUserWithGoogle(signInInfo) {
  // TODO - Make a connection to google and save the information.
  firebase.auth().createUserWithEmailAndPassword(signInInfo.email, signInInfo.password)
      .then((userCredential) => {
        // Signed in
        let user = userCredential.user;
        // store information locally for retrieval later
        localStorage.user = {
          userId : user.uid,
          name : user.displayName,
        };
        console.log("User has been registered and auto logged in. Begin shift");
        // TODO : Now store the user into
        firebase.firestore().collection('users').add(
        {
          firstname: signInInfo.firstName,
          lastname: signInInfo.lastName,
          email: signInInfo.email,
          school: signInInfo.school,
          gradYear: signInInfo.gradYear,
          allowUpdateNotification : signInInfo.allowUpdateNotification,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }
        // TODO How do you add these ?
        // db.collection('users').doc(user.uid).collection('Actions').doc('Surgery').set({Correct:0})
        // db.collection('users').doc(user.uid).collection('Actions').doc('CT Scan').set({Correct:0})
        // db.collection('users').doc(user.uid).collection('Actions').doc('Intervention').set({Correct:0})
        // db.collection('users').doc(user.uid).collection('Actions').doc('Observation').set({Correct:0})
        ).then(function(){
          // Successfully signed in and added the user to the data base
        }).catch(function(error) {
          console.error('Error creating user in database', error);
          // Delete the user from authentication records if database save fails.
          user.delete().then(function(){
            alert("User unable to register. Please try again later");
          });
        });
      })
      .catch((error) => {
        console.error("Unable to create a user authentication record");
        console.error(error.code + " : " + error.message );
      });
}

async function getInfoAndVerify() {
  console.log("Verify submitted information");
  let signUpDetails = {
    firstName: $('#signUpFirst').val(),
    lastName: $('#signUpLast').val(),
    email: $('#signUpEmail').val(),
    password: $('#signUpPassword').val(),
    confirmPassword: $('#signUpConfirmPassword').val(),
    school: $('#signUpSchool').val(),
    gradYear: $('#signUpGradYear').val(),
    allowUpdateNotification : false,
  }
  // Check if the check box is checked. -
  if ($('#emailme').is(":checked")){
    signUpDetails.allowUpdateNotification = true;
    console.log("User opts to remain updated when  you add new cases and material");
  }
  console.log(signUpDetails); // TODO Remove
  let isValid = await verify(signUpDetails);
  if (isValid){
    //TODO : Activate modal - that gives the user the ability to begin shift.
    alert("Ready to begin shift, You are auto logged in ");
    await registerUserWithGoogle(signUpDetails);
  }
}

async function verify(signUpDetailsObj){
  let missing_info = "Please provide the following information. \n"
  let isFirstNameValid, isLastNameValid, isEmailValid, isPassWordValid;
  let isConfirmPassWordValid, isGradYearValid, isSchoolValid;

  if (signUpDetailsObj.firstName !== ""){isFirstNameValid = true;
  }else {missing_info += " First Name , "; isFirstNameValid = false}
  if (signUpDetailsObj.lastName !== ""){isLastNameValid = true;
  }else { missing_info += "Last Name , "; isLastNameValid = false}
  if (signUpDetailsObj.email !== ""){isEmailValid = true;
  }else { missing_info += "Email , "; isEmailValid = false}
  if (signUpDetailsObj.password !== "" ){isPassWordValid = true;
  }else { missing_info += "Password , "; isPassWordValid = false}
  if (signUpDetailsObj.confirmPassword !== "" ){isConfirmPassWordValid = true;
  }else { missing_info += "Confirm Password , "; isConfirmPassWordValid = false}
  if (signUpDetailsObj.school !== "" ){isSchoolValid = true;
  }else { missing_info += "School , "; isSchoolValid = false}
  if (signUpDetailsObj.gradYear !== ""){ isGradYearValid = true;
  }else { missing_info += "Grad Year , "; isGradYearValid = false }
  // Make sure that grad year is valid
  let thisYear = new Date().getFullYear();
  let isGradYearWithinRange = parseInt(signUpDetailsObj.gradYear) < thisYear;
  let gradErrorStr = "";
  if ( isGradYearWithinRange ){
    gradErrorStr += "\n Please provide the correct graduation year. ";
    isGradYearValid = false;
  }
  let isProvided = isGradYearValid && isSchoolValid && isFirstNameValid  &&
      isLastNameValid  && isEmailValid  && isPassWordValid  && isConfirmPassWordValid ;
  let passWordsMatch = signUpDetailsObj.password === signUpDetailsObj.confirmPassword;
  let passErrorStr = "";
  if (!passWordsMatch){
    passErrorStr += "\n Please make sure the password and confirmed passwords match. "
  }
  if (!isProvided || !passWordsMatch){
    alert(missing_info + gradErrorStr + passErrorStr);
  }
  return passWordsMatch && isProvided;
}

function mainDriver(){
  let submitInfoBtn = document.getElementById("createAccountButton");
  submitInfoBtn.onclick = getInfoAndVerify;
}

/**
 * Returns true or false based on if the object values are correct
 * @param signUpObj
 */
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
      db.collection('users').doc(user.uid).collection('Actions').doc('Observation').set({Correct:0}).then(
          function(user) {window.location.replace("./Main%20UI.html")}
          );
    }, function(error) {
      printErrorMessage(error, email, pwd, re_pwd)
    })
  }
}
