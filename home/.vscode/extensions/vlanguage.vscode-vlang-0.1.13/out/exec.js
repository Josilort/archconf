"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachOnCloseTerminalListener = exports.execV = exports.execVInTerminal = void 0;
const vscode_1 = require("vscode");
const utils_1 = require("./utils");
const child_process_1 = require("child_process");
let vRunTerm = null;
function execVInTerminal(args) {
    const vexec = utils_1.getVExecCommand();
    const cmd = `${vexec} ${args.join(' ')}`;
    if (!vRunTerm)
        vRunTerm = vscode_1.window.createTerminal('V');
    vRunTerm.show();
    vRunTerm.sendText(cmd);
}
exports.execVInTerminal = execVInTerminal;
function execV(args, callback) {
    const vexec = utils_1.getVExecCommand();
    const cwd = utils_1.getCwd();
    // console.log(`Executing ${vexec} ${args.join(" ")} on ${cwd}`);
    child_process_1.execFile(vexec, args, { cwd }, (err, stdout, stderr) => {
        callback(err, stdout, stderr);
    });
}
exports.execV = execV;
function attachOnCloseTerminalListener() {
    return vscode_1.window.onDidCloseTerminal((term) => {
        if (term.name == 'V')
            vRunTerm = null;
    });
}
exports.attachOnCloseTerminalListener = attachOnCloseTerminalListener;
//# sourceMappingURL=exec.js.map