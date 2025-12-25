## Refactoring

Refactoring with class.

There are lots of (this), and they have to be (bind) this so that this still points to the class, not to the one that calls the method. Be careful and read the code again to understand better.

Remember, when a class is created, the constructor will automatically run. Calling multiple methods inside the constructor will also initialize the program!

and also the previous global variable let is now private within the class itself.

```js
class App {
  // Privat Class Fields
  #map;
  #mapEvent;

  constructor() {
    // Imidiatly run the code
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevatioLoad); // change too=ggle
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get Your postion');
        }
      );
  }

  _loadMap(position) {
    // get lat and long with destructuring object
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    console.log(this);
    // Shoulbe Have HTML with id map
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    L.marker(coords)
      .addTo(this.#map)
      .bindPopup('A pretty CSS popup.<br> Easily customizable.')
      .openPopup();

    // Leaflet Library --> Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;

    // Manipuate DOM
    form.classList.remove('hidden');
    inputDistance.focus(); // Make Instanly in Distance Fields
  }

  _toggleElevatioLoad() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(event) {
    event.preventDefault();
    // console.log(this);

    // Clear Input value fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // Displaying Marker
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map) //
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
  }
}

// initial Render
const app = new App();
```

[Next: Mananging workout](./07-managing-workout.md)
