

document.addEventListener('DOMContentLoaded', () => {
    fetch(`http://localhost:3000/set-password`,
        {
            method: 'GET', credentials: 'include'}
    )
    .then(res => res.json())
    .then(data => console.log(data))
})