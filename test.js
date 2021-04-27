/**
 * This file assumes the following:
 * - A single stepper motor.
 * - The stepper driver is connected to: { step: 12, dir: 11}
 * - The Arduino is already burnt with ConfigurableFirmata, properly configured.
 */
const { Board } = require('johnny-five');
const board = new Board();
const { Motor } = require('./index');

board.on("ready", () => {
    // const motor = new Motor(12, 11);

    // motor
    //     .step(400)
    //     .then(c => console.log(`Done spinning ${c ? 'CW' : 'CCW'}`))
    //     .catch(e => console.log("Failed to spin motor. Reason:", e));
    console.log("Board ready");
});