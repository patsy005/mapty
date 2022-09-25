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

