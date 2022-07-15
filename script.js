// 'use strict';

// class Workout {
//   date = new Date();
//   id = (Date.now() + '').slice(-10);
//   clicks = 0;

//   constructor(coords, distance, duration) {
//     this.coords = coords; // [lat, lng]
//     this.distance = distance; // in km
//     this.duration = duration; // in min
//   }

//   _setDescription() {
//     // prettier-ignore
//     const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//     this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
//       months[this.date.getMonth()]
//     } ${this.date.getDate()}`;
//   }

//   click() {
//     this.clicks++;
//   }
// }

// class Running extends Workout {
//   type = 'running';

//   constructor(coords, distance, duration, cadence) {
//     super(coords, distance, duration);
//     this.cadence = cadence;
//     this.calcPace();
//     this._setDescription(); // from parent class. doing it here because we have type of workout here
//   }

//   calcPace() {
//     // min/km
//     this.pace = this.duration / this.distance;
//     return this.pace;
//   }
// }

// class Cycling extends Workout {
//   type = 'cycling';

//   constructor(coords, distance, duration, elevationGain) {
//     super(coords, distance, duration);
//     this.elevationGain = elevationGain;
//     this.calcSpeed();
//     this._setDescription();
//   }

//   calcSpeed() {
//     // km/h
//     this.speed = this.distance / (this.duration / 60);
//     return this.speed;
//   }
// }

// //////////////////////////////////////////////
// // APPLICATION ARCHITECTURE

// const form = document.querySelector('.form');
// const containerWorkouts = document.querySelector('.workouts');
// const inputType = document.querySelector('.form__input--type');
// const inputDistance = document.querySelector('.form__input--distance');
// const inputDuration = document.querySelector('.form__input--duration');
// const inputCadence = document.querySelector('.form__input--cadence');
// const inputElevation = document.querySelector('.form__input--elevation');

// class App {
//   #map;
//   #mapZoomLevel = 13;
//   #mapEvent;
//   #workouts = [];

//   constructor() {
//     // get users position
//     this._getPosition();

//     // get data from local storage
//     this._getLocalStorage();

//     // attach event handlers (when the page loads)
//     form.addEventListener('submit', this._newWorkout.bind(this));
//     inputType.addEventListener('change', this._toggleElevationField);
//     containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
//   }

//   _getPosition() {
//     // użycie geolokacji
//     // funkcja getCurrentPosition() przyjmuje dwa argumnenty w postaci funkcji (callback w przypadku sussess i druga w przypadku error)
//     if (navigator.geolocation)
//       navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
//         alert('Could not get your position');
//       });
//   }

//   _loadMap(position) {
//     const { latitude } = position.coords;
//     const { longitude } = position.coords;
//     console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

//     const coords = [latitude, longitude];

//     this.#map = L.map('map').setView(coords, this.#mapZoomLevel); // const map it's a div with id 'map' from HTML

//     L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     }).addTo(this.#map);

//     // method on map obj (from leaflet) using instead of addEventListener
//     // handling clicks on map
//     this.#map.on('click', this._showForm.bind(this));

//     this.#workouts.forEach(work => {
//       this._renderWorkoutMarker(work);
//     });
//   }

//   _showForm(mapE) {
//     this.#mapEvent = mapE;
//     form.classList.remove('hidden');
//     inputDistance.focus();
//   }

//   _hideForm() {
//     // empty inputs
//     inputDistance.value =
//       inputDuration.value =
//       inputCadence.value =
//       inputElevation.value =
//         '';

//     form.style.display = 'none';
//     form.classList.add('hidden');
//     setTimeout(() => {
//       form.style.display = 'grid';
//     }, 1000);
//   }

//   _toggleElevationField() {
//     inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
//     inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
//   }

//   _newWorkout(e) {
//     const validInputs = (...inputs) =>
//       inputs.every(inp => Number.isFinite(inp)); // will loop into every el in array and check if Number.isFinite or not; returns true if value is true for all elements

//     const allPositive = (...inputs) => inputs.every(inp => inp > 0);

//     e.preventDefault();

//     // get data from the form
//     const type = inputType.value;
//     const distance = +inputDistance.value;
//     const duration = +inputDuration.value;
//     const { lat, lng } = this.#mapEvent.latlng;
//     let workout;

//     // if workout running, create running object
//     if (type === 'running') {
//       const cadence = +inputCadence.value;
//       // check if data is valid
//       if (
//         // !Number.isFinite(distance) ||
//         // !Number.isFinite(duration) ||
//         // !Number.isFinite(cadence)
//         !validInputs(distance, duration, cadence) || // if all of these are not numbers => true
//         !allPositive(distance, duration, cadence)
//       ) {
//         // if distance is not a number
//         return alert('Inputs has to be positive numbers!');
//       }
//       workout = new Running([lat, lng], distance, duration, cadence);
//     }

