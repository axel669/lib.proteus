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
        next = input.indexOf("\n", next + 1)
    }
    return {
        line,
        col: pos - input.lastIndexOf("\n", pos)
    }
}
const $condition2 = ([n]) => n < 4
const $parse_repeat1 = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    while (true) {
        const startLoc = loc
        const partial = []
        ;[loc, match] = parse_num(input, loc)
        if (match === none) { location(pos); break }
        partial.push(match)

        const partialValue = partial
        if ($condition2(partialValue, state) !== true) {
            loc = startLoc
            break
        }

        results.push(partialValue)
    }
    if (results.length < 0) {
        return [pos, none]
    }
    return [loc, results]
}

const action_nums = i => i
const parse_nums = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "nums"

    ;[loc, match] = consumeRegex(/\d+/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = $parse_repeat1(input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeRegex(/.*/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    return [loc, action_nums(results, state, opt)]
}
const action_num = ([, n]) => parseInt(n)
const parse_num = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "num"

    ;[loc, match] = consumeRegex(/\s+/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeRegex(/\d+/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    return [loc, action_num(results, state, opt)]
}
export default (input, options) => {
    last = 0
    opt = options
    state = {
    }
    const [index, value] = parse_nums(input, 0)
    if (index !== input.length) {
        if (value === none) {
            const pos = linePosition(input, last)
            const error = new Error(`
            Parser failed at line ${pos.line}, col ${pos.col}.
            -> Expected ${lastRule} but got ${JSON.stringify(input.at(last))}.
            `
            .trim()
            .replace(/^\s/mg, "")
            )
            error.input = input
            error.position = pos
            error.index = last
            error.rule = lastRule

            return error
        }
        return new Error("Expected EOF got not that dingus")
    }

    return value
}