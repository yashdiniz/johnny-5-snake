const stepsPerRev = 200;    // 1 revolution = 360 deg
const limits = 20;  // the number of steps to limit the stepper to...

const rpm = 180;
const acceleration = 1600;
const deceleration = 1600;

module.exports = {
    stepsPerRev, limits, rpm, acceleration, deceleration
};