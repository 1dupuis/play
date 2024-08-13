let player;
let artistPlayer;
let currentTab = 'music';
let retryCount = 0;
const maxRetries = 5;
const retryDelay = 2000; // 2 seconds

function loadYouTubeIframeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
    initializePlayers();
}

function initializePlayers() {
    try {
        const defaultMusicVideo = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Replace with your desired music video URL
        const defaultArtistVideo = 'https://www.youtube.com/watch?v=9bZkp7q19f0'; // Replace with your desired artist video URL
        const musicVideoId = extractVideoId(defaultMusicVideo);
        const artistVideoId = extractVideoId(defaultArtistVideo);

        player = new YT.Player('player', {
            height: '315',
            width: '560',
            videoId: musicVideoId,
            playerVars: {
                'autoplay': 1,
                'loop': 1,
                'playlist': musicVideoId // Required for looping
            },
            events: {
                'onReady': onPlayerReady,
                'onError': onPlayerError
            }
        });

        artistPlayer = new YT.Player('artist-player', {
            height: '315',
            width: '560',
            videoId: artistVideoId,
            playerVars: {
                'autoplay': 1,
                'loop': 1,
                'playlist': artistVideoId
            },
            events: {
                'onError': onPlayerError
            }
        });
    } catch (error) {
        console.error("Error initializing YouTube players:", error);
        retryInitialization();
    }
}

function extractVideoId(url) {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
    }
    return urlObj.searchParams.get('v');
}

function onPlayerError(event) {
    console.error("YouTube player error:", event.data);
    retryInitialization();
}

function retryInitialization() {
    if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying initialization (attempt ${retryCount} of ${maxRetries})...`);
        setTimeout(initializePlayers, retryDelay);
    } else {
        console.error("Max retries reached. YouTube player initialization failed.");
        // You might want to show an error message to the user here
    }
}

function onPlayerReady(event) {
    console.log("YouTube player is ready");
    retryCount = 0; // Reset retry count on successful initialization
    setupEventListeners();
}

function setupEventListeners() {
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const stopButton = document.getElementById('stop-button');
    const volumeControl = document.getElementById('volume-control');
    const musicSelect = document.getElementById('music-select');
    const artistSelect = document.getElementById('artist-select');

    if (playButton) {
        playButton.addEventListener('click', () => player.playVideo());
    }
    if (pauseButton) {
        pauseButton.addEventListener('click', () => player.pauseVideo());
    }
    if (stopButton) {
        stopButton.addEventListener('click', () => player.stopVideo());
    }
    if (volumeControl) {
        volumeControl.addEventListener('input', (event) => {
            player.setVolume(event.target.value * 100);
        });
    }
    if (musicSelect) {
        musicSelect.addEventListener('change', (event) => {
            const newTrackUrl = event.target.value;
            const videoId = extractVideoId(newTrackUrl);
            player.loadVideoById(videoId);
        });
    }
    if (artistSelect) {
        artistSelect.addEventListener('change', (event) => {
            const newTrackUrl = event.target.value;
            const videoId = extractVideoId(newTrackUrl);
            artistPlayer.loadVideoById(videoId);
        });
    }

    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    document.querySelector('.tab-button.active').click();
}

// Start the initialization process
loadYouTubeIframeAPI();
