const btnSignIn = document.getElementById('sign_in')

function signin(e) {
    e.preventDefault()
    fetch()
}


document.addEventListener('DOMContentLoaded', () => {
    if(!btnSignIn) return console.error('No existe el elemento')

    btnSignIn.addEventListener('click', signin)
})