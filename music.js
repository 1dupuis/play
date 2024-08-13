let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '315',
        width: '560',
        videoId: 'la-vie-en-rose-url', // Default video
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

    playButton.addEventListener('click', () => {
        player.playVideo();
    });

    pauseButton.addEventListener('click', () => {
        player.pauseVideo();
    });

    stopButton.addEventListener('click', () => {
        player.stopVideo();
    });

    volumeControl.addEventListener('input', (event) => {
        player.setVolume(event.target.value * 100);
    });

    trackSelect.addEventListener('change', (event) => {
        const newTrackUrl = event.target.value;
        const videoId = new URL(newTrackUrl).searchParams.get('v');
        player.loadVideoById(videoId);
    });
}
