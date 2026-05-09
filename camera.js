let stream = null;
const video = document.getElementById('webcamVideo');
const canvas = document.getElementById('detectionCanvas');
const ctx = canvas.getContext('2d');

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        document.getElementById('startCamBtn').disabled = true;
        document.getElementById('stopCamBtn').disabled = false;
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        };
    } catch(e) { alert('Camera error: '+e.message); }
}
function stopCamera() {
    if(stream) { stream.getTracks().forEach(t => t.stop()); }
    video.srcObject = null;
    document.getElementById('startCamBtn').disabled = false;
    document.getElementById('stopCamBtn').disabled = true;
}
async function switchCamera() {
    stopCamera();
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'user' } } });
    video.srcObject = stream;
}
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.querySelector('.camera-panel').requestFullscreen();
    } else document.exitFullscreen();
}
function captureFrame() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    // Save locally
    const id = 'capture_'+Date.now();
    saveDetectionLocal({ animal:'manual capture', confidence:1, timestamp:new Date().toISOString(), image:dataUrl });
    alert('Frame captured!');
}