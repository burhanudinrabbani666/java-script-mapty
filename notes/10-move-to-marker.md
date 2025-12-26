## Move to Marker

must be at the very beginning because this method is not related to data storage

```js

  constructor() {
    // Imidiatly run the code
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevatioLoad); // change toggle
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }



_moveToPopup(event) {
    const workoutElement = event.target.closest('.workout');
    console.log(workoutElement);

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

    workout.click();
  }
```

[Next: Working With Local Storage](./11-working-with-localstorage.md)
