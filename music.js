// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('background-music');
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const stopButton = document.getElementById('stop-button');
    const volumeControl = document.getElementById('volume-control');
    const progressBar = document.getElementById('progress-bar');

    // Play button functionality
    playButton.addEventListener('click', () => {
        audio.play();
    });

    // Pause button functionality
    pauseButton.addEventListener('click', () => {
        audio.pause();
    });

    // Stop button functionality
    stopButton.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
    });

    // Volume control functionality
    volumeControl.addEventListener('input', (event) => {
        audio.volume = event.target.value;
    });

    // Progress bar functionality
    progressBar.addEventListener('input', (event) => {
        const newTime = audio.duration * (event.target.value / 100);
        audio.currentTime = newTime;
    });

    // Update progress bar as the audio plays
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
    });
});