//     // if workout cycling, create cycling object
//     if (type === 'cycling') {
//       const elevation = +inputElevation.value;
//       // check if data is valid
//       if (
//         !validInputs(distance, duration, elevation) ||
//         !allPositive(distance, duration)
//       ) {
//         return alert('Inputs has to be positive numbers!');
//       }
//       workout = new Cycling([lat, lng], distance, duration, elevation);
//     }

//     // add new object to workout array
//     this.#workouts.push(workout);

//     // render workout on map as marker
//     this._renderWorkoutMarker(workout);

//     // render workout list
//     this._renderWorkout(workout);

//     // hide form + clear input fields
//     this._hideForm();

//     // set local storage to all workouts
//     this._setLocalStorage();

//     // delete workout
//     // this._deleteWorkout(workout);

//     // edit workout
//     // this._editWorkout(workout)
//   }

//   _renderWorkoutMarker(workout) {
//     // display marker

//     L.marker(workout.coords)
//       .addTo(this.#map)
//       .bindPopup(
//         L.popup({
//           maxWidth: 250,
//           minWidth: 100,
//           autoClose: false,
//           closeOnClick: false,
//           className: `${workout.type}-popup`,
//         })
//       )
//       .setPopupContent(
//         `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
//       )
//       .openPopup();
//   }

//   _renderWorkout(workout) {
//     let html = `
//         <li class="workout workout--${workout.type}" data-id="${workout.id}">
//             <div class="workout__top">
//                 <h2 class="workout__title">${workout.description}</h2>
//                 <div class="workout__actions">
//                     <button class="workout--edit">
//                         <img class="img" src="/edit-3.svg" alt="" />
//                     </button>
//                     <button class="workout--delete">
//                         <img class="img" src="/trash.svg" alt="" />
//                     </button>
//                 </div>
//             </div>
//             <div class="workout__details">
//                 <span class="workout__icon">${
//                   workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
//                 }</span>
//                 <span class="workout__value">${workout.distance}</span>
//                 <span class="workout__unit">km</span>
//             </div>
//             <div class="workout__details">
//                 <span class="workout__icon">⏱</span>
//                 <span class="workout__value">${workout.duration}</span>
//                 <span class="workout__unit">min</span>
//             </div>
//     `;

//     if (workout.type === 'running') {
//       html += `
//             <div class="workout__details">
//                 <span class="workout__icon">⚡️</span>
//                 <span class="workout__value">${workout.pace.toFixed(1)}</span>
//                 <span class="workout__unit">min/km</span>
//             </div>
//             <div class="workout__details">
//                 <span class="workout__icon">🦶🏼</span>
//                 <span class="workout__value">${workout.cadence}</span>
//                 <span class="workout__unit">spm</span>
//             </div>
//         </li>
//         `;
//     }

//     if (workout.type === 'cycling') {
//       html += `
//             <div class="workout__details">
//                 <span class="workout__icon">⚡️</span>
//                 <span class="workout__value">${workout.speed.toFixed(1)}</span>
//                 <span class="workout__unit">km/h</span>
//             </div>
//             <div class="workout__details">
//                 <span class="workout__icon">⛰</span>
//                 <span class="workout__value">${workout.elevationGain}</span>
//                 <span class="workout__unit">m</span>
//             </div>
//         </li>
//         `;
//     }

//     form.insertAdjacentHTML('afterend', html);
//     console.log(containerWorkouts);

//     const workoutEdit = containerWorkouts.querySelector('.workout--edit');
//     console.log(workoutEdit);
//     const workoutDelete = containerWorkouts.querySelector('.workout--delete');
//     console.log(workoutDelete);
//     workoutDelete.setAttribute('id', `${workout.id}`);

//     workoutDelete.addEventListener(
//       'click',
//       this._deleteWorkout.bind(this, workout, html)
//     );
//     return html;
//   }

//   _moveToPopup(e) {
//     const workoutEl = e.target.closest('.workout'); // closest method will select the entire closest parent with class .workout
//     console.log(workoutEl);
//     // const workoutEdit = workoutEl.querySelector('.workout--edit');
//     // const workoutDelete = workoutEl.querySelector('.workout--delete');
//     // console.log(workoutDelete);
//     // console.log(e.target === workoutDelete);
//     // console.log(workoutEl.dataset.id);

//     if (!workoutEl) return;

//     const workout = this.#workouts.find(
//       work => work.id === workoutEl.dataset.id
//     );

//     console.log(workout);
//     if (!workout) return;

