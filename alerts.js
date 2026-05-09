function showAlert(animal, conf, imageUrl) {
    const alertList = document.getElementById('alertList');
    const card = document.createElement('div');
    card.className = 'alert alert-danger alert-flash mb-1 p-1';
    card.innerHTML = `<strong>${animal}</strong> (${(conf*100).toFixed(0)}%)<br><small>${new Date().toLocaleTimeString()}</small>
        <img src="${imageUrl}" width="40" class="float-end rounded">`;
    alertList.prepend(card);
    if (Notification.permission === 'granted') {
        new Notification('WildGuard Alert', { body: `${animal} detected!`, icon: imageUrl });
    }
    // vibrate if mobile
    if (navigator.vibrate) navigator.vibrate(200);
}
function triggerSOS() {
    playSiren();
    showAlert('⚠️ EMERGENCY', 1, '/static/images/wildguard-logo.svg');
}