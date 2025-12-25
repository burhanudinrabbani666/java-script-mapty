## Rendering Form

Rendering Fields when map get click with leaflet build in method

```js
      // Leaflet Library --> Handling clicks on map
      map.on('click', function (mapE) {
        mapEvent = mapE;

        // Manipuate DOM
        form.classList.remove('hidden');
        inputDistance.focus(); // Make Instanly in Distance Fields
      });
    },
    function () {
      alert('Could not get Your postion');
    }
```

most important we create let variable for flexibility data

```js
// Declare map, mapEvent for reusable
let map, mapEvent;
```

Also rendering staticly card after input

```js
form.addEventListener('submit', function (event) {
  event.preventDefault();

  // Clear Input value fields
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';

  // Displaying Marker
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

and change the fields using addEventListener "change"

```js
// Change from elevation fields to cadance fields or backward
inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
```

[Next: Project Architecture](./05-project-architecture.md)
