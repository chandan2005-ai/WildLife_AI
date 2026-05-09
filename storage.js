const DB_NAME = 'WildGuardDB';
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            db.createObjectStore('detections', { keyPath: 'id', autoIncrement: true });
            db.createObjectStore('settings', { keyPath: 'key' });
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e);
    });
}
async function saveDetectionLocal(det) {
    const db = await openDB();
    const tx = db.transaction('detections', 'readwrite');
    tx.objectStore('detections').add(det);
}
async function getLocalDetections() {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction('detections');
        const store = tx.objectStore('detections');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
    });
}
async function clearLocalDetections() {
    const db = await openDB();
    const tx = db.transaction('detections', 'readwrite');
    tx.objectStore('detections').clear();
}