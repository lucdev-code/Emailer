async function fetchToAdminLogin(e) {
    e.preventDefault()
    const email = document.getElementById('email_a').value
    const password = document.getElementById('password_a').value

    if(!email?.trim() || !password?.trim()) return alert('Todos los campos son obligatorios')

    // hacer el fetch
    const fetchtoadminlogin = await fetch('http://localhost:3000/admin/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
    })

    if(!fetchtoadminlogin.ok) return alert('Error en el fetch')

    const resultFecthAdminLog = await fetchtoadminlogin.json()

    if(resultFecthAdminLog.status !== 'OK') return window.location.href = '../../front-end/html/unauthorized.html'
    else return window.location.href = '../../front-end/html/admin_page.html'
}

document.addEventListener('DOMContentLoaded', () => {

    if(!document.getElementById('form_admin')) return alert('El formulario no existe')
    
    const form_admin = document.getElementById('form_admin')
    
    form_admin.addEventListener('submit', fetchToAdminLogin)
})