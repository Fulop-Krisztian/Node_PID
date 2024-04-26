// PID in node. God help us all.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// DEFINITIONS
// the value the system should aim for 
var setPoint = 100;
// the current value of the system
var current = 3000;
var prevcurr = -1;
// how far we are from where we want to be
// let error: number = 0
// used for the derivative calculation
var preverror = 0;
// derivative
// let derivative: number = 0
// integral
// let integral: number = 0
// integral accumulator, accumulating the error over time:
var intacc = 0;
// the change we will make on the system
// let output: number = 0
// the interval between out measurements. Could use the actual process time in the future.
var interval = 1;
// renders a bar. In the console no less. 
function renderbar(current) {
    // we should render the setpoint at 75% of the length. 
    var setPointLinePos = 0.50;
    // The length of the decor on the bar
    // it will look something like this:
    //<#############---|--->23.00/123.33
    var decorlength = current.toString.length + setPoint.toString.length + 3; // 3 for the < > /
    // The length of the bar in characters. Currently it's the length of the console -10 chars, or 80 chars if the length is undefined
    var barlength = process.stdout.columns - decorlength - 10 || 80;
    var bar = '';
    /*
     * to be implemented
    const ZFL = 0 // zoomfromleft
    const ZFR = 0 // zoomfromright
     */
    for (var index = 0; index < barlength; index++) {
        if (current / setPoint * (barlength * setPointLinePos) > index) {
            bar += '#';
        }
        else if (index === Math.trunc(setPointLinePos * barlength)) {
            bar += '|';
        }
        else {
            bar += '-';
        }
    }
    // let fullbar: string = `<${bar}>${current}/${setPoint}`
    // Where the magic happens
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write("<".concat(bar, ">").concat(Math.trunc(current), "/").concat(Math.trunc(setPoint)));
}
function PID(sp, cur, ks, kp, kd, ki, time) {
    // kp, kd, and ki are the multipliers for each of the controls. (higher means higher priority, could easily unbalance the system) 
    // ks is a strength multiplier
    var err = sp - cur;
    var drive = kp * err;
    var derivativeDrive = kd * calcDerivative(err, preverror, time);
    var integralDrive = ki * calcIntegral(err, intacc, time);
    //console.log(drive,derivativeDrive,integralDrive)
    var output = drive + derivativeDrive + integralDrive; // proportional + derivative + integral drive. numbers should be tuned for best results
    //console.log(current)
    //console.log(output)
    current = current + (output * ks);
    //console.log(current)
    return current;
}
function calcDerivative(error, perror, interval) {
    var derivative = (error - perror) / interval;
    preverror = error;
    return derivative;
}
function calcIntegral(error, acc, interval) {
    var integral = acc + (error * interval);
    intacc = integral;
    return integral;
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var index, value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < 1000)) return [3 /*break*/, 4];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 20); })];
                case 2:
                    _a.sent();
                    value = PID(setPoint, current, 0.5, 0.5, 0.5, 0.3, 1);
                    renderbar(value);
                    setPoint = setPoint + index / 2;
                    if (index % 129 === 0) {
                        setPoint = setPoint / 3 - setPoint / 2 + index;
                    }
                    _a.label = 3;
                case 3:
                    index++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main();
