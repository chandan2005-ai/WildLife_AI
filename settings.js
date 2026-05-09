function loadSettings() {
    const dark = localStorage.getItem('darkMode') !== 'false';
    document.getElementById('darkModeToggle').checked = dark;
    document.body.className = dark ? 'dark-mode' : 'light-mode';
    document.getElementById('volumeSlider').value = localStorage.getItem('volume')||0.5;
    document.getElementById('sensitivity').value = localStorage.getItem('sensitivity')||50;
}
function saveSettings() {
    localStorage.setItem('darkMode', document.getElementById('darkModeToggle').checked);
    localStorage.setItem('volume', document.getElementById('volumeSlider').value);
    localStorage.setItem('sensitivity', document.getElementById('sensitivity').value);
    loadSettings();
}
function toggleTheme() {
    const btn = document.getElementById('darkModeToggle');
    btn.checked = !btn.checked;
    saveSettings();
}