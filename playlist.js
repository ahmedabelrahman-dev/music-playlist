// Playlist page logic
// Handles playlist UI, creation, deletion, and user separation

const welcomeUser = document.getElementById('welcome-user');
const logoutBtn = document.getElementById('logout-btn');
const createPlaylistBtn = document.getElementById('create-playlist-btn');
const playlistsList = document.getElementById('playlists-list');
const playlistDetails = document.getElementById('playlist-details');

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}
function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

function getCurrentUserObj() {
    const users = getUsers();
    const username = getCurrentUser();
    return users.find(u => u.username === username);
}

function updateWelcome() {
    // Try to get the name from the login form (if present in sessionStorage)
    let displayName = '';
    if (sessionStorage.getItem('loginName')) {
        displayName = sessionStorage.getItem('loginName');
        sessionStorage.removeItem('loginName');
    } else {
        const users = getUsers();
        const username = getCurrentUser();
        const user = users.find(u => u.username === username);
        displayName = user && user.name ? user.name : '';
    }
    welcomeUser.textContent = displayName ? `Welcome! ${displayName}` : `Welcome!`;
}

function renderPlaylists() {
    const user = getCurrentUserObj();
    playlistsList.innerHTML = '';
    if (!user || !user.playlists.length) {
        playlistsList.innerHTML = '<p>No playlists yet. Create one!</p>';
        return;
    }
    user.playlists.forEach((pl, idx) => {
        const div = document.createElement('div');
        div.className = 'playlist-card';
        div.innerHTML = `
            <div class="playlist-info">
                <span class="playlist-name">${pl.name}</span>
                <span class="playlist-count">${pl.songs.length} songs</span>
            </div>
            <div>
                <button onclick="openPlaylist(${idx})">Open</button>
                <button onclick="deletePlaylist(${idx})">Delete</button>
            </div>
        `;
        playlistsList.appendChild(div);
    });
}


window.openPlaylist = function(idx) {
    playlistDetails.style.display = '';
    const user = getCurrentUserObj();
    if (!user) return;
    const playlist = user.playlists[idx];
    if (!playlist) return;

    // Song add form
    let html = `<h3>${playlist.name}</h3>
        <form id="add-song-form" class="song-form">
            <input type="text" id="song-title" placeholder="Song Title" required />
            <input type="text" id="song-artist" placeholder="Artist" required />
            <input type="url" id="song-url" placeholder="Song URL (mp3)" required />
            <button type="submit">Add Song</button>
        </form>`;

    // Song list
    if (playlist.songs.length === 0) {
        html += `<p>No songs in this playlist yet.</p>`;
    } else {
        html += `<ul class="song-list">`;
        playlist.songs.forEach((song, sidx) => {
            html += `<li>
                <span><strong>${song.title}</strong> by ${song.artist}</span>
                <button onclick="playSong('${encodeURIComponent(song.url)}')">Play</button>
                <button onclick="removeSong(${idx},${sidx})">Remove</button>
            </li>`;
        });
        html += `</ul>`;
    }
    playlistDetails.innerHTML = html;

    // Add song event
    document.getElementById('add-song-form').onsubmit = function(e) {
        e.preventDefault();
        const title = document.getElementById('song-title').value.trim();
        const artist = document.getElementById('song-artist').value.trim();
        const url = document.getElementById('song-url').value.trim();
        if (!title || !artist || !url) return alert('Please fill all fields.');
        let users = getUsers();
        const username = getCurrentUser();
        const userIdx = users.findIndex(u => u.username === username);
        if (userIdx === -1) return;
        users[userIdx].playlists[idx].songs.push({ title, artist, url });
        setUsers(users);
        openPlaylist(idx);
    };
};

window.removeSong = function(playlistIdx, songIdx) {
    let users = getUsers();
    const username = getCurrentUser();
    const userIdx = users.findIndex(u => u.username === username);
    if (userIdx === -1) return;
    users[userIdx].playlists[playlistIdx].songs.splice(songIdx, 1);
    setUsers(users);
    openPlaylist(playlistIdx);
};

window.playSong = function(url) {
    url = decodeURIComponent(url);
    let audio = document.getElementById('audio-player');
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'audio-player';
        audio.controls = true;
        playlistDetails.appendChild(audio);
    }
    audio.src = url;
    audio.style.display = '';
    audio.play();
};

window.deletePlaylist = function(idx) {
    let users = getUsers();
    const username = getCurrentUser();
    const userIdx = users.findIndex(u => u.username === username);
    if (userIdx === -1) return;
    users[userIdx].playlists.splice(idx, 1);
    setUsers(users);
    renderPlaylists();
    playlistDetails.style.display = 'none';
};

createPlaylistBtn.addEventListener('click', () => {
    const name = prompt('Enter playlist name:');
    if (!name) return;
    let users = getUsers();
    const username = getCurrentUser();
    const userIdx = users.findIndex(u => u.username === username);
    if (userIdx === -1) return;
    users[userIdx].playlists.push({ name, songs: [] });
    setUsers(users);
    renderPlaylists();
});

logoutBtn.addEventListener('click', () => {
    clearCurrentUser();
    window.location.href = 'index.html';
});

window.addEventListener('DOMContentLoaded', () => {
    if (!getCurrentUser()) {
        window.location.href = 'index.html';
        return;
    }
    updateWelcome();
    renderPlaylists();
    playlistDetails.style.display = 'none';
});
