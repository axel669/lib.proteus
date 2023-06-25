const parseHeader = `
const iden = i => i

const none = Symbol("none")

let state = null
let opt = null

const consumeString = (pattern, input, pos) => {
    if (input.substr(pos, pattern.length) === pattern) {
        return [pos + pattern.length, pattern]
    }
    return [pos, none]
}
const consumeRegex = (pattern, input, pos) => {
    pattern.lastIndex = pos
    const match = pattern.exec(input)
    if (match === null) {
        return [pos, none]
    }
    return [pattern.lastIndex, match?.[0] ?? null]
}

let last = null
`.trim()

const formatCode = (code) => {
    let level = 0
    let indent = "    "
    return (
        code
        .trim()
        .split("\n")
        .map(
            (line) => {
                const l = line.trim()
                if (l === "") {
                    return ""
                }
                if (l === "}") {
                    level -= 1
                    return `${indent.repeat(level)}${l}`
                }

                const out = `${indent.repeat(level)}${l}`

                if (l.endsWith("{") === true) {
                    level += 1
                    return out
                }
                if (l.startsWith("if ") === false && l.endsWith("}") === true) {
                    level -= 1
                    return out
                }
                return out
            }
        )
        .join("\n")
        .replace(
            /\n\n(\n*)/g,
            "\n\n"
        )
    )
}

const compileParser = (parsers, entry) => {
    return [
        formatCode(`
            ${parseHeader}
            ${Object.getOwnPropertySymbols(parsers).map(
                (sym) => `const ${Symbol.keyFor(sym)} = ${parsers[sym]}`
            ).join("\n")}

            ${Object.entries(parsers).map(
                ([name, code]) => `
                    const action_${name} = actions["${name}"] ?? iden
                    const parse_${name} = ${code}
                `.trim()
            ).join("\n")}
        `),
        formatCode(`(input, options) => {
            opt = options
            state = {
            }
            const [index, value] = parse_${entry}(input, 0)
            if (index !== input.length) {
                if (value === none) {
                    return new Error(\`Got to pos \${last} before failure\`)
                }
                return new Error("Expected EOF got not that dingus")
            }

            return value
        }`)
    ]
}

export default compileParser
