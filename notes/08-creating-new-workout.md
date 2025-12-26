## Creating new Workout

First and foremost, if you want to retrieve data from the user, you must save the data from the DOM to a variable first. Then validate it according to the application's needs. Then, store it in an array.

```js
_newWorkout(event) {
    // Validation
    const validInput = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    event.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let newWorkout;

    console.log(distance);

    // if workout runnnig, createng running obeject
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

    // if workout cycling, createng cycling obeject
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
    console.log(newWorkout);
    console.log(this.#workout);

    // render workout on map as a marker
    this._renderWorkoutMarker(newWorkout);


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

  _renderWorkoutList(workout){

  }
```

[Next: Rendering Workout](./09-rendering-workout.md)
