
/**
 * In order to use the Stepper class, your board must be flashed with
 * either of the following:
 *
 * - AdvancedFirmata https://github.com/soundanalogous/AdvancedFirmata
 * - ConfigurableFirmata https://github.com/firmata/arduino/releases/tag/v2.6.2
 *
 */
const { Stepper } = require("johnny-five");
const { stepsPerRev, rpm, acceleration, deceleration, limits } = require('./config');


// Reference: http://johnny-five.io/examples/stepper-driver/
// Reference: https://www.instructables.com/Stepper-Motor-With-Arduino-UNO/

const stepperStep = (stepper, steps) =>  {
  return new Promise((resolve) => {
    let direction = steps > 0 ?             // if _steps is positive
                    Stepper.DIRECTION.CW    // spin the motor clockwise
                  : Stepper.DIRECTION.CCW;  // else spin counter-clockwise

    stepper.step({
      steps: Math.abs(steps), // spin the motor for _steps
      direction               // in the direction determined above
    },
    () => resolve(steps));
  });
};

class Motor {
  stepper;  // the stepper motor instance referred to here 
  spinning = false; // a lock to establish critical section(i.e. already spinning) for motor.

  /**
   * 
   * @param {number} step Step pin connected to stepper driver.
   * @param {number} dir Dir pin connected to stepper driver.
   * @param {object} config (optional) configuration variables.
   */
  constructor(step, dir, config={}) {
    if(typeof step !== 'number' && typeof dir !== 'number')
      throw 'step and dir values expect pin numbers.';
    
    this.stepper = new Stepper({
      type: Stepper.TYPE.DRIVER,
      stepsPerRev: config.stepsPerRev || stepsPerRev,
      pins: { step, dir, }
    });

    this.stepper
    .cw()                                 // Set the default spin to clockwise.
    .rpm(config.rpm || rpm)               // Set the Motor RPM,
    // .accel(config.accel || acceleration)  // the acceleration,
    // .decel(config.decel || deceleration); // and the deceleration.
  }

  /**
   * Spins the motor a fixed number of steps. 
   * The sign of the number entered determines the motor spin direction.
   * Enter positive number for clockwise, negative number for anti-clockwise.
   * @param {number} steps The number of steps to spin.
   * @returns {Promise} Resolves on success, rejects if already spinning.
   */
  async step(steps) {
    if(!this.Spinning()) {      // if not already spinning
      this.setSpinning(true);   // enter critical section (motor now spinning)
      return await stepperStep(this.stepper, steps)  // actually start the motor spinning
      .then(() => this.setSpinning(false));   // leave critical section after spinning
    } else throw 'Already spinning';  // throw if already spinning
  }

  setSpinning(value) {
    return (this.spinning = value);
  }

  Spinning() {
    return this.spinning;
  }
}

module.exports = { Motor };