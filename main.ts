import { renderbar, renderbar2, rendergraph } from "./Visual"
import { PID } from "./PID"
import { updateTerminal } from "./Terminalops"
import { stat } from "./@types"

// PID in node. God help us all.

// DEFINITIONS

// the value the system should aim for (designed for whole large (>100) numbers)
let setPoint: number = 200
// the current value of the system
let current: number = 300
let speed: number = 1000
let gravity: number = -10 // units/interval/interval
let resistance: number = 0.005

// the change we will make on the system
// let output: number = 0
// the interval between out measurements. Could use the actual process time in the future.
let interval: number = 1

// A few settings that
let debug = false


// some numbers for the PID as an idea:
// 0.2, 0.1, 0.02 | This one is a good for showing oscillations. It eventually settles


async function main() {
    for (let index = 0; index < 1000; index++) {
        //sleep
        await new Promise(resolve => setTimeout(resolve, 16));

        const drive = PID(setPoint, current, 0.2, 0.5, 0.1, 1)

        // drag is calculated so the speed doesn't get too wacky (P is whatever you want it to be)
        const dragCalculation = (resistance * Math.sqrt(speed));
        let drag: number = 0
        if (isNaN(dragCalculation) || Math.abs(dragCalculation) < 0.001) {
            drag = 0; // Set drag to 0 if it's NaN or very close to 0
        } else {
            drag = dragCalculation;
        }


        // speed = speed - (resistance * (speed * speed))

        // The drive and gravity are added to the speed
        // In the future the drive should just drive something, not directly act on the body. That's the whole point of a PID, the adaptability of it
        speed = speed + (drive * 1) + (interval * gravity) - drag

        // we add the speed to the current position
        current += speed
        /**
        if (debug) {
            console.log('\n')
            console.log('Node PID')
            console.log(`Thrust: ${drive}`)
            console.log(`Speed: ${speed}`)
        }


        */
        const stats: stat[] = [
            { name: 'Thrust', var: drive },
            { name: 'Gravity', var: gravity },
            { name: 'Speed', var: speed },
            { name: 'Drag', var: drag },

        ]
        updateTerminal((rendergraph(current, setPoint) + renderbar(current, setPoint, stats,)))


        // setPoint = setPoint + index / 2
        /**
        if (index % 129 === 0) {
            setPoint = setPoint / 3 - setPoint / 2 + index
        }
         */
    }
}

main()