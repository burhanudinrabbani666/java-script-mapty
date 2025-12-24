## Using Geolocation API

here we take the location by using API

```js
navigator.geolocation.getCurrentPosition(
  function (position) {
    // get lat and long with destructuring object
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
  },
  function () {
    alert('Could not get Your postion');
  }
);
```

The first argument of the API is the callback function when the user allows access to the user's location, and the second argument is the callback function when the user does not allow access to the location.

[Next: Displaying Map](./03-dispalying-map.md)
