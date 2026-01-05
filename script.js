'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');

const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// edit button
class Workout {
  id = (Date.now() + '').slice(-10);
  date = new Date();
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; // in km/h
    this.duration = duration; // in min
  }

  _setDescription() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    this.description = `${this.type.replace(
      this.type[0],
      this.type[0].toUpperCase()
    )} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }

  click() {
    this.clicks += 1;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
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
    this._setDescription();
  }

  calcSpeed() {
    // km/h

    this.speed = (this.distance / this.duration) * 60;
    return this.speed;
  }
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

// ----------- Application Architecture -------------//

class App {
  // Private Class Fields
  #map;
  #mapEvent;
  #workout = [];
  #route = [];
  #zoomLevel = 13;
  #idEdit;

  constructor() {
    // Imidiatly run the code
    this._getPosition();

    // Get Data from local Storage
    this._getLocalStorage();

    // Attach Event Handler
    form.addEventListener('submit', event => {
      this._newWorkout(event, this.#idEdit);
    });
    inputType.addEventListener('change', this._toggleElevatioLoad); // change toggle
    containerWorkouts.addEventListener('click', event => {
      const editElement = event.target.closest(`.btn-edit`);
      const deleteElement = event.target.closest(`.btn-delete`);
      if (!editElement && !deleteElement) {
        this._moveToPopup(event);
      }

      if (editElement) {
        // console.log('hello');
        this._edit(event);
      }
    });
  }

  _edit(event) {
    const workoutEl = event.target.closest('.workout');
    const workoutId = workoutEl.dataset.id;
    this.#idEdit = workoutId;

    const workout = this.#workout.find(workout => workout.id === workoutId);

    console.log(workout);
    console.log(this.#idEdit);

    form.classList.remove('hidden');

    if (workout.type === 'running') {
      inputElevation.closest('.form__row').classList.add('form__row--hidden');
      inputCadence.closest('.form__row').classList.remove('form__row--hidden');

      inputType.value = workout.type;
      inputCadence.value = workout.cadence;
    }

    if (workout.type === 'cycling') {
      inputElevation
        .closest('.form__row')
        .classList.remove('form__row--hidden');
      inputCadence.closest('.form__row').classList.add('form__row--hidden');

      inputType.value = workout.type;
      inputElevation.value = workout.elevationGain;
    }
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

    // Initial data for redering string
    // Shoulbe Have HTML with id map
    this.#map = L.map('map').setView(coords, this.#zoomLevel);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    L.marker(coords)
      .addTo(this.#map)
      .bindPopup('🎯 Your current Position')
      .openPopup();

    // Leaflet Library --> Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));

    // should be get #map first
    this.#workout.forEach(work => {
      this._renderWorkoutMarker(work);
      this._renderLineString();
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    this.#idEdit = '';
    console.log(this.#idEdit);

    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => {
      form.style.display = 'grid';
    }, 1000);
  }

  _toggleElevatioLoad() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(event, id) {
    // Validation helper

    const validInput = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    event.preventDefault();
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    let newWorkout;

    if (!id) {
      // Get data from form

      const { lat, lng } = this.#mapEvent.latlng;

      // if workout runnnig, creating running obeject
      if (type === 'running') {
        const cadence = +inputCadence.value;

        // Check if data valid
        if (
          !validInput(distance, duration, cadence) ||
          !allPositive(distance, duration, cadence)
        )
          return alert('Inputs have to be positive number');

        newWorkout = new Running([lat, lng], distance, duration, cadence);
      }

      // if workout cycling, creating cycling obeject
      if (type === 'cycling') {
        const elevation = Number(inputElevation.value);

        if (
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
      this._hideForm();

      // Set Local Storage to all Workouts
      this._setLocalStorage();
    }

    if (id) {
      const workout = this.#workout.find(workout => workout.id === id);
      console.log(workout);

      newWorkout = {
        type,
        distance,
        duration,
      };

      if (type === 'running') {
        const cadence = +inputCadence.value;

        if (
          !validInput(distance, duration, cadence) ||
          !allPositive(distance, duration, cadence)
        )
          return alert('Inputs have to be positive number');

        newWorkout.cadence = cadence;
      }

      if (type === 'cycling') {
        const elevation = Number(inputElevation.value);

        if (
          !validInput(distance, duration, elevation) ||
          !allPositive(distance, duration)
        )
          return alert('Inputs have to be positive number');

        newWorkout.elevationGain = elevation;
      }

      // New Workour data
      const editedWorkout = {
        ...workout,
        ...newWorkout,
      };
    }
  }

  _renderWorkoutMarker(newWorkout) {
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
        `
        ${newWorkout.type === 'running' ? '🏃‍♂️' : '🚴'} ${newWorkout.description}
        `
      )
      .openPopup();
  }

  _renderLineString() {
    const geojsonFeature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: this.#workout.map(p => [p.coords[1], p.coords[0]]), // lng, lat
      },
    };
    L.geoJSON(geojsonFeature).addTo(this.#map);
  }

  _renderWorkout(newWorkout) {
    let markup = ` <li class="workout workout--${newWorkout.type}" data-id="${
      newWorkout.id
    }">
          <h2 class="workout__title">${newWorkout.description}</h2>
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Delete</button>
          <div class="workout__details">
            <span class="workout__icon">${
              newWorkout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${newWorkout.distance}</span>
            <span class="workout__unit"></span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${newWorkout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
        `;

    if (newWorkout.type === 'running') {
      markup += `
      <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${newWorkout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${newWorkout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>

      `;
    }

    if (newWorkout.type === 'cycling') {
      markup += `
      <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${newWorkout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${newWorkout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
      `;
    }

    form.insertAdjacentHTML('afterend', markup);
  }

  _moveToPopup(event) {
    const workoutElement = event.target.closest('.workout');

    if (!workoutElement) return;

    const workout = this.#workout.find(
      work => work.id === workoutElement.dataset.id
    );

    this.#map.setView(workout.coords, this.#zoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // workout.click();
  }

  _setLocalStorage() {
    localStorage.setItem('workout', JSON.stringify(this.#workout));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workout'));

    if (!data) return;

    this.#workout = data;

    this.#workout.forEach(work => {
      this._renderWorkout(work);
    });
  }

  reset() {
    localStorage.removeItem('workout');
    location.reload();
  }
}

// initial Render
const app = new App();