//     this.#map.setView(workout.coords, this.#mapZoomLevel, {
//       // method from leaflet to find el in the map by coords
//       animate: true,
//       pan: {
//         duration: 1,
//       },
//     });

//     // using the public interface
//     // workout.click();
//   }

//   _deleteWorkout(workout, html, e) {
//     // const w = containerWorkouts.querySelectorAll('.workout');
//     // console.log(w);
//     console.log(workout);
//     console.log(this.#workouts);

//     const workoutEl = e.target.closest('.workout');

//     workoutEl.remove(html);

//     const index = this.#workouts.indexOf(workout);
//     console.log(index);
//     if (index > -1) this.#workouts.splice(index, 1);

//     console.log(this.#workouts);

//   }

//   _setLocalStorage() {
//     localStorage.setItem('workouts', JSON.stringify(this.#workouts));
//     //setItem() jako parametr przyjmuje key-value pair
//     // JSON.stringify() -> zmienia obiekt w string

//     // !! when we convert objects to string and then to object they are loosing theirs prototypes, prototypes chain and they are regular objects. They are loosing tjeir inheritance !!
//   }

//   _getLocalStorage() {
//     const data = JSON.parse(localStorage.getItem('workouts')); // convert string to JS

//     if (!data) return;

//     this.#workouts = data;

//     this.#workouts.forEach(work => {
//       this._renderWorkout(work);
//     });
//   }

//   reset() {
//     localStorage.removeItem('workouts'); // removing items by a key
//     location.reload(); // reload the page
//   }
// }

// const app = new App();

'use strict';

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription(); // from parent class. doing it here because we have type of workout here
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
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

//////////////////////////////////////////////
// APPLICATION ARCHITECTURE

const formTemplateElement = document.getElementById('form-template');
const formTemplate = formTemplateElement.content.cloneNode(true);
const form = formTemplate.querySelector('.form');
const inputType = formTemplate.querySelector('.form__input--type');
const inputDistance = formTemplate.querySelector('.form__input--distance');
const inputDuration = formTemplate.querySelector('.form__input--duration');
const inputCadence = formTemplate.querySelector('.form__input--cadence');
const inputElevation = formTemplate.querySelector('.form__input--elevation');
const containerWorkouts = document.querySelector('.workouts');
containerWorkouts.append(formTemplate);
console.log(formTemplateElement);
console.dir(formTemplate);

