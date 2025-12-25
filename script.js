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

// Declare map, mapEvent for reusable
let map, mapEvent;

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // get lat and long with destructuring object
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      const coords = [latitude, longitude];

      // Shoulbe Have HTML with id map
      map = L.map('map').setView(coords, 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(coords)
        .addTo(map)
        .bindPopup('A pretty CSS popup.<br> Easily customizable.')
        .openPopup();

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
  );

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

// Change from elevation fields to cadance fields or backward
inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
