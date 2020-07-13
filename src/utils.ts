import * as vscode from 'vscode'

const CMND_NAME = 'gotoPackage.removePackage'
const TERMNL_WINDOW: string = 'Goto Package: Remove'

export function getPackageLines(document: any, regex: any) {
    let isLineInDependencyScope = false

    return new Array(document.lineCount).fill('')
        .map((line, idx) => document.lineAt(idx))
        .filter((line) => {
            const {text} = line

            if (isDependency(text, regex)) {
                isLineInDependencyScope = true

                return false
            }

            if (isLineInDependencyScope && /},?/.test(text)) {
                isLineInDependencyScope = false
            }

            return isLineInDependencyScope
        })
}

function isDependency(text: any, regex: any) {
    return regex.test(text)
}

export function isSupported(document: any, type: any) {
    return document.fileName.endsWith(type)
}

export function getInternalLink(range: any, path: any, pkgPath: any) {
    let link = new vscode.DocumentLink(range, path)
    link.tooltip = pkgPath

    return link
}

export function getExternalUrl(range: any, url: any) {
    let link = new vscode.DocumentLink(range, vscode.Uri.parse(`${url}`))
    link.tooltip = url

    return link
}

export function getCmndLink(range: any, pkg: any, cmnd: any) {
    let args = [{cmnd: `${cmnd}${pkg}`, pkg: pkg}]
    let link = new vscode.DocumentLink(range, vscode.Uri.parse(`command:${CMND_NAME}?${encodeURIComponent(JSON.stringify(args))}`))
    link.tooltip = `remove "${pkg}"`

    return link
}

export function getPath(workspaceFolder: any, pkgPath: any, file_to_open: any) {
    return vscode.Uri.file(`${workspaceFolder}/${pkgPath}/${file_to_open}`)
}

export function getRange(text: any, pkg: any, lineNumber: any) {
    let offset = text.indexOf(pkg)

    return new vscode.Range(
        new vscode.Position(lineNumber, offset),
        new vscode.Position(lineNumber, offset + pkg.length)
    )
}

export function getTerminalWindow() {
    let terminal
    let trmnls = vscode.window.terminals

    for (let index = 0; index < trmnls.length; index++) {
        const trmnl = trmnls[index]

        if (trmnl.name == TERMNL_WINDOW) {
            terminal = trmnl
            break
        }
    }

    return terminal || vscode.window.createTerminal(TERMNL_WINDOW)
}

/* Config ------------------------------------------------------------------- */
export let supportList: any = []

export function readConfig() {
    let config = vscode.workspace.getConfiguration('goto_package')

    supportList = config.pMList
}
