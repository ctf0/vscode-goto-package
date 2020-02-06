export function isDependency(text: any, regex: any) {
    return regex.test(text)
}

export function getPackageLines(document: any, regex: any) {
    let isLineInDependencyScope = false

    return new Array(document.lineCount).fill('')
        .map((line, idx) => document.lineAt(idx))
        .filter((line) => {
            const { text } = line

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

export function fileTypeIs(document: any, type: any) {
    return document.fileName.endsWith(type)
}
