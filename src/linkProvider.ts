import fs_path from 'node:path';
import * as vscode from 'vscode';
import * as utils from './utils';

export default class LinkProvider {
    list: []

    constructor() {
        this.list = utils.supportList
    }

    async provideDocumentLinks(document: vscode.TextDocument) {
        const { fileName } = document
        let workspaceFolder = fs_path.parse(fileName).dir

        let links: any = []
        let changelog_name = 'CHANGELOG.md'

        await Promise.all(
            this.list.map(async (item: any) => {
                let search_file = item.file_to_search

                if (utils.isSupported(document, search_file)) {
                    for (const line of utils.getPackageLines(document, new RegExp(item.regex))) {
                        let { text, lineNumber } = line
                        let match = text.match(item.pkg_name_regex)

                        if (match) {
                            let pkg = match[1]
                            let pkgPath = `${item.folder}/${pkg}`
                            let range = utils.getRange(text, pkg, lineNumber)

                            let search_file_link: any = null
                            let changelog_link: any = null
                            let remove_link: any = null

                            try {
                                let search_file_path = utils.getPath(workspaceFolder, pkgPath, search_file)
                                await vscode.workspace.fs.stat(search_file_path)

                                search_file_link = item.folder ? utils.getInternalLink(range, search_file_path, `${item.folder} (${search_file})`) : null
                                remove_link = item.showRemoveLink ? utils.getCmndLink(range, pkg, item.cmnd) : null
                            } catch (error) {
                                // console.error(error);
                            }

                            try {
                                let changelog_path = utils.getPath(workspaceFolder, pkgPath, changelog_name)
                                await vscode.workspace.fs.stat(changelog_path)

                                changelog_link = utils.getInternalLink(range, changelog_path, `${item.folder} (${changelog_name})`)
                            } catch (error) {
                                // console.error(error);
                            }

                            links.push(
                                (item.registry && item.url) ? utils.getExternalUrl(range, `${item.url}${pkg}`, item.registry) : null,
                                search_file_link,
                                changelog_link,
                                remove_link
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
