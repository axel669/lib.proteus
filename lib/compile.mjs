const parseHeader = `
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

let last = 0
let lastRule = null
let currentRule = null
const location = (pos) => {
    if (pos < last) {
        return
    }
    last = pos
    lastRule = currentRule
}
const linePosition = (input, pos) => {
    let line = 0
    let next = 0
    while (next < pos && next !== -1) {
        line += 1
        next = input.indexOf("\\n", next + 1)
    }
    return {
        line,
        col: pos - input.lastIndexOf("\\n", pos)
    }
}
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

const compileParser = (parsers, entry, actions) => {
    const iden = i => i
    return [
        formatCode(`
            ${parseHeader}
            ${Object.getOwnPropertySymbols(parsers).map(
                (sym) => `const ${Symbol.keyFor(sym)} = ${parsers[sym]}`
            ).join("\n")}

            ${Object.entries(parsers).map(
                ([name, code]) => `
                    const action_${name} = ${(actions[name] ?? iden).toString()}
                    const parse_${name} = ${code}
                `.trim()
            ).join("\n")}
        `),
        formatCode(`(input, options) => {
            last = 0
            opt = options
            state = {
            }
            const [index, value] = parse_${entry}(input, 0)
            if (index !== input.length) {
                if (value === none) {
                    const pos = linePosition(input, last)
                    const error = new Error(\`
                        Parser failed at line \${pos.line}, col \${pos.col}.
                        -> Expected \${lastRule} but got \${JSON.stringify(input.at(last))}.
                        \`
                        .trim()
                        .replace(/^\\s/mg, "")
                    )
                    error.input = input
                    error.position = pos
                    error.index = last
                    error.rule = lastRule

                    return error
                }
                const error = new Error("Expected EOF got not that dingus")
                error.index = index
                error.parsed = input.slice(0, index)
                error.remaining = input.slice(index)
                error.result = value
                return error
            }

            return value
        }`)
    ]
}

export default compileParser
