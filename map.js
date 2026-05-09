let map, marker, alertMarkers=[];
function initMap() {
    map = L.map('leafletMap').setView([37.7749, -122.4194], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
    marker = L.marker([37.7749, -122.4194]).addTo(map).bindPopup('Device Location');
    // Simulate alert markers periodically
    setInterval(() => {
        const lat = 37.7749 + (Math.random()-0.5)*0.01;
        const lng = -122.4194 + (Math.random()-0.5)*0.01;
        const m = L.marker([lat,lng]).addTo(map).bindPopup('Alert: Animal detected');
        alertMarkers.push(m);
        if(alertMarkers.length>5) map.removeLayer(alertMarkers.shift());
    }, 8000);
}