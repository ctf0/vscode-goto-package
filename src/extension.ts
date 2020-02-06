import * as vscode from 'vscode'
import LinkProvider from './provider'

const debounce = require('lodash.debounce')
let providers: any = []

export function activate() {
    clearAll()
    initProvider()
}

const initProvider = debounce(function () {
    return providers.push(
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
