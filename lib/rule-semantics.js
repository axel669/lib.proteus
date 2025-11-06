export default {
    "$": (rules) => rules.map(r => r[0]),
    "rule": (name, defs) => ({
        type: "rule",
        name,
        defs: defs.map(
            (def, index) => ({
                name: def[1]?.[1] ?? index.toString(),
                seq: def[3]
            })
        )
    }),
    "items": (list) => list.map(i => i[1]),
    "item": (arg, item, repeat) => {
        item.arg = arg !== null
        item.repeat = repeat
        return item
    },
    "item.normal": (arg, item, repeat) => {
        item.arg = arg !== null
        item.repeat = repeat
        return item
    },
    "item.negate": (expr) => {
        expr.arg = false
        expr.repeat = null
        return { type: "negate", expr, arg: false }
    },
    "string.dbl": (string) => ({ type: "string", string }),
    "string.sgl": (string) => ({ type: "string", string }),
    "chars": (regex, flags) => ({ type: "regex", regex, flags }),
    ruleref: (rule) => ({ type: "ruleref", rule }),
    seq: (first, rest) => ({ type: "seq", seq: [first, ...rest] }),
    or: (first, rest) => ({ type: "or", items: [first, ...rest.map(r => r[3])] }),
    join: (first, rest) => ({ type: "join", seq: [first, ...rest] }),
}
