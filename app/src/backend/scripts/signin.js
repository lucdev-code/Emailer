
document.addEventListener('DOMContentLoaded', async() => {


    const searchCookie = await fetch('http://localhost:3000/get-cookie', {
            credentials: 'include', method: 'GET' })
    
    if(!searchCookie.ok) {
        const errorData = await searchCookie.json();
            throw new Error(errorData.error || 'Error al verificar el email');
    }

    const infoCookie = await searchCookie.json()

    console.log(infoCookie)
})