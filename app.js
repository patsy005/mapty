class Workout {
  date = new Date();
  id = Math.random() * 10.56;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
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
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// add new workout inputs
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

// class Map {
//   map;
//   mapZoomLevel = 13;
//   //   mapEvent;

//   constructor(workouts, mapEvent) {
//     this.workouts = workouts;
//     this.workouts = [];
//     this.mapEvent = mapEvent;
//     // this.showForm = showForm;
//     this.getPosition();
//   }

//   getPosition() {
//     if (navigator.geolocation)
//       navigator.geolocation.getCurrentPosition(this.loadMap.bind(this), () => {
//         alert('Could not get your position');
//       });
//   }

//   loadMap(position) {
//     const { latitude } = position.coords;
//     const { longitude } = position.coords;
//     // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

//     const coords = [latitude, longitude];

//     this.map = L.map('map').setView(coords, this.mapZoomLevel);

//     L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     }).addTo(this.map);

//     console.log(this.map);

//     const form = new AddWOrkoutFormHandling();
//     console.log(form);
//     this.showForm = form.showForm;
//     // const showFormHandler = form.showForm;
//     this.map.on('click', this.showForm.bind(this));

//     this.workouts.forEach(work => {
//       this._renderWorkoutMarker(work);
//     });
//     return this.map;
//   }

//   static getMapEvent(mapE) {
//     this.mapEvent = mapE;
//     console.log(mapE);
//   }

//   renderWorkoutMarker(workout) {
//     // display marker

//     L.marker(workout.coords)
//       .addTo(this.map)
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
// }

// class AddWOrkoutFormHandling {
//   constructor(mapEvent) {
//     this.mapEvent = mapEvent;
//     inputType.addEventListener('change', this.toggleElevationField);
//   }

//   //   getMapEvent(mapE) {
//   //     return mapE;
//   //   }

//   showForm(mapE) {
//     this.mapEvent = mapE;
//     form.classList.remove('hidden');
//     inputDistance.focus();
//     console.log('dupa');
//     console.log(mapE);
//     console.log(form);
//     console.log(this.mapEvent.latlng);
//     WorkoutList.renderWorkout(mapE);
//     // WorkoutList.getMapEvent(mapE);
//     return mapE;

//     return this.mapEvent;
//   }

//   toggleElevationField() {
//     inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
//     inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
//     console.log(this.mapEvent);
//   }
// }

// class WorkoutItem {
//   constructor(workout) {
//     this.workout = workout;
//   }

//   renderWorkout() {
//     let html = `
//         <li class="workout workout--${this.workout.type}" data-id="${
//       this.workout.id
//     }">
//             <div class="workout__top">
//                 <h2 class="workout__title">${this.workout.description}</h2>
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
//                   this.workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
//                 }</span>
//                 <span class="workout__value">${this.workout.distance}</span>
//                 <span class="workout__unit">km</span>
//             </div>
//             <div class="workout__details">
//                 <span class="workout__icon">⏱</span>
//                 <span class="workout__value">${this.workout.duration}</span>
//                 <span class="workout__unit">min</span>
//             </div>
//     `;

//     if (this.workout.type === 'running') {
//       html += `
//             <div class="workout__details">
//                 <span class="workout__icon">⚡️</span>
//                 <span class="workout__value">${this.workout.pace.toFixed(
//                   1
//                 )}</span>
//                 <span class="workout__unit">min/km</span>
//             </div>
//             <div class="workout__details">
//                 <span class="workout__icon">🦶🏼</span>
//                 <span class="workout__value">${this.workout.cadence}</span>
//                 <span class="workout__unit">spm</span>
//             </div>
//         </li>
//         `;
//     }

//     if (this.workout.type === 'cycling') {
//       html += `
//             <div class="workout__details">
//                 <span class="workout__icon">⚡️</span>
//                 <span class="workout__value">${this.workout.speed.toFixed(
//                   1
//                 )}</span>
//                 <span class="workout__unit">km/h</span>
//             </div>
//             <div class="workout__details">
//                 <span class="workout__icon">⛰</span>
//                 <span class="workout__value">${
//                   this.workout.elevationGain
//                 }</span>
//                 <span class="workout__unit">m</span>
//             </div>
//         </li>
//         `;
//     }

//     form.insertAdjacentHTML('afterend', html);

//     return html;
//   }
// }

// class WorkoutList {
//   workouts = [];
//   mapEvent;

//   constructor() {
//     WorkoutList.renderWorkout();
//     form.addEventListener('submit', e => {
//       e.preventDefault();
//       this.render();
//     });
//   }

//   //   static getMapEvent(mapE) {
//   //     this.mapEvent = mapE;
//   //     console.log(mapE);
//   //     return mapE;
//   //   }

//   static renderWorkout(mapE) {
//     this.mapEvent = mapE;

//     console.log(mapE);
//     console.log(this.mapEvent);

//     // const { lat, lng } = this.mapEvent.latlng;
//     console.log(mapE);

//     return mapE;
//   }

//   render(mapE, workout) {
//     WorkoutList.renderWorkout(mapE);
//     this.mapEvent = mapE;
//     console.log(this.mapEvent);
//     const type = inputType.value;
//     const distance = +inputDistance.value;
//     const duration = +inputDuration.value;
//     if (!this.mapEvent) {
//       return;
//     }

//     const { lat, lng } = this.mapEvent.latlng;
//     console.log(lat);

//     const validInputs = (...inputs) => {
//       inputs.every(inp => Number.isFinite(inp));
//     };

//     const allPositive = (...inputs) => {
//       inputs.every(inp => inp > 0);
//     };

//     if (type === 'running') {
//       const cadende = +inputCadence.value;
//       if (
//         !validInputs(
//           distance,
//           duration,
//           cadende || !allPositive(distance, duration, cadende)
//         )
//       ) {
//         return alert('Inputs has to be positive values!');
//       }

//       workout = new Running([lat, lng], distance, duration, cadende);
//     }

//     if (type === 'cycling') {
//       const elevation = +inputElevation.value;

//       if (
//         !validInputs(
//           distance,
//           duration,
//           elevation || !allPositive(distance, duration)
//         )
//       ) {
//         return alert('Inputs has to be positive values!');
//       }

//       workout = new Cycling([lat, lng], distance, duration, elevation);
//     }

//     for (const work of this.workouts) {
//       this.workouts.push(new WorkoutItem(work));
//       console.log(this.workouts);
//     }

//     return mapE, workout;
//   }
// }

// class App {
//   static init() {
//     const map = new Map();
//     // console.log(map);
//     // WorkoutList.render();
//     const workoutList = new WorkoutList();
//     // workoutList.render();
//   }
// }

// App.init();


