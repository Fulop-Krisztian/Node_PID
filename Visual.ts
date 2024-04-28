// renders a bar. In the console no less. 
export function renderbar(curr: number, sp: number, width?: number) {

    // we should render the setpoint at 75% of the length. 
    const setPointLinePos: number = 0.75

    // The length of the decor on the bar
    // it will look something like this:
    //<#############---|--->23.00/123.33
    const decorlength: number = curr.toString.length + sp.toString.length + 3 // 3 for the < > /

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

export function renderbar2(crnt: number, sp: number, width: number) {

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
