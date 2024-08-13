let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '315',
        width: '560',
        videoId: 'la-vie-en-rose-id', // Default video ID
        playerVars: {
            'autoplay': 1, // Autoplay video
            'loop': 1, // Loop video
            'playlist': 'la-vie-en-rose-id' // Required for looping
        },
        events: {
            'onReady': onPlayerReady,
        }
    });
}

function onPlayerReady(event) {
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const stopButton = document.getElementById('stop-button');
    const volumeControl = document.getElementById('volume-control');
    const trackSelect = document.getElementById('track-select');

    if (playButton) {
        playButton.addEventListener('click', () => {
            player.playVideo();
        });
    }

    if (pauseButton) {
        pauseButton.addEventListener('click', () => {
            player.pauseVideo();
        });
    }

    if (stopButton) {
        stopButton.addEventListener('click', () => {
            player.stopVideo();
        });
    }

    if (volumeControl) {
        volumeControl.addEventListener('input', (event) => {
            player.setVolume(event.target.value * 100);
        });
    }

    if (trackSelect) {
        trackSelect.addEventListener('change', (event) => {
            const newTrackUrl = event.target.value;
            const videoId = new URL(newTrackUrl).searchParams.get('v');
            player.loadVideoById(videoId);
        });
    }
}
