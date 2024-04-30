import { renderbar, renderbar2, rendergraph } from "./Visual"
import { PID } from "./PID"
import { updateTerminal } from "./Terminalops"
import { stat } from "./@types"

// PID in node. God help us all.

// DEFINITIONS

// the value the system should aim for (designed for whole large (>100) numbers)
let setPoint: number = 100
// the current value of the system
let current: number = 0
let gravity: number = -10 // units/interval/interval
let resistance: number = 1 / 1000 // the divider is when the max drag is achieved compared to the speed

// the change we will make on the system
// let output: number = 0
// the interval between out measurements. Could use the actual process time in the future.
let interval: number = 1

// some numbers for the PID as an idea:
// 0.2, 0.1, 0.02 | This one is a good for showing oscillations. It eventually settles (old)

// 0.8, 0.5, 0.2, 1, 0.01 | debug this, I don't know what's going on. Perhaps intended, perhaps not. Good cityscape thouhgh

// Recommendations: Set the integral low, currently it's very simple and tends to cause a feedback loop


async function main() {
    let speed: number = 0
    for (let index = 0; index < 1000; index++) {
        //sleep
        await new Promise(resolve => setTimeout(resolve, 36));

        const drive = PID(setPoint, current, 0.4, 0.6, 0.04, 1, 1)

        // drag is calculated so the speed doesn't get too wacky (P is whatever you want it to be)
        const drag = (resistance/setPoint) * Math.pow(speed, 2);

        const accelaration = (drive * 0.4) + (interval * gravity)

        // Drag can't be bigger than the acceleration
        const dragspeedreduction = Math.min(Math.abs(accelaration), Math.abs(drag)) * ((speed > 0) ? 1 : -1)


        // speed = speed - (resistance * (speed * speed))

        // The drive and gravity are added to the speed
        // In the future the drive should just drive something, not directly act on the body. That's the whole point of a PID, the adaptability of it

        speed += (accelaration - dragspeedreduction)

        // we add the speed to the current position
        current += speed

        const stats: stat[] = [
            { name: 'PID Drive', var: drive }, // arbitrary. 
            { name: 'Gravity', var: gravity },
            { name: 'Speed', var: speed },
            { name: 'Acc', var: accelaration },
            { name: 'Drag speed reduction', var: dragspeedreduction },

        ]
        updateTerminal((rendergraph(current, setPoint) + renderbar(current, setPoint, stats,)))

    }
}

main()