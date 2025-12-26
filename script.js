'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  id = (Date.now() + '').slice(-10);
  date = new Date();

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; // in km/h
    this.duration = duration; // in min
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    // min/km

    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    // km/h

    this.speed = this.distance / this.duration / 60;
    return this.speed;
  }
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

// ----------- Application Architecture -------------//

class App {
  // Privat Class Fields
  #map;
  #mapEvent;
  #workout = [];
  #route = [];

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

    console.log(position);
    const coords = [latitude, longitude];

    this.#route.push(coords);
    console.log(this.#route);
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
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevatioLoad() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(event) {
    // Validation
    const validInput = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    event.preventDefault();

    console.log(this);
    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let newWorkout;

    // if workout runnnig, createng running obeject
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // Check if data valid

      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)

        !validInput(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive number');

      newWorkout = new Running([lat, lng], distance, duration, cadence);
    }

    // if workout cycling, createng cycling obeject
    if (type === 'cycling') {
      const elevation = Number(inputElevation.value);

      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)

        !validInput(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive number');

      newWorkout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // add new object to workot array
    this.#workout.push(newWorkout);
    this.#route.push([lat, lng]);

    // render workout on map as a marker
    this._renderWorkoutMarker(newWorkout);

    // render Line string
    this._renderLineString();

    // Render Workout List
    this._renderWorkout(newWorkout);

    // Clear Input value fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // Displaying Marker
  }

  _renderWorkoutMarker(newWorkout) {
    console.log(newWorkout);

    L.marker([newWorkout.coords[0], newWorkout.coords[1]])
      .addTo(this.#map) //
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${newWorkout.type}-popup`,
        })
      )
      .setPopupContent(
        newWorkout.type.replace(
          newWorkout.type[0],
          newWorkout.type[0].toUpperCase()
        )
      )
      .openPopup();
  }

  _renderLineString() {
    const geojsonFeature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: this.#route.map(p => [p[1], p[0]]), // lng, lat
      },
    };

    L.geoJSON(geojsonFeature).addTo(this.#map);
  }

  _renderWorkout(workout) {}
}

// initial Render
const app = new App();
