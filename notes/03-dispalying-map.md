## Displaying Location

Add Leaflet Library with CDN.

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
  crossorigin=""
/>
<script
  defer
  src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
  integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
  crossorigin=""
></script>
```

and adding to script

```js
navigator.geolocation.getCurrentPosition(
  function (position) {
    // get lat and long with destructuring object
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    // Shoulbe Have HTML with id map
    var map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(coords)
      .addTo(map)
      .bindPopup('A pretty CSS popup.<br> Easily customizable.')
      .openPopup();
  },
  function () {
    alert('Could not get Your postion');
  }
);
```

### Displaying Marker

| Method          | Description                                                                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AutoClose       | Set it to false if you want to override the default behavior of <br> the popup closing when another popup is opened.                                           |
| closeOnClick    | Set it if you want to override the default behavior of the popup <br> closing when user clicks on the map. Defaults to the map's <br>closePopupOnClick option. |
| className       | A custom CSS class name to assign to the popup.                                                                                                                |
| setPopupContent | Sets the content of the popup bound to this layer.                                                                                                             |

.on is leaflet method not JavaScript

```js
map.on('click', function (mapEvent) {
  const { lat, lng } = mapEvent.latlng;

  L.marker([lat, lng])
    .addTo(map) //
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent(`Workout`)
    .openPopup();
});
```

[Next: Displaing Workout](./04-rendering-workout.md)
