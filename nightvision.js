function toggleNightVision() {
    document.getElementById('nightVisionOverlay').classList.toggle('d-none');
    // Apply CSS filter to video
    const video = document.getElementById('webcamVideo');
    video.style.filter = video.style.filter === 'grayscale(1) contrast(1.5) brightness(0.8) hue-rotate(90deg)' ? '' : 'grayscale(1) contrast(1.5) brightness(0.8) hue-rotate(90deg)';
}
function toggleThermal() {
    // Switch to thermal canvas processing (simulated)
    const canvas = document.getElementById('detectionCanvas');
    // In thermal mode, we can draw a red/blue overlay on each frame; simplified: just apply a hue-rotate.
    const video = document.getElementById('webcamVideo');
    video.style.filter = video.style.filter === 'hue-rotate(200deg) saturate(2)' ? '' : 'hue-rotate(200deg) saturate(2)';
}