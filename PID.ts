// PID in node. God help us all.

// DEFINITIONS

// the value the system should aim for 
let setPoint: number = 100

// the current value of the system
let current: number = 3000
let prevcurr: number = -1
// how far we are from where we want to be
// let error: number = 0

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

// renders a bar. In the console no less. 
function renderbar(current: number) {

    // we should render the setpoint at 75% of the length. 
    const setPointLinePos: number = 0.50

    // The length of the decor on the bar
    // it will look something like this:
    //<#############---|--->23.00/123.33
    const decorlength: number = current.toString.length + setPoint.toString.length + 3 // 3 for the < > /

    // The length of the bar in characters. Currently it's the length of the console -10 chars, or 80 chars if the length is undefined
    const barlength: number = process.stdout.columns - decorlength - 10 || 80
    let bar: string = ''

    /*
     * to be implemented
    const ZFL = 0 // zoomfromleft
    const ZFR = 0 // zoomfromright
     */

    for (let index = 0; index < barlength; index++) {
        if (current / setPoint * (barlength* setPointLinePos) > index) {
            bar += '#'
        }
        else if (index === Math.trunc(setPointLinePos * barlength)) {
            bar += '|'
        }
        else {
            bar += '-'
        }
    }

    // let fullbar: string = `<${bar}>${current}/${setPoint}`
    // Where the magic happens
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    process.stdout.write(`<${bar}>${Math.trunc(current)}/${Math.trunc(setPoint)}`)
}

function PID(sp: number, cur: number, ks: number,kp: number, kd: number, ki: number, time: number): number {
    // kp, kd, and ki are the multipliers for each of the controls. (higher means higher priority, could easily unbalance the system) 
    // ks is a strength multiplier
    const err = sp - cur

    const drive = kp * err
    const derivativeDrive = kd * calcDerivative(err, preverror, time)
    const integralDrive = ki * calcIntegral(err, intacc, time)
    //console.log(drive,derivativeDrive,integralDrive)
    const output = drive + derivativeDrive + integralDrive // proportional + derivative + integral drive. numbers should be tuned for best results
    //console.log(current)
    //console.log(output)
    current = current + (output*ks)
    //console.log(current)
    return current
}

function calcDerivative(error: number, perror: number, interval: number) {
    const derivative = (error - perror) / interval
    preverror = error
    return derivative
}

function calcIntegral(error: number, acc: number, interval: number) {
    const integral = acc + (error * interval)
    intacc = integral
    return integral
}


async function main() {
    for (let index = 0; index < 1000; index++) {
        await new Promise(resolve => setTimeout(resolve, 20));
        const value = PID(setPoint, current, 0.5, 0.5, 0.5, 0.3, 1)
        renderbar(value)
        setPoint = setPoint + index/2
        if (index % 129 === 0){
            setPoint = setPoint/3 - setPoint/2 + index
        }
    }
}


main()