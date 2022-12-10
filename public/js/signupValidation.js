function validateName() {
    let nameError = document.getElementById('nameError');
    let name = document.getElementById('nameField').value;
    if (name.length == 0) {
        nameError.innerHTML = '';
        return true;
    } else if (!name.match("^[A-Za-z ][A-Za-z ]{0,29}$")) {
        nameError.innerHTML = 'Please enter a valid name';
        return true;
    } else if (name.length < 3) {
        nameError.innerHTML = 'Name must be at least 3 characters';
        return true;
    } else {
        nameError.innerHTML = '';
        return false;
    }
}

function validateNameInput() {
    let nameError = document.getElementById('nameError');
    let name = document.getElementById('nameField').value;
    if (name.length == 0) {
        nameError.innerHTML = '';
        return true;
    } else if (!name.match("^[A-Za-z ][A-Za-z ]{0,29}$")) {
        nameError.innerHTML = 'Please enter a valid name';
        return true;
    } else {
        nameError.innerHTML = '';
        return false;
    }
}

function validateEmail() {
    let emailError = document.getElementById('emailError');
    let email = document.getElementById('emailField').value;
    if (email.length == 0) {
        emailError.innerHTML = '';
        return true;
    } else if (!email.match(/^[A-Za-z\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)) {
        emailError.innerHTML = 'Please enter a valid email';
        return true;
    } else {
        emailError.innerHTML = '';
        return false;
    }
}

function validateEmailInput() {
    let emailError = document.getElementById('emailError');
    let email = document.getElementById('emailField').value;
    if (email.length == 0) {
        emailError.innerHTML = '';
        return true;
    } else if (!email.match("^[A-Za-z _@.0123456789][A-Za-z _@.0123456789]{0,29}$")) {
        emailError.innerHTML = 'Please enter a valid email';
        return true;
    } else {
        emailError.innerHTML = '';
        return false;
    }
}

function validatePassword() {
    let passwordError = document.getElementById('passwordError');
    let password = document.getElementById('passwordField').value;
    if (password.length == 0) {
        passwordError.innerHTML = '';
        return true;
    } else if (password.length < 8) {
        passwordError.innerHTML = 'Password must be at least 8 characters';
        return true;
    } else {
        passwordError.innerHTML = '';
        return false;
    }
}

userSignupForm.addEventListener('submit', (e) => {
    let error = 0;
    if (validateName() || validateEmail() || validatePassword()) {
        error = 1;;
    }
    if(error == 1){
        e.preventDefault();
    }
})