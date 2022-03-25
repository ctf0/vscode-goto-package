import * as vscode from 'vscode'
import * as utils from './utils'
import LinkProvider from './linkProvider'
import HoverProvider from './hoverProvider'
import { debounce } from 'lodash'

let providers: any = []

export function activate(context: any) {
    utils.readConfig()

    // config
    vscode.workspace.onDidChangeConfiguration(async (e) => {
        if (e.affectsConfiguration(utils.PACKAGE_NAME)) {
            utils.readConfig()
        }
    })

    clearAll()
    initProvider()

    context.subscriptions.push(
        vscode.commands.registerCommand(`${utils.CMND_NAME}`, ({cmnd, pkg}) => {
            let terminal: vscode.Terminal = utils.getTerminalWindow()
            terminal.show()
            // terminal.sendText(`echo ${cmnd}`)
            terminal.sendText(cmnd)
        })
    )
}

const initProvider = debounce(function() {
    return providers.push(
        vscode.languages.registerHoverProvider('json', new HoverProvider()),
        vscode.languages.registerDocumentLinkProvider('json', new LinkProvider())
    )
}, 250)

function clearAll() {
    providers.map((e: any) => e.dispose())
    providers = []
}

export function deactivate() {
    clearAll()
}
