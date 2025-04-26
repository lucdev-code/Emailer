async function fecthEnpointVerifyEmail(e) {
    e.preventDefault()
    const email = document.getElementById('email').value.trim()

    if (!email) return alert('Debes ingresar un correo')

    try {
        const response = await fetch('http://localhost:3000/auth/student/validateEmail',
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            }
        )

        if (!response.ok) return alert('Intentalo mas tarde')

        const result = await response.json()
        if(result.status !== 'OK') return alert('No se ha encontrado el correo que se ingreso, intente de nuevo')
        if(result.email_verified !== true) return window.location.href = '../../front-end/html/setPassword.html'
        else return window.location.href = '../../front-end/html/signin.html'

    } catch (error) {

    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('check-email')
    const btnsendEmail = document.getElementById('sendEmail')

    if (!form || !btnsendEmail) return console.error('No existe el elemento form')

    btnsendEmail.addEventListener('click', fecthEnpointVerifyEmail)

})