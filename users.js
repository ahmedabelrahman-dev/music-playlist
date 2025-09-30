// Show all registered users (view only)
const usersList = document.getElementById('users-list');

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function renderUsers() {
    const users = getUsers();
    if (!users.length) {
        usersList.innerHTML = '<p>No users registered yet.</p>';
        return;
    }
    let html = '<table class="users-table"><thead><tr><th>Name</th><th>Email/Username</th></tr></thead><tbody>';
    users.forEach(user => {
        html += `<tr><td>${user.name || '-'}</td><td>${user.username}</td></tr>`;
    });
    html += '</tbody></table>';
    usersList.innerHTML = html;
}

window.addEventListener('DOMContentLoaded', renderUsers);
