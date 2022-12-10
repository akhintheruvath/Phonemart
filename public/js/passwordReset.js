let x = 0;
let y = 0;

$('#resetForm').submit((e) => {
    document.getElementById('mailError').innerHTML = '';
    e.preventDefault();
    $.ajax({
        url:'/resetOtpSend',
        method:'post',
        data: $('#resetForm').serialize(),
        success: (response) => {
            console.log(response);
            if(response.status){
                console.log('Success');
                x = 1;
                otpFieldGet();
            }else{
                document.getElementById('mailError').innerHTML = 'User does not exist';
                console.log('Failure');
            }
        }
    })
})

function otpFieldGet(){
    if(x==1){
        console.log('Helloo');
        $('#resetForm').addClass('d-none');
        $('#otpSubmitForm').removeClass('d-none');
    }
}

$('#otpSubmitForm').submit((e) => {
    document.getElementById('otpError').innerHTML = '';
    e.preventDefault();
    $.ajax({
        url:'/resetOtpSubmit',
        method:'post',
        data: $('#otpSubmitForm').serialize(),
        success:(response) => {
            if(response.otp){
                console.log('succcesss');
                y = 1;
                resetPasswordPage()
            }else{
                console.log('filadl');
                document.getElementById('otpError').innerHTML = 'Invalid OTP';
            }
        }
    })
})

function resetPasswordPage(){
    if(y==1){
        console.log('Helloo');
        $('#otpSubmitForm').addClass('d-none');
        $('#newPasswordForm').removeClass('d-none');
    }
}

$('#newPasswordForm').submit((e) => {
    e.preventDefault();
    $.ajax({
        url:'/newPasswordSubmit',
        method:'post',
        data: $('#newPasswordForm').serialize(),
    })
})