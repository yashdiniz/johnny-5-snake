const stepsPerRev = 200;    // 1 rotation = 360 deg
const limits = 20;  // the number of steps to limit the stepper to...

const dirPin = 11;
const stepPin = 12;

module.exports = {
    stepsPerRev, limits, dirPin, stepPin,
};