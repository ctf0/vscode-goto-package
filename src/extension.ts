import * as vscode from 'vscode'
import LinkProvider from './provider'

let providers: any = []

export function activate() {
    clearAll()
    initProvider()
}

function initProvider() {
    return providers.push(
        vscode.languages.registerDocumentLinkProvider('json', new LinkProvider())
    )
}

function clearAll() {
    providers.map((e: any) => e.dispose())
    providers = []
}

export function deactivate() {
    clearAll()
}
