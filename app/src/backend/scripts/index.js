const btnSignIn = document.getElementById('sign_in')

function signin() {
    window.location.href = '../../front-end/html/signin.html'
}


document.addEventListener('DOMContentLoaded', () => {
    if(!btnSignIn) return console.error('No existe el elemento')

    btnSignIn.addEventListener('click', signin)
})