import * as vscode from 'vscode'

export const PACKAGE_NAME = 'gotoPackage'
export const CMND_NAME = `${PACKAGE_NAME}.removePackage`
const TERMNL_WINDOW = 'Goto Package: Remove'
const scheme = `command:${CMND_NAME}`

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

export function getExternalUrl(range: any, url: any, registry: any) {
    let link     = new vscode.DocumentLink(range, vscode.Uri.parse(encodeURI(url)))
    link.tooltip = registry

    return link
}

export function getInternalLink(range: any, path: any, pkgPath: any) {
    let link     = new vscode.DocumentLink(range, path)
    link.tooltip = pkgPath

    return link
}

export function getCmndLink(range: any, pkg: any, cmnd: any) {
    let args = encodeURIComponent(JSON.stringify([{cmnd: encodeURI(`${cmnd} ${pkg}`), pkg: pkg}]))

    let link     = new vscode.DocumentLink(range, vscode.Uri.parse(`${scheme}?${args}`))
    link.tooltip = `remove "${pkg}"`

    return link
}

export function getPath(workspaceFolder: any, pkgPath: any, file: any) {
    return vscode.Uri.file(`${workspaceFolder}/${pkgPath}/${file}`)
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
    let config = vscode.workspace.getConfiguration(PACKAGE_NAME)

    supportList = config.packageManagersList
}
