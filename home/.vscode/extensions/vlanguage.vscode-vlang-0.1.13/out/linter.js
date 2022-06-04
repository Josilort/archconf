"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const os_1 = require("os");
const utils_1 = require("./utils");
const exec_1 = require("./exec");
const path_1 = require("path");
const fs_1 = require("fs");
const outFile = path_1.join(os_1.tmpdir(), "vscode_vlang", "lint.c");
const collection = vscode_1.languages.createDiagnosticCollection("V");
const checkMainModule = (text) => !!text.match(/^\s*(module)+\s+main/);
const checkMainFn = (text) => !!text.match(/^\s*(fn)+\s+main/);
const allowGlobalsConfig = utils_1.getWorkspaceConfig().get("allowGlobals");
function lint(document) {
    const workspaceFolder = utils_1.getWorkspaceFolder(document.uri);
    // Don't lint files that are not in the workspace
    if (!workspaceFolder) {
        return;
    }
    const cwd = workspaceFolder.uri.fsPath;
    // Get folder path of current file
    const foldername = path_1.dirname(document.fileName);
    // Get all of .v files on the folder
    const vFiles = fs_1.readdirSync(foldername).filter((f) => f.endsWith(".v"));
    // Check if current file is a main module, will check if current file have a main function
    const isMainModule = checkMainModule(document.getText()) || checkMainFn(document.getText());
    const shared = !isMainModule ? "-shared" : "";
    let haveMultipleMainModule = vFiles.length > 1 && isMainModule;
    // If file have multiple main module
    // Recheck of each of v files on the folder, To check is a main module and have a main function
    if (haveMultipleMainModule) {
        let filesAreMainModule = false;
        vFiles.forEach((f) => __awaiter(this, void 0, void 0, function* () {
            f = path_1.resolve(foldername, f);
            const fDocument = yield vscode_1.workspace.openTextDocument(f);
            filesAreMainModule =
                checkMainModule(fDocument.getText()) || checkMainFn(fDocument.getText());
        }));
        haveMultipleMainModule = filesAreMainModule;
    }
    let target = foldername === cwd ? "." : path_1.join(".", path_1.relative(cwd, foldername));
    target = haveMultipleMainModule ? path_1.relative(cwd, document.fileName) : target;
    const globals = allowGlobalsConfig ? "--enable-globals" : "";
    exec_1.execV([globals, shared, "-o", outFile, target], (err, stdout, stderr) => {
        collection.clear();
        if (err || stderr.trim().length > 1) {
            const output = stderr || stdout;
            const lines = output.split("\n");
            for (const line of lines) {
                const cols = line.split(":");
                const isInfo = cols.length >= 5;
                const isError = isInfo && utils_1.trimBoth(cols[3]) === "error";
                const isWarning = isInfo && utils_1.trimBoth(cols[3]) === "warning";
                if (isError || isWarning) {
                    const file = cols[0];
                    const lineNum = parseInt(cols[1]);
                    const colNum = parseInt(cols[2]);
                    const message = cols.splice(4, cols.length - 1).join("");
                    const fileURI = vscode_1.Uri.file(path_1.resolve(cwd, file));
                    const range = new vscode_1.Range(lineNum - 1, colNum, lineNum - 1, colNum);
                    const diagnostic = new vscode_1.Diagnostic(range, message, isWarning ? vscode_1.DiagnosticSeverity.Warning : vscode_1.DiagnosticSeverity.Error);
                    diagnostic.source = "V";
                    collection.set(fileURI, [...collection.get(fileURI), diagnostic]);
                }
            }
        }
        else {
            collection.delete(document.uri);
        }
    });
}
exports.lint = lint;
function clear() {
    collection.clear();
}
exports.clear = clear;
function _delete(uri) {
    collection.delete(uri);
}
exports._delete = _delete;
//# sourceMappingURL=linter.js.map