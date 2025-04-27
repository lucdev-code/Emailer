async function sendPassword(e) {
    e.preventDefault()

    const password = document.getElementById('password').value

    if (!password?.trim()) return console.log('Los datos no han sido llenados correctamente')

    const response = await fetch('http://localhost:3000/auth/student/set-pasword', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });

    if (!response.ok) return console.log('Error en la petición');

    const result = await response.json();
    
    if(result.status !== 'OK') return alert('No se completo la accion')
    else window.location.href = '../../front-end/html/signin.html'
}

document.addEventListener('DOMContentLoaded', async () => {
   
    const searchCookie = await fetch('http://localhost:3000/auth/student/cookie', 
        {
            credentials: 'include',
            method: 'GET' 
        }
    )
    
    if(!searchCookie.ok) {
        const errorData = await searchCookie.json();
            throw new Error(errorData.error || 'Error al verificar el email');
    }

    const infoCookie = await searchCookie.json()

    if (infoCookie.status !== 'OK') {
        console.log(infoCookie.status)
        window.location.href = '../../front-end/html/index.html'
    }

    const inputEmail = document.getElementById('emailStudent')
    inputEmail.value = infoCookie.mail

    const form_password = document.getElementById('set-pass')

    if (!form_password) return console.log('No existe el form')

    form_password.addEventListener('submit', sendPassword)
})