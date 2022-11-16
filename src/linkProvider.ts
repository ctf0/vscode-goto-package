import * as vscode from 'vscode'
import * as utils from './utils'

export default class LinkProvider {
    list: []

    constructor() {
        this.list = utils.supportList
    }

    async provideDocumentLinks(document: any) {
        let workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath
        let links: any = []
        let changelog_name = 'CHANGELOG.md'

        await Promise.all(
            this.list.map(async (item:any) => {
                if (utils.isSupported(document, item.file_to_search)) {
                    for (const line of utils.getPackageLines(document, new RegExp(item.regex))) {
                        let {text, lineNumber} = line
                        let match              = text.match(item.pkg_name_regex)

                        if (match) {
                            let pkg     = match[1]
                            let pkgPath = `${item.folder}/${pkg}`
                            let path    = utils.getPath(workspaceFolder, pkgPath, item.file_to_open)
                            let range   = utils.getRange(text, pkg, lineNumber)

                            let changelog_path = utils.getPath(workspaceFolder, pkgPath, changelog_name)
                            let changelog = null

                            try {
                                await vscode.workspace.fs.stat(changelog_path)
                                changelog = utils.getInternalLink(range, changelog_path, changelog_name)
                            } catch (error) {
                                changelog = null
                            }

                            links.push(
                                utils.getExternalUrl(range, `${item.url}${pkg}`, item.registry),
                                utils.getInternalLink(range, path, item.folder),
                                changelog,
                                item.showRemoveLink ? utils.getCmndLink(range, pkg, item.cmnd) : null
                            )
                        }
                    }
                }

                return null
            })
        )

        return links.filter((e: any) => e)
    }
}
