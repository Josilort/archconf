"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openUrl = exports.getCurrentDocument = exports.getWorkspaceFolder = exports.getCwd = exports.getWorkspaceConfig = exports.getVExecCommand = void 0;
const vscode_1 = require("vscode");
const os_1 = require("os");
const child_process_1 = require("child_process");
const defaultCommand = 'v';
/** Get V executable command.
 * Will get from user setting configuration first.
 * If user don't specify it, then get default command
 */
function getVExecCommand() {
    const config = getWorkspaceConfig();
    const vPath = config.get('pathToExecutableFile', '') || defaultCommand;
    return vPath;
}
exports.getVExecCommand = getVExecCommand;
/** Get V configuration. */
function getWorkspaceConfig() {
    const currentWorkspaceFolder = getWorkspaceFolder();
    return vscode_1.workspace.getConfiguration('v', currentWorkspaceFolder.uri);
}
exports.getWorkspaceConfig = getWorkspaceConfig;
/** Get current working directory.
 * @param uri The URI of document
 */
function getCwd(uri) {
    const folder = getWorkspaceFolder(uri || null);
    return folder.uri.fsPath;
}
exports.getCwd = getCwd;
/** Get workspace of current document.
 * @param uri The URI of document
 */
function getWorkspaceFolder(uri) {
    if (uri)
        return vscode_1.workspace.getWorkspaceFolder(uri);
    const currentDoc = getCurrentDocument();
    return currentDoc
        ? vscode_1.workspace.getWorkspaceFolder(currentDoc.uri)
        : vscode_1.workspace.workspaceFolders[0];
}
exports.getWorkspaceFolder = getWorkspaceFolder;
function getCurrentDocument() {
    return vscode_1.window.activeTextEditor ? vscode_1.window.activeTextEditor.document : null;
}
exports.getCurrentDocument = getCurrentDocument;
function openUrl(url) {
    const os = os_1.platform();
    const open = {
        win32: 'start',
        linux: 'xdg-open',
        darwin: 'open',
    };
    child_process_1.execFileSync(open[os], [url]);
}
exports.openUrl = openUrl;
//# sourceMappingURL=utils.js.map