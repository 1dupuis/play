let player;
let currentTab = 'music';

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '315',
        width: '560',
        videoId: 'la-vie-en-rose-id', // Default video ID
        playerVars: {
            'autoplay': 1,
            'loop': 1,
            'playlist': 'la-vie-en-rose-id' // Required for looping
        },
        events: {
            'onReady': onPlayerReady,
        }
    });

    let artistPlayer = new YT.Player('artist-player', {
        height: '315',
        width: '560',
        videoId: '', // Default to no video
        playerVars: {
            'autoplay': 1,
            'loop': 1,
            'playlist': ''
        }
    });

    function onPlayerReady(event) {
        const playButton = document.getElementById('play-button');
        const pauseButton = document.getElementById('pause-button');
        const stopButton = document.getElementById('stop-button');
        const volumeControl = document.getElementById('volume-control');
        const musicSelect = document.getElementById('music-select');
        const artistSelect = document.getElementById('artist-select');

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

        if (musicSelect) {
            musicSelect.addEventListener('change', (event) => {
                const newTrackUrl = event.target.value;
                const videoId = new URL(newTrackUrl).searchParams.get('v');
                player.loadVideoById(videoId);
            });
        }

        if (artistSelect) {
            artistSelect.addEventListener('change', (event) => {
                const newTrackUrl = event.target.value;
                const videoId = new URL(newTrackUrl).searchParams.get('v');
                artistPlayer.loadVideoById(videoId);
            });
        }
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
