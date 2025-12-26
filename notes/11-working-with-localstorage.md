## Working with localStorage

make sure to load data from the start of the application running

```js
constructor() {
    // Imidiatly run the code
    this._getPosition();

    // Get Data from local Storage
    this._getLocalStorage();

    // Attach Event Handler
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevatioLoad); // change toggle
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }
```

then create the method

```js
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
```

and to render the marker make sure that the map is running

````js
  // should be get #map first
   this.#workout.forEach(work => {
     this._renderWorkoutMarker(work);
     this._renderLineString();
   });
   ```
````

[Next: Final](./12-final.md)
