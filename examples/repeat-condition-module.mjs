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
const parse_eof = (input, pos) => {
    if (pos === input.length) {
        return [pos, null]
    }
    return [pos, none]
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
const $parse_repeat1 = (input, pos, parentResults) => {
    const results = []
    let loc = pos
    let match = null

    while (true) {
        const startLoc = loc
        const partial = []
        ;[loc, match] = parse_numberList(input, loc)
        if (match === none) { loc = startLoc; location(pos); break }
        partial.push(match)

        const partialValue = partial

        results.push(partialValue)
    }
    if (results.length < 0) {
        return [pos, none]
    }
    return [loc, results]
}
const $parse_or2 = (input, pos) => {
    let loc = pos
    let match = null

    ;[loc, match] = consumeRegex(/\s+/y, input, loc)
    if (match !== none) { return [loc, match] }

    ;[loc, match] = parse_eof(input, loc)
    if (match !== none) { return [loc, match] }

    return [pos, none]
}
const $condition4 = ([n], _, prev) => n < prev.n
const $parse_repeat3 = (input, pos, parentResults) => {
    const results = []
    let loc = pos
    let match = null

    while (true) {
        const startLoc = loc
        const partial = []
        ;[loc, match] = parse_item(input, loc)
        if (match === none) { loc = startLoc; location(pos); break }
        partial.push(match)

        const partialValue = partial
        if ($condition4(partialValue, state, parentResults) !== true) {
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

const action_lists = ([ lists ]) => lists
const parse_lists = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "lists"

    ;[loc, match] = $parse_repeat1(input, loc, results)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = $parse_or2(input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    return [loc, action_lists(results, state, opt)]
}
const action_numberList = i => i
const parse_numberList = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "numberList"

    ;[loc, match] = consumeRegex(/\w/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)
    results.name = match

    ;[loc, match] = consumeString(":", input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = parse_number(input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)
    results.n = match

    ;[loc, match] = $parse_repeat3(input, loc, results)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeRegex(/[\d ]*/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)
    results.rest = match

    return [loc, action_numberList(results, state, opt)]
}
const action_number = ([ n ]) => parseInt(n)
const parse_number = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "number"

    ;[loc, match] = consumeRegex(/\d+/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    return [loc, action_number(results, state, opt)]
}
const action_item = ([, n]) => n
const parse_item = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "item"

    ;[loc, match] = consumeRegex(/\s+/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = parse_number(input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    return [loc, action_item(results, state, opt)]
}
export default (input, options) => {
    last = 0
    opt = options
    state = {
    }
    const [index, value] = parse_lists(input, 0)
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
        const error = new Error("Expected EOF got not that dingus")
        error.index = index
        error.parsed = input.slice(0, index)
        error.remaining = input.slice(index)
        error.result = value
        return error
    }

    return value
}