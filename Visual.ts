// renders a horizontal bar. In the console no less. 
//<#############---|--->23.00/123.33
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

// renders a bar, but vertically. Whoa

export function renderbar2(crnt: number, sp: number, renderstat?: boolean, width?: number, height?: number) {
    // we should render stats if it's not specified
    renderstat === undefined ? renderstat = true : null

    // we should render the setpoint at 75% of the length. 
    const setPointLinePos: number = 0.50

    // decoration in the vertical direction
    const decorheight: number = 1
    const decorlength: number = 0 // there won't be any decor length, suspect for removal

    const barheight: number = height || (Math.trunc((process.stdout.rows - decorheight) * 0.9)) || 30
    const barlength: number = width || 20 //(process.stdout.columns - decorlength - 10)

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

    let bar: string = ''
    if (renderstat) {
        bar += `${crnt}/${sp}\n`
        renderrow('-', barlength)
    }

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


// The graphing function
type bodystate = {
    crnt: number
    sp: number
}

let graphstore: bodystate[] = []
let biggeststate: number = 1

export function rendergraph(crnt: number, sp: number, width?: number, height?: number) {

    // what the setpoint should be considered in % of the graph height (%)
    // overridden if a value is too large
    const setPointLinePos: number = 0.50

    // decor sizes
    const decorwidth: number = 0
    const decorheight: number = 1

    // calculated size of the graphs, fitting the terminal
    const graphwidth: number = width || Math.trunc((process.stdout.columns - decorwidth)) || 60 //(process.stdout.columns - decorlength - 10)
    const graphheight: number = height || Math.trunc((process.stdout.rows - decorheight)) || 20

    // current state, we push this to the graphstore to update with the new state
    const state: bodystate = { crnt, sp }

    // check if this is the largest number yet
    if (state.crnt > biggeststate) { biggeststate = state.crnt }

    // push to the front of the graphstore. This is ready for rendering
    graphstore.unshift(state)

    if (graphstore.length > graphwidth) {
        graphstore.pop()
    }


    // slightly modified renderrow function
    function renderrow(character: string, width: number) {
        const stringlength = character.length
        let row: string = ''
        for (let index = 0; index < width; index += stringlength) {
            row += character;
        }
        return row
    }

    // This could be improved by prerendering entire colums, but I haven't written the efficient column rendering algorithm yet, so we stick with this.
    let render: string = ''
    const barwidth: number = 1 // graphwidth / graphstore.length

    // We render each row
    for (let yindex = 0; yindex < graphheight; yindex++) {

        // we don't need to look at all states, just the ones we render. This should be fixed in future
        for (const state of graphstore) {
            /* current/biggeststate: how much do we fulfill the setpoint (%) */
            if (yindex === Math.trunc((state.sp / biggeststate) * graphheight)) {
                if ((state.crnt / biggeststate) * graphheight > yindex) {
                    render += renderrow('=', barwidth)
                }
                else {
                    render += renderrow('—', barwidth)
                }
            }

            else if ((state.crnt / biggeststate) * graphheight > yindex) {
                render += renderrow(' ', barwidth)
            }

            else {
                render += renderrow('#', barwidth)
            }



            /**
            if (((state.crnt / sp) * (graphheight * setPointLinePos) < yindex)) {
                render += renderrow('#', 1)
            }
            else if (yindex === Math.trunc(setPointLinePos * barwidth)) {
                render += renderrow('—', barwidth)
            }
            else {
                render += renderrow(' ', barwidth)
            }
            
             */
        }
        render += '\n'
    }

    return render



}

