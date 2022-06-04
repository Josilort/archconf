"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const exec_1 = require("./exec");
const utils_1 = require("./utils");
function format(document) {
    const vfmtArgs = utils_1.getWorkspaceConfig().get("format.args", "");
    const args = ["fmt", vfmtArgs, document.uri.fsPath];
    const range = utils_1.fullDocumentRange(document);
    console.log(range);
    return new Promise((resolve, reject) => {
        exec_1.execV(args, (err, stdout, stderr) => {
            if (err) {
                const errMessage = `Cannot format due to the following errors: ${stderr}`;
                vscode_1.window.showErrorMessage(errMessage);
                return reject(errMessage);
            }
            return resolve([vscode_1.TextEdit.replace(range, stdout)]);
        });
    });
}
function registerFormatter() {
    const provider = {
        provideDocumentFormattingEdits(document) {
            return format(document);
        }
    };
    return vscode_1.languages.registerDocumentFormattingEditProvider("v", provider);
}
exports.registerFormatter = registerFormatter;
//# sourceMappingURL=format.js.map