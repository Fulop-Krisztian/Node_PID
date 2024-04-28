import { renderbar, renderbar2 } from "./Visual"
import { PID } from "./PID"

// PID in node. God help us all.

// DEFINITIONS

// the value the system should aim for 
let setPoint: number = 100
// the current value of the system
let current: number = 0
let speed: number = 0
let gravity: number = -10 // units/interval/interval

let prevcurr: number = -1
// how far we are from where we want to be
// let error: number = 0
let resistance: number = 0.005

// used for the derivative calculation
let preverror: number = 0
// derivative
// let derivative: number = 0

// integral
// let integral: number = 0
// integral accumulator, accumulating the error over time:
let intacc: number = 0

// the change we will make on the system
// let output: number = 0
// the interval between out measurements. Could use the actual process time in the future.
let interval: number = 1


async function main() {
    for (let index = 0; index < 1000; index++) {
        //sleep
        await new Promise(resolve => setTimeout(resolve, 16));

        const drive = PID(setPoint, current, 1, 0.5, 0.1, 1)


        // The drive and gravity are added to the speed
        speed = speed + drive*0.2 + (interval * gravity)

        // drag is then calculated so the number doesn't get wacky
        speed = speed - (resistance*(speed*speed))


        current += speed

        console.log('Node PID')
        console.log(`Thrust: ${drive}`)
        console.log(`Speed: ${speed}`)
        renderbar(current, setPoint, 3)
        console.log('\n')

        // setPoint = setPoint + index / 2
        /**
        if (index % 129 === 0) {
            setPoint = setPoint / 3 - setPoint / 2 + index
        }
         */
    }
}

main()