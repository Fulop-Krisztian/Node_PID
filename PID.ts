// PID takes in variables about the system and returns the current predicted drive we should have in the system to achieve the setpoint.
// Over time the error approaches zero if it is tuned correctly

// persistent variables needed for functionality 
let preverror: number = 0
let intacc: number = 0

// kp, kd, and ki are the multipliers for each of the controls. (higher means higher priority, could easily unbalance the system) 
// time is for time elapsed since last run of function. always 1 if unset
export function PID(sp: number, cur: number, kp: number, kd: number, ki: number, time?: number): number {
    // if time is undefined set it to one
    time ? null : time = 1

    // Calcualtion of the derivative term
    function calcDerivative(error: number, perror: number, interval: number) {
        const derivative = (error - perror) / interval
        preverror = error
        return derivative
    }
    // Calculation of the integral term
    function calcIntegral(error: number, acc: number, interval: number) {
        const integral = acc + (error * interval)
        intacc = integral
        return integral
    }

    // Calculation of the error term
    const err = sp - cur

    const errorDrive = kp * err
    const derivativeDrive = kd * calcDerivative(err, preverror, time)
    const integralDrive = ki * calcIntegral(err, intacc, time)
    const output = errorDrive + derivativeDrive + integralDrive // proportional + derivative + integral drive. numbers should be tuned using kp, kd and ki for best results

    //console.log(errorDrive,derivativeDrive,integralDrive)
    //console.log(current)
    //console.log(output)
    // current = current + (output * ks)
    //console.log(current)

    // The output should be used as just a drive for an actual thruster or something that is not perfect.
    // Perfect controls are not realistic, but realism requires physics.

    return output
}

