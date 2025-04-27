async function fetchToAdminLogin(e) {
    e.preventDefault()
    const email = document.getElementById('email_a').value
    const password = document.getElementById('password_a').value

    if(!email?.trim() || !password?.trim()) return alert('Todos los campos son obligatorios')

    // hacer el fetch
}

document.addEventListener('DOMContentLoaded', () => {

    if(!document.getElementById('form_admin')) return alert('El formulario no existe')
    
    const form_admin = document.getElementById('form_admin')
    
    form_admin.addEventListener('submit', fetchToAdminLogin)
})