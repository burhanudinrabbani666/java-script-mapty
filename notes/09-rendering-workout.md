## Rendering Workouts

Create a separate method that handles the logic for rendering the UI as needed. Then, set it after the method for saving the data is called.

```js
_renderWorkout(newWorkout) {
    console.log(newWorkout.elevationGain, newWorkout.speed);

    let markup = ` <li class="workout workout--${newWorkout.type}" data-id="${
      newWorkout.id
    }">
          <h2 class="workout__title">${newWorkout.description}</h2>
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

```

```js
this._renderWorkoutMarker(newWorkout);

// render Line string
this._renderLineString();

// Render Workout List
this._renderWorkout(newWorkout);

// Clear Input value fields
this._hideForm();
```

In the example above, I also added a string to be rendered according to the starting point to the destination point. Meanwhile, for the method to delete the form from the screen after the data is saved, just use set timeout to change the display properties.

```js
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
```

[Next: Next To Marker](./10-move-to-marker.md)
