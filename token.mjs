let currentID = 0
const id = () => {
    currentID += 1
    return currentID
}

const Token = {
    opt: Symbol("opt"),
    repeat: Symbol("repeat"),
    or: Symbol("or"),
}

const tokenRepeat = ({ count, tokens }, parsers) => {
    const name = `$parse_repeat${id()}`
    const looped = tokens.map(
        (item) => tokenStep({ loop: true, item }, parsers)
    ).join("\n\n")

    parsers[Symbol.for(name)] = `(input, pos) => {
        const results = []
        let loc = pos
        let match = null

        while (true) {
            const partial = []
            ${looped}

            results.push(partial${looped.length === 1 ? "[0]" : ""})
        }
        if (results.length < ${count}) {
            return [pos, none]
        }
        return [loc, results]
    }`

    return `${name}(input, loc)`
}
const tokenOr = ({ tokens }, parsers) => {
    const name = `$parse_or${id()}`
    const helpers = tokens.map(
        (tokens, index) => [
            `${name}_${index}`,
            tokens.map(
                token => tokenStep(token, parsers)
            )
        ]
    )

    parsers[Symbol.for(name)] = `(input, pos) => {
        let loc = pos
        let match = null

        ${helpers.map(
        ([name, steps]) => {
            if (steps.length === 1) {
                return `
                    ${steps[0].split("\n")[0]}
                    if (match !== none) { return [loc, match] }
                `.trim()
            }

            parsers[Symbol.for(name)] = `(input, pos) => {
                const results = []
                let loc = pos
                let match = null

                ${steps.join("\n\n")}

                return [loc, results${steps.length === 1 ? "[0]" : ""}]
            }`
            return `
                ;[loc, match] = ${name}(input, pos)
                if (match !== none) { return [loc, match] }
            `.trim()
        }
    ).join("\n\n")}

        return [pos, none]
    }`

    return `${name}(input, loc)`
}
const tokenOpt = ({ tokens }, parsers, target) => {
    const name = `$parse_opt${id()}`
    parsers[Symbol.for(name)] = `(input, pos) => {
        const results = []
        let loc = pos
        let match = null

        ${tokens.map(
        token => `
            ${tokenStep({ opt: true, item: token }, parsers)}
            if (match === none) { last = pos; return [pos, null] }
        `
    ).join("\n\n")}

        return [loc, results]
    }`

    return `${name}(input, loc)`
}
const tokenAction = (token, parsers) => {
    const item = token.item ?? token

    if (item[Token.repeat] === true) {
        const code = tokenRepeat(item, parsers)
        return code
    }
    if (item[Token.opt] === true) {
        return tokenOpt(item, parsers)
    }
    if (item[Token.or] === true) {
        return tokenOr(item, parsers)
    }
    if (item.constructor === RegExp) {
        const sticky = new RegExp(
            item.source,
            [...new Set(`y${item.flags}`)].join("")
        )
        return `consumeRegex(${sticky}, input, loc)`
    }

    if (typeof item === "string") {
        return `consumeString(${JSON.stringify(item)}, input, loc)`
    }

    if (item.constructor === Symbol) {
        const name = Symbol.keyFor(item)
        return `parse_${name}(input, loc)`
    }
}
const tokenReaction = (token) => {
    if (token.opt === true) {
        return ""
    }
    if (token.loop === true) {
        return "if (match === none) { last = pos; break }"
    }
    return "if (match === none) { last = pos; return [pos, none] }"
}
export const tokenStep = (token, parsers) => {
    const target = token.loop === true ? "partial" : "results"

    const action = tokenAction(token, parsers)
    const early = tokenReaction(token)
    const step = `;[loc, match] = ${action}\n${early}`.trim()

    return `${step}\n${target}.push(match)`
}

export default Token
