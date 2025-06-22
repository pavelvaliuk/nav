const map = L.map('map').setView([53.9006, 27.5590], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let route = [];
let markers = [];
let polyline = L.polyline([], { color: 'blue' }).addTo(map);
let drawingEnabled = false;

function updateRoute() {
    polyline.setLatLngs(route);
    updateDistance();
    updateTime(calculateDistance(route));
}

function calculateDistance(coords) {
    let totalDistance = 0;
    if (coords.length < 2) return totalDistance;

    for (let i = 0; i < coords.length - 1; i++) {
        const point1 = L.latLng(coords[i]);
        const point2 = L.latLng(coords[i + 1]);
        totalDistance += point1.distanceTo(point2) / 1000;
    }

    return +totalDistance.toFixed(2);
}

function updateDistance() {
    document.getElementById('routeDistance').innerText = `Протяжённость маршрута: ${calculateDistance(route)} км`;
}

function updateTime(distance) {
    const speeds = { car: 60, bike: 20, walk: 5 };

    function timeString(speed) {
        const hours = Math.floor(distance / speed);
        const minutes = Math.round(((distance / speed) - hours) * 60);
        return `${hours} ч ${minutes} мин`;
    }

    document.getElementById('carTime').innerText = timeString(speeds.car);
    document.getElementById('bikeTime').innerText = timeString(speeds.bike);
    document.getElementById('walkTime').innerText = timeString(speeds.walk);
    document.getElementById('estimatedTime').innerText = `Примерное время пути: ${timeString(speeds.car)} (автомобиль)`;
}

document.getElementById('drawRoute').addEventListener('click', () => {
    drawingEnabled = true;
    clearRoute();
});

document.getElementById('clearRoute').addEventListener('click', clearRoute);

function clearRoute() {
    route = [];
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    polyline.setLatLngs([]);
    updateDistance();
    updateTime(0);
}

map.on('click', function (e) {
    if (!drawingEnabled) return;

    const { lat, lng } = e.latlng;
    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);

    marker.on('drag', function () {
        const index = markers.indexOf(marker);
        if (index !== -1) {
            route[index] = [marker.getLatLng().lat, marker.getLatLng().lng];
            updateRoute();
        }
    });

    marker.on('contextmenu', function () {
        const index = markers.indexOf(marker);
        if (index !== -1) {
            route.splice(index, 1);
            markers.splice(index, 1);
            map.removeLayer(marker);
            updateRoute();
        }
    });

    route.push([lat, lng]);
    markers.push(marker);
    updateRoute();
});


updateUserInterface();
