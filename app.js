
// --- DOM Elements ---
const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const playlistUI = document.getElementById('playlist-ui');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const welcomeUser = document.getElementById('welcome-user');

// --- Helper Functions ---
function getUsers() {
	return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(users) {
	localStorage.setItem('users', JSON.stringify(users));
}
function setCurrentUser(username) {
	localStorage.setItem('currentUser', username);
}
function getCurrentUser() {
	return localStorage.getItem('currentUser');
}
function clearCurrentUser() {
	localStorage.removeItem('currentUser');
}

// --- UI Switching ---
function showLoginForm() {
	loginContainer.style.display = '';
	signupContainer.style.display = 'none';
	playlistUI.style.display = 'none';
}
function showSignupForm() {
	loginContainer.style.display = 'none';
	signupContainer.style.display = '';
	playlistUI.style.display = 'none';
}


// No longer used: showPlaylistUI

// --- Event Listeners ---
showSignup.addEventListener('click', e => {
	e.preventDefault();
	showSignupForm();
});
showLogin.addEventListener('click', e => {
	e.preventDefault();
	showLoginForm();
});

signupForm.addEventListener('submit', function(e) {
	e.preventDefault();
	const name = document.getElementById('signup-name').value.trim();
	const username = document.getElementById('signup-username').value.trim();
	const password = document.getElementById('signup-password').value;
	if (!name || !username || !password) return alert('Please fill all fields.');
	let users = getUsers();
	if (users.find(u => u.username === username)) {
		alert('Username already exists.');
		return;
	}
	users.push({ name, username, password, playlists: [] });
	setUsers(users);
	setCurrentUser(username);
	window.location.href = 'playlist.html';
});

loginForm.addEventListener('submit', function(e) {
	e.preventDefault();
	const name = document.getElementById('login-name').value.trim();
	const username = document.getElementById('login-username').value.trim();
	const password = document.getElementById('login-password').value;
	let users = getUsers();
	const user = users.find(u => u.username === username && u.password === password);
	if (!user) {
		alert('Invalid username or password.');
		return;
	}
	setCurrentUser(username);
	if (name) sessionStorage.setItem('loginName', name);
	window.location.href = 'playlist.html';
});

// --- On Load: Check if logged in ---
window.addEventListener('DOMContentLoaded', () => {
	const currentUser = getCurrentUser();
	if (currentUser) {
		window.location.href = 'playlist.html';
	} else {
		showLoginForm();
	}
});
