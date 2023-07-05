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
const $parse_repeat2 = (input, pos, parentResults) => {
    const results = []
    let loc = pos
    let match = null

    while (true) {
        const startLoc = loc
        const partial = []
        ;[loc, match] = consumeRegex(/s*/y, input, loc)
        if (match === none) { loc = startLoc; location(pos); break }
        partial.push(match)

        ;[loc, match] = consumeString(",", input, loc)
        if (match === none) { loc = startLoc; location(pos); break }
        partial.push(match)

        ;[loc, match] = consumeRegex(/\s*/y, input, loc)
        if (match === none) { loc = startLoc; location(pos); break }
        partial.push(match)

        ;[loc, match] = parse_value(input, loc)
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
const $parse_opt1 = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    ;[loc, match] = parse_value(input, loc)
    results.push(match)
    if (match === none) { location(pos); return [pos, null] }

    ;[loc, match] = consumeRegex(/s*/y, input, loc)
    results.push(match)
    if (match === none) { location(pos); return [pos, null] }

    ;[loc, match] = $parse_repeat2(input, loc, results)
    results.push(match)
    if (match === none) { location(pos); return [pos, null] }

    return [loc, results]
}
const $parse_repeat4 = (input, pos, parentResults) => {
    const results = []
    let loc = pos
    let match = null

    while (true) {
        const startLoc = loc
        const partial = []
        ;[loc, match] = consumeRegex(/s*/y, input, loc)
        if (match === none) { loc = startLoc; location(pos); break }
        partial.push(match)

        ;[loc, match] = consumeString(",", input, loc)
        if (match === none) { loc = startLoc; location(pos); break }
        partial.push(match)

        ;[loc, match] = consumeRegex(/\s*/y, input, loc)
        if (match === none) { loc = startLoc; location(pos); break }
        partial.push(match)

        ;[loc, match] = parse_kvpair(input, loc)
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
const $parse_opt3 = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    ;[loc, match] = parse_kvpair(input, loc)
    results.push(match)
    if (match === none) { location(pos); return [pos, null] }

    ;[loc, match] = consumeRegex(/s*/y, input, loc)
    results.push(match)
    if (match === none) { location(pos); return [pos, null] }

    ;[loc, match] = $parse_repeat4(input, loc, results)
    results.push(match)
    if (match === none) { location(pos); return [pos, null] }

    return [loc, results]
}
const $parse_or5 = (input, pos) => {
    let loc = pos
    let match = null

    ;[loc, match] = parse_number(input, loc)
    if (match !== none) { return [loc, match] }

    ;[loc, match] = parse_string(input, loc)
    if (match !== none) { return [loc, match] }

    ;[loc, match] = parse_true(input, loc)
    if (match !== none) { return [loc, match] }

    ;[loc, match] = parse_false(input, loc)
    if (match !== none) { return [loc, match] }

    ;[loc, match] = parse_null(input, loc)
    if (match !== none) { return [loc, match] }

    ;[loc, match] = parse_array(input, loc)
    if (match !== none) { return [loc, match] }

    ;[loc, match] = parse_object(input, loc)
    if (match !== none) { return [loc, match] }

    return [pos, none]
}

const action_number = ({ num }) => parseFloat(num)
const parse_number = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "number"

    ;[loc, match] = consumeRegex(/\d+(\.\d+(e(\+|\-)\d+)?)?/iy, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)
    results.num = match

    return [loc, action_number(results, state, opt)]
}
const action_string = ([str]) => JSON.parse(str)
const parse_string = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "string"

    ;[loc, match] = consumeRegex(/"(\\"|[^"])*"/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    return [loc, action_string(results, state, opt)]
}
const action_true = () => true
const parse_true = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "true"

    ;[loc, match] = consumeString("true", input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    return [loc, action_true(results, state, opt)]
}
const action_false = () => false
const parse_false = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "false"

    ;[loc, match] = consumeString("false", input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    return [loc, action_false(results, state, opt)]
}
const action_null = () => null
const parse_null = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "null"

    ;[loc, match] = consumeString("null", input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    return [loc, action_null(results, state, opt)]
}
const action_array = ({ info }) =>
(info === null)
? []
: [
info[0],
...info[2].map(
item => item[3]
)
]
const parse_array = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "array"

    ;[loc, match] = consumeString("[", input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = $parse_opt1(input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)
    results.info = match

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeString("]", input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    return [loc, action_array(results, state, opt)]
}
const action_object = ({ info }) =>
(info === null)
? []
: Object.fromEntries([
info[0],
...info[2].map(
item => item[3]
)
])
const parse_object = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "object"

    ;[loc, match] = consumeString("{", input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = $parse_opt3(input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)
    results.info = match

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeString("}", input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    return [loc, action_object(results, state, opt)]
}
const action_kvpair = ({ key, value }) => [key, value]
const parse_kvpair = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "kvpair"

    ;[loc, match] = parse_string(input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)
    results.key = match

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeString(":", input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = parse_value(input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)
    results.value = match

    return [loc, action_kvpair(results, state, opt)]
}
const action_value = ([value]) => value
const parse_value = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "value"

    ;[loc, match] = $parse_or5(input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    return [loc, action_value(results, state, opt)]
}
const action_json = ({ value }) => value
const parse_json = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    currentRule = "json"

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    ;[loc, match] = parse_value(input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)
    results.value = match

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { location(pos); return [pos, none] }
    results.push(match)

    return [loc, action_json(results, state, opt)]
}
export default (input, options) => {
    last = 0
    opt = options
    state = {
    }
    const [index, value] = parse_json(input, 0)
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