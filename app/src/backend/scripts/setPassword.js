async function sendPassword(e) {
    e.preventDefault()

    const email = document.getElementById('emailStudent').value
    const password = document.getElementById('password').value

    if (!email?.trim() || !password?.trim()) return console.log('Los datos no han sido llenados correctamente')

    const response = await fetch('http://localhost:3000/add-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });

    if (!response.ok) return console.log('Error en la petición');

    const result = await response.json();
    console.log(result);
}

document.addEventListener('DOMContentLoaded', async () => {
    const getCookie = await fetch('http://localhost:3000/get-cookie', {
        method: 'GET',
        credentials: 'include',
    })

    if (!getCookie.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al verificar el email');
    }
    const info = await getCookie.json()

    localStorage.setItem('COOKIE_OK', info.email)

    if (info.status !== 'OK') {
        alert('No tienes permiso para estar aqui')
        window.location.href = '../../front-end/html/index.html'
    }

    const inputEmail = document.getElementById('emailStudent')
    inputEmail.value = info.email

    const form_password = document.getElementById('set-pass')

    if (!form_password) return console.log('No existe el form')

    form_password.addEventListener('submit', sendPassword)
})