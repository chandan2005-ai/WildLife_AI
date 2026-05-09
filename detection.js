// Simulated AI animal detection via motion + random label
let lastFrame = null;
const animals = ['Dog', 'Cat', 'Cow', 'Horse', 'Bird', 'Person'];
function detectMotionAndAssignAnimal() {
    if (video.readyState < 2) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const current = ctx.getImageData(0,0,canvas.width,canvas.height);
    if (!lastFrame) { lastFrame = current; return; }
    // Simple difference
    let diff = 0;
    const data1 = lastFrame.data, data2 = current.data;
    for(let i=0;i<data1.length;i+=4){
        diff += Math.abs(data1[i]-data2[i]) + Math.abs(data1[i+1]-data2[i+1]) + Math.abs(data1[i+2]-data2[i+2]);
    }
    lastFrame = current;
    const motionPercent = diff / (canvas.width*canvas.height*3);
    // If motion above threshold, simulate detection
    if (motionPercent > 0.05) {   // adjust for sensitivity
        const animal = animals[Math.floor(Math.random()*animals.length)];
        const confidence = 0.7 + Math.random()*0.29;
        drawBoundingBox(); // random box
        captureAndAlert(animal, confidence, motionPercent);
    }
}
function drawBoundingBox() {
    ctx.beginPath();
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    // random position
    const x = Math.random()*canvas.width*0.6;
    const y = Math.random()*canvas.height*0.6;
    ctx.strokeRect(x, y, 100, 100);
}
async function captureAndAlert(animal, confidence, motion) {
    const dataUrl = canvas.toDataURL('image/png');
    const timestamp = new Date().toISOString();
    // Save locally and to server
    saveDetectionLocal({ animal, confidence, timestamp, image: dataUrl });
    await fetch('/api/detections', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ animal, confidence, timestamp, image: dataUrl, alert_status:1 })
    });
    // Visual + audio alert
    showAlert(animal, confidence, dataUrl);
    playBeep();
}
// Run detection loop
setInterval(detectMotionAndAssignAnimal, 1000);