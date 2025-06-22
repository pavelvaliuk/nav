const map = L.map('map').setView([53.9006, 27.5590], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let currentPolyline = L.polyline([], { color: 'blue' }).addTo(map);

function showRouteOnMap(points) {
    const latlngs = JSON.parse(points);
    currentPolyline.setLatLngs(latlngs);
    if (latlngs.length > 0) {
        map.fitBounds(L.polyline(latlngs).getBounds());
    }
    updateDistance(latlngs);
}

function updateDistance(coords) {
    let totalDistance = 0;
    if (coords.length < 2) {
        document.getElementById('routeDistance').innerText = 'Протяжённость маршрута: 0 км';
        return;
    }

    for (let i = 0; i < coords.length - 1; i++) {
        const point1 = L.latLng(coords[i]);
        const point2 = L.latLng(coords[i + 1]);
        totalDistance += point1.distanceTo(point2) / 1000;
    }

    document.getElementById('routeDistance').innerText = `Протяжённость маршрута: ${totalDistance.toFixed(2)} км`;
}

function loadRoutes() {
    fetch('get_routes.php')
        .then(res => res.json())
        .then(routes => {
            const routesList = document.getElementById('routesList');
            routesList.innerHTML = '';

            if (routes.length === 0) {
                routesList.innerHTML = '<p>У вас нет сохранённых маршрутов.</p>';
                return;
            }

            routes.forEach(route => {
                const item = document.createElement('div');
                item.classList.add('route-item');

                const nameEl = document.createElement('span');
                nameEl.classList.add('route-name');
                nameEl.textContent = route.name;

                const buttons = document.createElement('div');
                buttons.classList.add('route-buttons');

                const viewBtn = document.createElement('button');
                viewBtn.classList.add('view-btn');
                viewBtn.textContent = 'Посмотреть';
                viewBtn.onclick = () => showRouteOnMap(route.points);

                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-btn');
                deleteBtn.textContent = 'Удалить';
                deleteBtn.onclick = () => deleteRoute(route.id);

                buttons.append(viewBtn, deleteBtn);
                item.append(nameEl, buttons);
                routesList.appendChild(item);
            });
        });
}

function deleteRoute(routeId) {
    if (!confirm('Вы уверены, что хотите удалить этот маршрут?')) return;

    const formData = new FormData();
    formData.append('route_id', routeId);

    fetch('delete_route.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.text())
        .then(response => {
            alert(response);
            loadRoutes();
            currentPolyline.setLatLngs([]);
            document.getElementById('routeDistance').innerText = 'Протяжённость маршрута: 0 км';
        });
}

document.addEventListener('DOMContentLoaded', loadRoutes);
