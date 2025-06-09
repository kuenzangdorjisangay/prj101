// /view/js/logout.js
const logout = function (event) {
    event.preventDefault(); // Prevent link navigation

    // Clear localStorage (optional if you're not using it)
    localStorage.removeItem('token');
    console.log('token removed', token)

    // Call backend to clear cookie
    fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message || 'Logged out successfully');
            window.location.href = 'login.html';
        })
        .catch(err => {
            console.error('Logout error:', err);
            alert('Logout failed. Please try again.');
        });
};
