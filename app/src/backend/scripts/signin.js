
document.addEventListener('DOMContentLoaded', async() => {

    const cookiExist = localStorage.getItem('COOKIE_OK')

    if(cookiExist) console.log('Si existe la cookie')
})