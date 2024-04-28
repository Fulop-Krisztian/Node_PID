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

// renders a bar. In the console no less. 
function renderbar(curr: number, sp: number, width?: number) {

    // we should render the setpoint at 75% of the length. 
    const setPointLinePos: number = 0.75

    // The length of the decor on the bar
    // it will look something like this:
    //<#############---|--->23.00/123.33
    const decorlength: number = current.toString.length + sp.toString.length + 3 // 3 for the < > /

    // The length of the bar in characters. Currently it's the length of the console -10 chars, or 80 chars if the length is undefined
    const barlength: number = process.stdout.columns - decorlength - 10 || 80
    let bar: string = ''

    /*
     * to be implemented
    const ZFL = 0 // zoomfromleft
    const ZFR = 0 // zoomfromright
     */

    for (let index = 0; index < barlength; index++) {
        if (curr / sp * (barlength * setPointLinePos) > index) {
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
    process.stdout.write(`<${bar}>${Math.trunc(curr)}/${Math.trunc(sp)}`)
}

function renderbar2(crnt: number, sp: number, width: number) {

    // multi character support to be implemented
    function renderrow(character: string, width: number) {
        const stringlength = character.length
        let row: string = ''
        for (let index = 0; index < width; index += stringlength) {
            row += character;
        }
        row += '\n'
        return row
    }

    // we should render the setpoint at 75% of the length. 
    const setPointLinePos: number = 0.50

    // decoration in the vertical direction
    const decorheight: number = 1
    const decorlength: number = 0

    const barheight: number = (Math.trunc((process.stdout.rows - decorheight) * 0.9)) || 30
    const barlength: number = width //(process.stdout.columns - decorlength - 10) || 80

    let bar: string = ''
    bar += `${crnt}/${sp}\n`
    renderrow('-', barlength)

    for (let index = 0; index < barheight; index++) {
        if ((crnt / sp) * (barheight * setPointLinePos) < index) {
            bar += renderrow('#', barlength)
        }
        else if (index === Math.trunc(setPointLinePos * barheight)) {
            bar += renderrow('—', barlength)
        }
        else {
            bar += renderrow(' ', barlength)
        }
    }
    console.log(bar + '\n')
    return bar
}

function rendergraph() {

}


// PID takes in variables about the system and returns the current predicted drive we should have in the system
function PID(sp: number, cur: number, kp: number, kd: number, ki: number, time: number): number {

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

    // kp, kd, and ki are the multipliers for each of the controls. (higher means higher priority, could easily unbalance the system) 
    // ks is a strength multiplier
    const err = sp - cur

    const drive = kp * err
    const derivativeDrive = kd * calcDerivative(err, preverror, time)
    const integralDrive = ki * calcIntegral(err, intacc, time)
    console.log(drive,derivativeDrive,integralDrive)
    const output = drive + derivativeDrive + integralDrive // proportional + derivative + integral drive. numbers should be tuned for best results
    //console.log(current)
    //console.log(output)
    // current = current + (output * ks)
    //console.log(current)

    // In the future this should be used as just a drive for an actual thruster or something, right now it's a linear function from output to actual effect. (perfect controls)
    // Perfect controls are not realistic, but realism requires physics
    return output
}



async function main() {
    for (let index = 0; index < 100; index++) {
        //sleep
        await new Promise(resolve => setTimeout(resolve, 16));

        const drive = PID(setPoint, current, 1, 0.1, 0.1, 1)


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