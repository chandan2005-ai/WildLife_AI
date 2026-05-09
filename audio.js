// Web Audio API audio generator
let audioCtx = null;
function createBeep(frequency=800, duration=0.3, type='square') {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
}
function playBeep() {
    createBeep(800, 0.2, 'square');
}
function playSiren() {
    for(let i=0;i<5;i++){
        setTimeout(()=>createBeep(600,0.2,'sawtooth'), i*300);
        setTimeout(()=>createBeep(900,0.2,'sawtooth'), i*300+150);
    }
}