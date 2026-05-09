document.addEventListener('DOMContentLoaded', () => {
    // Splash screen removal
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
    }, 2000);

    // Auth check
    if (!localStorage.getItem('wildguard_user')) {
        window.location.href = '/login';
        return;
    }

    // Initialize components
    loadSettings();
    initMap();
    initCharts();
    document.getElementById('startCamBtn').addEventListener('click', startCamera);
    document.getElementById('stopCamBtn').addEventListener('click', stopCamera);

    // Tab navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-pane').forEach(pane=>pane.classList.remove('show','active'));
            document.getElementById(tabId).classList.add('show','active');
            if(tabId==='historyTab') loadHistory();
            if(tabId==='analyticsTab') refreshCharts();
        });
    });

    // Clock
    setInterval(() => {
        document.getElementById('liveClock').textContent = new Date().toLocaleTimeString();
    }, 1000);

    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/static/js/sw.js');
    }

    // Request notification permission
    if (Notification.permission !== 'denied') {
        Notification.requestPermission();
    }

    // Load initial detections
    loadHistory();
});

async function loadHistory() {
    const local = await getLocalDetections();
    const server = await fetch('/api/detections').then(r=>r.json()).catch(()=>[]);
    const combined = [...server, ...local].sort((a,b)=> new Date(b.timestamp)-new Date(a.timestamp));
    const tbody = document.querySelector('#historyTable tbody');
    tbody.innerHTML = '';
    combined.forEach(d => {
        const row = `<tr>
            <td>${d.animal}</td><td>${(d.confidence*100).toFixed(0)}%</td>
            <td>${new Date(d.timestamp).toLocaleString()}</td>
            <td><img src="${d.image||'/static/uploads/placeholder.png'}" width="40"></td>
            <td><button class="btn btn-sm btn-danger" onclick="deleteLog(${d.id})">🗑</button></td>
        </tr>`;
        tbody.innerHTML += row;
    });
}
function deleteLog(id) {
    fetch('/api/detections/'+id, {method:'DELETE'}).then(()=>loadHistory());
}
function exportLogs(format) {
    getLocalDetections().then(detections=>{
        let data;
        if(format==='json') data = JSON.stringify(detections);
        else data = detections.map(d=>`${d.animal},${d.confidence},${d.timestamp}`).join('\n');
        const blob = new Blob([data], {type: 'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `wildguard_logs.${format}`;
        a.click();
    });
}
function refreshCharts() {
    getLocalDetections().then(d=>updateCharts(d));
}