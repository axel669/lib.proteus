let currentID = 0
const id = () => {
    currentID += 1
    return currentID
}

const Token = {
    opt: Symbol("opt"),
    repeat: Symbol("repeat"),
    or: Symbol("or"),
    marked: Symbol("token")
}

const generateCondtional = (condition, parsers) => {
    if (condition === null) {
        return ""
    }

    const name = `$condition${id()}`
    parsers[Symbol.for(name)] = condition.toString()

    return `
        if (${name}(partialValue, state, parentResults) !== true) {
            loc = startLoc
            break
        }
    `.trim()
}
const tokenRepeat = ({ count, tokens }, parsers) => {
    const name = `$parse_repeat${id()}`
    const [condition, tokenList] =
        (typeof tokens[0] === "function")
        ? [tokens[0], tokens.slice(1)]
        : [null, tokens]
    const looped = tokenList.map(
        (item) => tokenStep({ [Token.marked]: true, loop: true, item }, parsers)
    ).join("\n\n")
    const conditional = generateCondtional(condition, parsers)

    parsers[Symbol.for(name)] = `(input, pos, parentResults) => {
        const results = []
        let loc = pos
        let match = null

        while (true) {
            const startLoc = loc
            const partial = []
            ${looped}

            const partialValue = partial${looped.length === 1 ? "[0]" : ""}
            ${conditional}

            results.push(partialValue)
        }
        if (results.length < ${count}) {
            return [pos, none]
        }
        return [loc, results]
    }`

    return `${name}(input, loc, results)`
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
            ${tokenStep({ [Token.marked]: true, opt: true, item: token }, parsers)}
            if (match === none) { location(pos); return [pos, null] }
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

    console.log("failed action:", token)
}
const tokenReaction = (token) => {
    if (token.opt === true) {
        return ""
    }
    if (token.loop === true) {
        return "if (match === none) { location(pos); break }"
    }
    return "if (match === none) { location(pos); return [pos, none] }"
}
export const tokenStep = (tokenInfo, parsers) => {
    const [name, token] =
        (tokenInfo.constructor === Object && tokenInfo[Token.marked] !== true)
        ? Object.entries(tokenInfo)[0]
        : [null, tokenInfo]
    const target = token.loop === true ? "partial" : "results"

    const action = tokenAction(token, parsers)
    const early = tokenReaction(token)
    const step = `;[loc, match] = ${action}\n${early}`.trim()
    const named = (name === null) ? "" : `${target}.${name} = match`

    return `
        ${step}
        ${target}.push(match)
        ${named}
    `.trim()
}

export default Token
