async function fetchApiCheckEmail(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();

    if (!email) {
        alert('Debes ingresar un email válido');
        return;
    }

    try {
        // Codificamos el email para URL
        const response = await fetch(`http://localhost:3000/check-email/${email}`, {credentials: 'include'});
        
        // Verificamos si la respuesta fue exitosa (status 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al verificar el email');
        }
        
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        
        if (data.success) {
            alert(data.message || `Email: ${data.mail}`);
            // Guardar cookie si es necesario
            // Cookies.set('emailUsertoSetPassword', data.email);
        } else {
            alert(data.error || 'Ocurrió un error al verificar el email');
        }
        
    } catch (error) {
        console.error('Error al verificar el email:', error);
        alert(error.message || 'Error al conectar con el servidor');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('check-email')
    const btnsendEmail = document.getElementById('sendEmail')

    if (!form || !btnsendEmail) return console.error('No existe el elemento form')

    btnsendEmail.addEventListener('click', fetchApiCheckEmail)

})