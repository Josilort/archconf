"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVls = exports.devbitsPlayground = exports.ver = exports.prod = exports.run = void 0;
const vscode_1 = require("vscode");
const exec_1 = require("./exec");
const langserver_1 = require("./langserver");
/** Run current file. */
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const document = vscode_1.window.activeTextEditor.document;
        yield document.save();
        const filePath = `"${document.fileName}"`;
        exec_1.execVInTerminal(['run', filePath]);
    });
}
exports.run = run;
/** Build an optimized executable from current file. */
function prod() {
    return __awaiter(this, void 0, void 0, function* () {
        const document = vscode_1.window.activeTextEditor.document;
        yield document.save();
        const filePath = `"${document.fileName}"`;
        exec_1.execVInTerminal(['-prod', filePath]);
    });
}
exports.prod = prod;
/** Show version info. */
function ver() {
    exec_1.execV(['-version'], (err, stdout) => {
        if (err) {
            void vscode_1.window.showErrorMessage('Unable to get the version number. Is V installed correctly?');
            return;
        }
        void vscode_1.window.showInformationMessage(stdout);
    });
}
exports.ver = ver;
/** Open current code on DevBits V playground. */
function devbitsPlayground() {
    const url = 'https://devbits.app/play?lang=v&code64=';
    const code = vscode_1.window.activeTextEditor.document.getText();
    const base64Code = Buffer.from(code).toString('base64');
    void vscode_1.env.openExternal(vscode_1.Uri.parse(url + base64Code));
}
exports.devbitsPlayground = devbitsPlayground;
function updateVls() {
    void langserver_1.installVls();
}
exports.updateVls = updateVls;
//# sourceMappingURL=commands.js.map