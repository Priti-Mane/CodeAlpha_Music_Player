// Sample playlist data
const playlist = [
    {
        title: "Summer Vibes",
        artist: "DJ Cool",
        duration: 245,
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "Midnight Dreams",
        artist: "Luna Rose",
        duration: 198,
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        title: "Electric Hearts",
        artist: "The Synths",
        duration: 223,
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        title: "Ocean Waves",
        artist: "Chill Masters",
        duration: 267,
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        title: "Urban Rhythm",
        artist: "Beat Makers",
        duration: 189,
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    }
];

// Initialize audio object
let audio = new Audio();
let currentTrackIndex = 0;
let isPlaying = false;
let autoplay = false;

// DOM Elements
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.querySelector('.progress-bar');
const progress = document.getElementById('progress');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const playlistEl = document.getElementById('playlist');
const autoplayToggle = document.getElementById('autoplayToggle');

// Format time in minutes:seconds
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Load track
function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    songTitle.textContent = track.title;
    artistName.textContent = track.artist;
    durationEl.textContent = formatTime(track.duration);
    
    // Update playlist active state
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Play/Pause toggle
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playBtn.textContent = '⏸️';
        isPlaying = false;
    } else {
        audio.play();
        playBtn.textContent = '⏸️';
        isPlaying = true;
    }
}

// Previous track
function previousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audio.play();
    }
}

// Next track
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audio.play();
    }
}

// Update progress bar
function updateProgress() {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
}

// Set progress
function setProgress(e) {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Update volume
function updateVolume() {
    const volume = volumeSlider.value;
    audio.volume = volume / 100;
    volumeValue.textContent = `${volume}%`;
}

// Create playlist UI
function createPlaylist() {
    playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.classList.add('playlist-item');
        item.innerHTML = `
            <h4>${track.title}</h4>
            <p>${track.artist} • ${formatTime(track.duration)}</p>
        `;
        item.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(index);
            if (isPlaying) {
                audio.play();
            } else {
                togglePlay();
            }
        });
        playlistEl.appendChild(item);
    });
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', previousTrack);
nextBtn.addEventListener('click', nextTrack);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', () => {
    if (autoplay) {
        nextTrack();
    } else {
        playBtn.textContent = '▶️';
        isPlaying = false;
    }
});
progressBar.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', updateVolume);
autoplayToggle.addEventListener('change', (e) => {
    autoplay = e.target.checked;
});

// Handle metadata loaded
audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

// Initialize
createPlaylist();
loadTrack(currentTrackIndex);
updateVolume();