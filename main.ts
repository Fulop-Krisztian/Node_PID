import { renderbar, renderbar2, rendergraph } from "./Visual"
import { PID } from "./PID"
import { updateTerminal } from "./Terminalops"
import { stat } from "./@types"

// PID in node. God help us all.

// DEFINITIONS

// the value the system should aim for (designed for whole large (>100) numbers)
let setPoint: number = 10000
// the current value of the system
let current: number = 0
let speed: number = 0
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


        // The drive and gravity are added to the speed
        speed = speed + drive * 1 + (interval * gravity)

        // drag is then calculated so the number doesn't get wacky (the correct formula is unused)

        // speed = speed - (resistance * (speed * speed))
        speed = speed - ((resistance * speed) * (resistance * setPoint))


        current += speed

        if (debug) {
            console.log('\n')
            console.log('Node PID')
            console.log(`Thrust: ${drive}`)
            console.log(`Speed: ${speed}`)
        }

        const stats: stat[] = [
            {name: 'Thrust', var: drive},
            {name: 'Speed', var: speed},
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