"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateVls = exports.activateVls = exports.connectVls = exports.installVls = exports.isVlsInstalled = exports.checkIsVlsInstalled = exports.client = exports.vlsPath = void 0;
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = __importDefault(require("child_process"));
const util_1 = __importDefault(require("util"));
const net = __importStar(require("net"));
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const utils_1 = require("./utils");
const status_1 = require("./status");
const execAsync = util_1.default.promisify(child_process_1.default.exec);
const mkdirAsync = util_1.default.promisify(fs_1.default.mkdir);
const existsAsync = util_1.default.promisify(fs_1.default.exists);
const vlsDir = path_1.default.join(os_1.default.homedir(), '.vls');
const vlsBin = path_1.default.join(vlsDir, 'bin');
const vexe = utils_1.getVExecCommand();
const isWin = process.platform === 'win32';
exports.vlsPath = path_1.default.join(vlsBin, isWin ? 'vls.exe' : 'vls');
function checkIsVlsInstalled() {
    return __awaiter(this, void 0, void 0, function* () {
        const vlsInstalled = yield isVlsInstalled();
        if (!vlsInstalled) {
            const selected = yield vscode_1.window.showInformationMessage('VLS is not installed. Do you want to install it now?', 'Yes', 'No');
            if (selected === 'Yes') {
                yield installVls();
                return yield isVlsInstalled();
            }
            else {
                return false;
            }
        }
        return true;
    });
}
exports.checkIsVlsInstalled = checkIsVlsInstalled;
function isVlsInstalled() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield existsAsync(exports.vlsPath);
    });
}
exports.isVlsInstalled = isVlsInstalled;
function installVls() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield vscode_1.window.withProgress({
                location: vscode_1.ProgressLocation.Notification,
                title: 'Installing VLS',
                cancellable: false,
            }, (progress) => __awaiter(this, void 0, void 0, function* () {
                progress.report({ message: 'Fetching module' });
                const existsVlsDir = yield existsAsync(vlsDir);
                if (existsVlsDir) {
                    yield execAsync('git clean -xf', { maxBuffer: Infinity, cwd: vlsDir });
                    yield execAsync('git pull --rebase origin master', { maxBuffer: Infinity, cwd: vlsDir });
                }
                else {
                    yield execAsync(`git clone --single-branch https://github.com/vlang/vls ${vlsDir}`, { maxBuffer: Infinity });
                }
                progress.report({ message: 'Creating ~/.vls/bin' });
                // build vls module to ~/.vmodules/bin
                const existsVBin = yield existsAsync(vlsBin);
                if (!existsVBin) {
                    yield mkdirAsync(vlsBin);
                }
                progress.report({ message: 'Building module' });
                // TODO: add -gc boehm when libgc library is not needed anymore
                yield execAsync(`${vexe} -prod -o ${exports.vlsPath} cmd/vls`, { maxBuffer: Infinity, cwd: vlsDir });
            }));
        }
        catch (e) {
            status_1.outputChannel.appendLine(e);
            status_1.outputChannel.show();
            yield vscode_1.window.showErrorMessage('Failed installing VLS. See output for more information.');
        }
    });
}
exports.installVls = installVls;
function connectVlsViaTcp(vlsPath, args, port, isRemote) {
    if (!isRemote) {
        child_process_1.default.spawn(vlsPath.trim(), args);
    }
    let socket = net.connect({ port: port });
    let result = {
        writer: socket,
        reader: socket
    };
    return Promise.resolve(result);
}
function connectVlsViaStdio(vlsPath, args) {
    return Promise.resolve(child_process_1.default.spawn(vlsPath.trim(), args));
}
function connectVls(pathToVls, context) {
    // Arguments to be passed to VLS
    const vlsArgs = [];
    const connMode = utils_1.getWorkspaceConfig().get('vls.connectionMode');
    const isDebug = utils_1.getWorkspaceConfig().get('vls.debug');
    const customVrootPath = utils_1.getWorkspaceConfig().get('vls.customVrootPath');
    const enableFeatures = utils_1.getWorkspaceConfig().get('vls.enableFeatures');
    const disableFeatures = utils_1.getWorkspaceConfig().get('vls.disableFeatures');
    const tcpPort = utils_1.getWorkspaceConfig().get('vls.tcpMode.port');
    const tcpUseRemote = utils_1.getWorkspaceConfig().get('v.vls.tcpMode.useRemoteServer');
    if (enableFeatures.length > 0) {
        vlsArgs.push(`--enable=${enableFeatures}`);
    }
    if (disableFeatures.length > 0) {
        vlsArgs.push(`--disable=${disableFeatures}`);
    }
    if (customVrootPath.length != 0) {
        vlsArgs.push(`--vroot=${customVrootPath}`);
    }
    if (isDebug) {
        vlsArgs.push('--debug');
    }
    if (connMode == 'tcp') {
        vlsArgs.push('--socket');
        vlsArgs.push(`--port=${tcpPort}`);
    }
    let serverOptions = connMode == 'tcp'
        ? () => connectVlsViaTcp(pathToVls, vlsArgs, tcpPort, tcpUseRemote)
        : () => connectVlsViaStdio(pathToVls, vlsArgs);
    // LSP Client options
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'v' }],
        synchronize: {
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/*.v')
        },
    };
    exports.client = new node_1.LanguageClient('V Language Server', serverOptions, clientOptions, true);
    exports.client.onReady()
        .then(() => {
        vscode_1.window.setStatusBarMessage('The V language server is ready.', 3000);
    })
        .catch(() => {
        vscode_1.window.setStatusBarMessage('The V language server failed to initialize.', 3000);
    });
    context.subscriptions.push(exports.client.start());
}
exports.connectVls = connectVls;
function activateVls(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const customVlsPath = utils_1.getWorkspaceConfig().get('vls.customPath');
        if (!customVlsPath) {
            // if no vls path is given, try to used the installed one or install it.
            const installed = yield checkIsVlsInstalled();
            if (installed) {
                connectVls(exports.vlsPath, context);
            }
        }
        else {
            connectVls(customVlsPath, context);
        }
    });
}
exports.activateVls = activateVls;
function deactivateVls() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports.client) {
            return;
        }
        yield exports.client.stop();
    });
}
exports.deactivateVls = deactivateVls;
//# sourceMappingURL=langserver.js.map