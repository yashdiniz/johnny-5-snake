const {Board, Stepper} = require("johnny-five");
const board = new Board();
const { stepsPerRev, limits, dirPin, stepPin } = require('./config');

// Reference: http://johnny-five.io/examples/stepper-driver/

board.on("ready", () => {
  /**
   * In order to use the Stepper class, your board must be flashed with
   * either of the following:
   *
   * - AdvancedFirmata https://github.com/soundanalogous/AdvancedFirmata
   * - ConfigurableFirmata https://github.com/firmata/arduino/releases/tag/v2.6.2
   *
   */
  const stepper = new Stepper({
    type: Stepper.TYPE.DRIVER,
    stepsPerRev,
    pins: {
      step: stepPin,
      dir: dirPin,
    }
  });

  // Set stepper to 180 RPM, counter-clockwise with acceleration and deceleration
  stepper.rpm(180).ccw().accel(1600).decel(1600);
  
  // testing the motor to see if it drives 18 steps.
  stepper.step(limits, () => {
    console.log("Done moving CCW");
    // once first movement is done, make limits steps clockwise at previously
    // defined speed, accel, and decel by passing an object into stepper.step
    stepper.step({
      steps: limits,
      direction: Stepper.DIRECTION.CW
    }, () => console.log("Done moving CW"));
  });
});
