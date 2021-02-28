import * as vscode from 'vscode'
import * as utils  from './utils'

let cache: any = []

export default class HoverProvider {
    list: []

    constructor() {
        this.list = utils.supportList
    }

    async provideHover(doc: any, position: any) {
        let workspaceFolder = vscode.workspace.getWorkspaceFolder(doc.uri)?.uri.fsPath
        let link: any       = ''
        let item: any       = this.list.find((item: any) => utils.isSupported(doc, item.file_to_search))

        if (item) {
            let fts      = item.file_to_search
            let pkg_info = item.pkg_info_file

            if (pkg_info && utils.isSupported(doc, fts)) {
                const range       = doc.getWordRangeAtPosition(position)
                const packageName = doc.getText(range).replace(/['"]/g, '')
                const info        = `${workspaceFolder}/${pkg_info.file}`
                const uri         = vscode.Uri.file(info)

                let data = cache.length
                    ? cache.some((e: any) => e.name == fts)?.value
                    : null

                if (!data) {
                    let response = await vscode.workspace.fs.readFile(uri)
                    data         = JSON.parse(response.toString())
                    cache.push({
                        name  : fts,
                        value : data
                    })
                }

                const packages = data[pkg_info.key] || data
                const pkg      = packages.find((p: any) => p.name === packageName)

                link = new vscode.MarkdownString()
                    .appendMarkdown(pkg.description + '\n\n')
                    .appendMarkdown(`Installed version: ${pkg.version}`)
            }
        }

        if (link) {
            return new vscode.Hover(link)
        }
    }
}
