import * as vscode from 'vscode'
import * as utils  from './utils'

export default class LinkProvider {
    list: []

    constructor() {
        this.list = utils.supportList
    }

    provideDocumentLinks(document: any) {
        let workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath
        let links: any = []

        this.list.map((item:any) => {
            if (utils.isSupported(document, item.file)) {
                for (const line of utils.getPackageLines(document, new RegExp(item.regex))) {
                    let {text, lineNumber} = line
                    let match = text.match(item.pkg_name_regex)

                    if (match) {
                        let pkg = match[1]
                        let pkgPath = `${item.folder}/${pkg}`
                        let path = utils.getPath(workspaceFolder, pkgPath, item.file_to_open)
                        let range = utils.getRange(text, pkg, lineNumber)

                        let external = utils.getExternalUrl(range, `${item.url}${pkg}`)
                        let internal = utils.getInternalLink(range, path, pkgPath)
                        let remove = utils.getCmndLink(range, pkg, item.cmnd)

                        links.push(external, internal, item.showRemoveLink ? remove : null)
                    }
                }
            }
        })

        if (links) {
            return links.filter((e: any) => e)
        }
    }
}