const updateFormElement = formTemplateElement.content.cloneNode(true);
const updatedForm = updateFormElement.querySelector('.form');
const updatedInputType = updateFormElement.querySelector('.form__input--type');
const updatedInputDistance = updateFormElement.querySelector(
  '.form__input--distance'
);
const updatedInputDuration = updateFormElement.querySelector(
  '.form__input--duration'
);
const updatedInputCadence = updateFormElement.querySelector(
  '.form__input--cadence'
);
const updatedInputElevation = updateFormElement.querySelector(
  '.form__input--elevation'
);
containerWorkouts.append(updatedForm);

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];

  constructor() {
    // get users position
    this._getPosition();

    // get data from local storage
    this._getLocalStorage();

    // attach event handlers (when the page loads)
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    updatedForm.addEventListener(
      'submit',
      this._updateWorkout.bind(this, this.#workouts)
    );
  }

  _getPosition() {
    // użycie geolokacji
    // funkcja getCurrentPosition() przyjmuje dwa argumnenty w postaci funkcji (callback w przypadku sussess i druga w przypadku error)
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        alert('Could not get your position');
      });
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel); // const map it's a div with id 'map' from HTML

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // method on map obj (from leaflet) using instead of addEventListener
    // handling clicks on map
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showUpdateForm() {
    updatedForm.classList.remove('hidden');
    console.log(updatedForm);
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
    console.log(form);
  }

  _hideForm() {
    // empty inputs
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

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp)); // will loop into every el in array and check if Number.isFinite or not; returns true if value is true for all elements

    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    // get data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // if workout running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) || // if all of these are not numbers => true
        !allPositive(distance, duration, cadence)
      ) {
        // if distance is not a number
        return alert('Inputs has to be positive numbers!');
      }
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // if workout cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      // check if data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert('Inputs has to be positive numbers!');
      }
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // add new object to workout array
    this.#workouts.push(workout);

    // render workout on map as marker
    this._renderWorkoutMarker(workout);

    // render workout list
    this._renderWorkout(workout);

    // hide form + clear input fields
    this._hideForm();

    // set local storage to all workouts
    this._setLocalStorage();

    // delete workout
    // this._deleteWorkout(workout);

    // edit workout
    // this._editWorkout(workout)

    return workout;
  }


  _renderWorkoutMarker(workout) {
    // display marker

    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
            <div class="workout__top">
                <h2 class="workout__title">${workout.description}</h2>
                <div class="workout__actions">
                    <button class="workout--edit">
                        <img class="img" src="/edit-3.svg" alt="" />
                    </button>
                    <button class="workout--delete">
                        <img class="img" src="/trash.svg" alt="" />
                    </button>
                </div>
            </div>
            <div class="workout__details">
                <span class="workout__icon">${
                  workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
                }</span>
                <span class="workout__value">${workout.distance}</span>
                <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${workout.duration}</span>
                <span class="workout__unit">min</span>
            </div>
    `;

    if (workout.type === 'running') {
      html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.pace.toFixed(1)}</span>
                <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.cadence}</span>
                <span class="workout__unit">spm</span>
            </div>
        </li>
        `;
    }

    if (workout.type === 'cycling') {
      html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.speed.toFixed(1)}</span>
                <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⛰</span>
                <span class="workout__value">${workout.elevationGain}</span>
                <span class="workout__unit">m</span>
            </div>
        </li>
        `;
    }

    form.insertAdjacentHTML('afterend', html);
    // console.log(containerWorkouts);

    const workoutEdit = containerWorkouts.querySelector('.workout--edit');
    const workoutDelete = containerWorkouts.querySelector('.workout--delete');
    workoutDelete.setAttribute('id', `${workout.id}`);

    workoutDelete.addEventListener(
      'click',
      this._deleteWorkout.bind(this, workout, html)
    );

    workoutEdit.addEventListener(
      'click',
      this._editWorkout.bind(this, workout)
    );
    return html;
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout'); // closest method will select the entire closest parent with class .workout
    console.log(workoutEl);
    // const workoutEdit = workoutEl.querySelector('.workout--edit');
    // const workoutDelete = workoutEl.querySelector('.workout--delete');
    // console.log(workoutDelete);
    // console.log(e.target === workoutDelete);
    // console.log(workoutEl.dataset.id);

    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    console.log(workout);
    if (!workout) return;

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      // method from leaflet to find el in the map by coords
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // using the public interface
    // workout.click();
  }

  _editWorkout(workout) {
    // this._showForm();
    this._showUpdateForm();

    updatedInputType.value = workout.type;
    updatedInputDistance.value = workout.distance;
    updatedInputDuration.value = workout.duration;
    workout.coords = workout.coords;

    if (workout.type === 'running') {
      updatedInputCadence.value = workout.cadence;
      // inputCadence.closest('.form__row').classList.toggle('form__row--hidden');

      updatedInputElevation
        .closest('.form__row')
        .classList.add('form__row--hidden');
      updatedInputCadence
        .closest('.form__row')
        .classList.remove('form__row--hidden');
    }

    if (workout.type === 'cycling') {
      updatedInputElevation.value = workout.elevationGain;
      // inputElevation
      //   .closest('.form__row')
      //   .classList.toggle('form__row--hidden');

      updatedInputCadence
        .closest('.form__row')
        .classList.add('form__row--hidden');
      updatedInputElevation
        .closest('.form__row')
        .classList.remove('form__row--hidden');
    }

    this._getWorkoutToEdition(workout);
  }

  _getWorkoutToEdition(workout) {
    console.log(workout);
    return workout
  }

  _updateWorkout(workouts, e) {
    e.preventDefault();
    

    workouts.forEach(work => {
      console.log(work);
    })


    // this.#workouts.forEach(work => {
    //   work.id === workout.id;

    //   work.type = updatedInputType.value;
    //   work.distance = updatedInputDistance.value;
    //   work.duration = updatedInputDuration.value;
    //   work.coords = workout.coords;

    //   if (work.type === 'running')
    //   work.cadence = updatedInputCadence.value;
    //   if (work.type === 'cycling')
    //   work.elevationGain = updatedInputElevation.value;
    //   workout[index] = work
    // });

    // console.log(workout);
  }

  _deleteWorkout(workout, html, e) {
    // const w = containerWorkouts.querySelectorAll('.workout');
    // console.log(w);
    console.log(workout);
    console.log(this.#workouts);

    const workoutEl = e.target.closest('.workout');

    workoutEl.remove(html);

    const index = this.#workouts.indexOf(workout);
    console.log(index);
    if (index > -1) this.#workouts.splice(index, 1);

    this._setLocalStorage();
    location.reload();

    console.log(this.#workouts);
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    //setItem() jako parametr przyjmuje key-value pair
    // JSON.stringify() -> zmienia obiekt w string

    // !! when we convert objects to string and then to object they are loosing theirs prototypes, prototypes chain and they are regular objects. They are loosing tjeir inheritance !!
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts')); // convert string to JS

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  reset() {
    localStorage.removeItem('workouts'); // removing items by a key
    location.reload(); // reload the page
  }
}

const app = new App();
