let animalChart, dailyChart;
function initCharts() {
    const ctx1 = document.getElementById('animalChart').getContext('2d');
    animalChart = new Chart(ctx1, {
        type: 'bar', data: { labels: animals, datasets: [{ label:'Detections', data:[0]*6 }] }
    });
    const ctx2 = document.getElementById('dailyChart').getContext('2d');
    dailyChart = new Chart(ctx2, {
        type: 'line', data: { labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets:[{label:'Alerts',data:[2,5,3,8,4,6,1]}] }
    });
}
function updateCharts(detections) {
    // Count per animal
    const counts = {};
    animals.forEach(a=>counts[a]=0);
    detections.forEach(d=>counts[d.animal]=(counts[d.animal]||0)+1);
    animalChart.data.datasets[0].data = animals.map(a=>counts[a]||0);
    animalChart.update();
}