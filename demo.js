// Demo mode: if no real detection, simulate one every 8 sec.
setInterval(() => {
    if (document.getElementById('startCamBtn').disabled) { // camera active
        // random animal without motion if no detection recently
        // We'll just rely on detection loop, but backup:
        if (Math.random() < 0.3) { // occasional forced detection
            const animal = animals[Math.floor(Math.random()*animals.length)];
            const confidence = 0.6+Math.random()*0.3;
            captureAndAlert(animal, confidence, 0);
        }
    }
}, 8000);