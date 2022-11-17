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
                let search_file = item.file_to_search

                if (utils.isSupported(document, search_file)) {
                    for (const line of utils.getPackageLines(document, new RegExp(item.regex))) {
                        let {text, lineNumber} = line
                        let match              = text.match(item.pkg_name_regex)

                        if (match) {
                            let pkg     = match[1]
                            let pkgPath = `${item.folder}/${pkg}`
                            let path    = utils.getPath(workspaceFolder, pkgPath, search_file)
                            let range   = utils.getRange(text, pkg, lineNumber)

                            let changelog_path = utils.getPath(workspaceFolder, pkgPath, changelog_name)
                            let changelog = null

                            try {
                                await vscode.workspace.fs.stat(changelog_path)
                                changelog = utils.getInternalLink(range, changelog_path, `${item.folder} (${changelog_name})`)
                            } catch (error) {
                                changelog = null
                            }

                            links.push(
                                (item.registry && item.url) ? utils.getExternalUrl(range, `${item.url}${pkg}`, item.registry) : null,
                                item.folder ? utils.getInternalLink(range, path, `${item.folder} (${search_file})`) : null,
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
