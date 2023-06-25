const iden = i => i

const none = Symbol("none")

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
const $parse_repeat2 = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    while (true) {
        const partial = []
        ;[loc, match] = consumeRegex(/s*/y, input, loc)
        if (match === none) { last = pos; break }
        partial.push(match)

        ;[loc, match] = consumeString(",", input, loc)
        if (match === none) { last = pos; break }
        partial.push(match)

        ;[loc, match] = consumeRegex(/\s*/y, input, loc)
        if (match === none) { last = pos; break }
        partial.push(match)

        ;[loc, match] = parse_value(input, loc)
        if (match === none) { last = pos; break }
        partial.push(match)

        results.push(partial)
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
    if (match === none) { last = pos; return [pos, null] }

    ;[loc, match] = consumeRegex(/s*/y, input, loc)
    results.push(match)
    if (match === none) { last = pos; return [pos, null] }

    ;[loc, match] = $parse_repeat2(input, loc)
    results.push(match)
    if (match === none) { last = pos; return [pos, null] }

    return [loc, results]
}
const $parse_repeat4 = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    while (true) {
        const partial = []
        ;[loc, match] = consumeRegex(/s*/y, input, loc)
        if (match === none) { last = pos; break }
        partial.push(match)

        ;[loc, match] = consumeString(",", input, loc)
        if (match === none) { last = pos; break }
        partial.push(match)

        ;[loc, match] = consumeRegex(/\s*/y, input, loc)
        if (match === none) { last = pos; break }
        partial.push(match)

        ;[loc, match] = parse_kvpair(input, loc)
        if (match === none) { last = pos; break }
        partial.push(match)

        results.push(partial)
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
    if (match === none) { last = pos; return [pos, null] }

    ;[loc, match] = consumeRegex(/s*/y, input, loc)
    results.push(match)
    if (match === none) { last = pos; return [pos, null] }

    ;[loc, match] = $parse_repeat4(input, loc)
    results.push(match)
    if (match === none) { last = pos; return [pos, null] }

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

const action_number = actions["number"] ?? iden
const parse_number = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    ;[loc, match] = consumeRegex(/\d+(\.\d+(e(\+|\-)\d+)?)?/iy, input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    return [loc, action_number(results)]
}
const action_string = actions["string"] ?? iden
const parse_string = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    ;[loc, match] = consumeRegex(/"(\\"|[^"])*"/y, input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    return [loc, action_string(results)]
}
const action_true = actions["true"] ?? iden
const parse_true = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    ;[loc, match] = consumeString("true", input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    return [loc, action_true(results)]
}
const action_false = actions["false"] ?? iden
const parse_false = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    ;[loc, match] = consumeString("false", input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    return [loc, action_false(results)]
}
const action_null = actions["null"] ?? iden
const parse_null = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    ;[loc, match] = consumeString("null", input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    return [loc, action_null(results)]
}
const action_array = actions["array"] ?? iden
const parse_array = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    ;[loc, match] = consumeString("[", input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    ;[loc, match] = $parse_opt1(input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeString("]", input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    return [loc, action_array(results)]
}
const action_object = actions["object"] ?? iden
const parse_object = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    ;[loc, match] = consumeString("{", input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    ;[loc, match] = $parse_opt3(input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeString("}", input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    return [loc, action_object(results)]
}
const action_kvpair = actions["kvpair"] ?? iden
const parse_kvpair = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    ;[loc, match] = parse_string(input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeString(":", input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    ;[loc, match] = consumeRegex(/\s*/y, input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    ;[loc, match] = parse_value(input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    return [loc, action_kvpair(results)]
}
const action_value = actions["value"] ?? iden
const parse_value = (input, pos) => {
    const results = []
    let loc = pos
    let match = null

    ;[loc, match] = $parse_or5(input, loc)
    if (match === none) { last = pos; return [pos, none] }
    results.push(match)

    return [loc, action_value(results)]
}
export default (input) => {
    const [index, value] = parse_value(input, 0)
    if (index !== input.length) {
        if (value === none) {
            return new Error(`Got to pos ${last} before failure`)
        }
        return new Error("Expected EOF got not that dingus")
    }

    return value
}