const btnSignIn = document.getElementById('sign_in')

function signin() {
    window.location.href = '../../front-end/html/check_email.html'
}


document.addEventListener('DOMContentLoaded', () => {
    if(!btnSignIn) return console.error('No existe el elemento')

    btnSignIn.addEventListener('click', signin)
})