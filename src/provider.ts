import * as vscode from 'vscode'
import * as utils from './utils'
import * as constants from './constants'

export default class LinkProvider {
    provideDocumentLinks(document: any) {
        let workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath
        let links: any = []

        if (utils.fileTypeIs(document, constants.NPM_JSON)) {
            for (const line of utils.getPackageLines(document, constants.NPM_REGEX)) {
                let { text, lineNumber } = line
                let match = text.match(constants.PACKAGE_NAME_NPM_REGEX)

                if (match) {
                    let pkg = match[1]
                    let pkgPath = `${constants.NODE_MODULES}/${pkg}`
                    let path = vscode.Uri.file(`${workspaceFolder}/${pkgPath}/${constants.NPM_JSON}`)
                    let offset = text.indexOf(pkg)
                    let range = new vscode.Range(
                        new vscode.Position(lineNumber, offset),
                        new vscode.Position(lineNumber, offset + pkg.length)
                    )

                    let pathLink = new vscode.DocumentLink(range, path)
                    pathLink.tooltip = pkgPath

                    let url = `${constants.NPM_URL}${pkg}`
                    let link = new vscode.DocumentLink(range, vscode.Uri.parse(`${url}`))
                    link.tooltip = url

                    links.push(pathLink, link)
                }
            }
        } else if (utils.fileTypeIs(document, constants.COMPOSER_JSON)) {
            for (const line of utils.getPackageLines(document, constants.COMPOSER_REGEX)) {
                let { text, lineNumber } = line
                let match = text.match(constants.PACKAGE_NAME_COMPOSER_REGEX)

                if (match) {
                    let pkg = match[1]
                    let pkgPath = `${constants.VENDOR}/${pkg}`
                    let path = vscode.Uri.file(`${workspaceFolder}/${pkgPath}/${constants.COMPOSER_JSON}`)
                    let offset = text.indexOf(pkg)
                    let range = new vscode.Range(
                        new vscode.Position(lineNumber, offset),
                        new vscode.Position(lineNumber, offset + pkg.length)
                    )

                    let pathLink = new vscode.DocumentLink(range, path)
                    pathLink.tooltip = pkgPath

                    let url = `${constants.PACKAGIST_URL}${pkg}`
                    let link = new vscode.DocumentLink(range, vscode.Uri.parse(`${url}`))
                    link.tooltip = url

                    links.push(pathLink, link)
                }
            }
        }

        if (links) {
            return links.filter((e: any) => e)
        }
    }
}
