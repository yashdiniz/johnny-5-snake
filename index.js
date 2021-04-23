const {Board, Stepper, Led} = require("johnny-five");
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

  let spinning = false;
  const step = (steps, cw=true) => {
    if (!spinning) {
      spinning = true;
      stepper.step({
        steps,
        direction: cw ? Stepper.DIRECTION.CW : Stepper.DIRECTION.CCW,
      }, () => {
        spinning = false;
        console.log(`Done moving ${cw ? 'CW' : 'CCW'}`);
      });
    } else console.log("Already spinning...");
  }

  module.exports = { step };
});
