export const generate = (tree) => {

const counter = {
    matcher: 0,
    repeat: 0,
    sequence: 0,
    join: 0,
    or: 0,
    misc: 0,
}

const argList = (seq) =>
    seq.map(
        (item, pos) => item.arg === true ? `arg${pos}` : null
    )
    .filter(arg => arg !== null)
const indenter = "\n        "
const inf = Number.POSITIVE_INFINITY
const charMatchers = {}
const additionalFuncs = {}
const getStringMatcher = (string) => {
    if (charMatchers[string] !== undefined) {
        return charMatchers[string].name
    }
    const next = counter.matcher
    counter.matcher += 1
    const name = `$${next}`
    charMatchers[string] = {
        name,
        code: `strmatch(${string})`
    }
    return name
}
const getRegexMatcher = (regex) => {
    const key = `${regex.regex}${regex.flags}`
    if (charMatchers[key] !== undefined) {
        return charMatchers[key].name
    }
    const next = counter.matcher
    counter.matcher += 1
    const name = `$${next}`
    charMatchers[key] = {
        name,
        code: `regmatch(/${regex.regex}/${regex.flags})`
    }
    return name
}
const rule_base = (name, seq) => {
    const args = argList(seq)
    return `
    const rule_${name} = () => {
        let indexReset = parseIndex
        ${args.map(
            arg => `let ${arg} = null`
        ).join(indenter)}
        ${seq.map(
            (item, index) => gen[item.type](item, index)
        ).flat(inf).join(indenter)}

        const value = $sem["${name.replace(/\$(?=.)/, ".")}"](${args.join(", ")})
        return value
    }`
}
const rule_mbase = (def) => `
    const rule_${def.name} = () => {
        let result = null

        ${def.defs.map(
            info => `if ((result = rule_${def.name}$${info.name}()) !== nomatch) { return result }`
        ).join(indenter)}

        return nomatch
    }`
const argName = (item, index) => item.arg === true ? `arg${index}` : null
const callCode = (name, arg, invert) => {
    const call = (arg === null) ? `${name}()` : `(${arg} = ${name}())`
    return `${call} ${invert === true ? "!==" : "==="} nomatch`
}
const repeater = {
    [null]: (name, assignment, or) => {
        if (or === true) {
            const call = callCode(name, assignment, true)
            return `if (${call}) { return ${assignment} }`
        }
        const call = callCode(name, assignment)
        return `if (${call}) { parseIndex = indexReset; return nomatch }`
    },
    "*": (name, assignment, or) => {
        if (or === true) {
            const call = callCode(name, assignment, true)
            const part = `${assignment}$part${counter.misc}`
            counter.misc += 1
            return [
                `${assignment} = []`,
                `let ${part} = null`,
                `while (${call}) { ${assignment}.push(${part} }`,
                `return ${assignment}`
            ]
        }
        if (assignment === null) {
            const call = callCode(name, assignment, true)
            return `while (${call}) {}`
        }
        const rname = `rep$${counter.repeat}`
        counter.repeat += 1
        const part = `${rname}$part`
        const call = callCode(name, part, true)
        return [
            `const ${rname} = []`,
            `let ${part} = null`,
            `while (${call}) { ${rname}.push(${part}) }`,
            `${assignment} = ${rname}`
        ]
    },
    "+": (name, assignment, or) => {
        const repvar = `rep$${counter.repeat}`
        counter.repeat += 1
        if (or === true) {
            const call = callCode(name, assignment, true)
            const part = `${assignment}$part${counter.misc}`
            counter.misc += 1
            return [
                `${assignment} = []`,
                `let ${part} = null`,
                `while (${call}) { ${assignment}.push(${part} }`,
                `if (${assignment}.length > 0) { return ${assignment} }`
            ]
        }
        if (assignment === null) {
            const call = callCode(name, assignment, true)
            return [
                `const ${repvar} = parseIndex`,
                `while (${call}) {}`,
                `if (parseIndex - ${repvar} === 0) { return nomatch }`
            ]
        }
        const part = `${repvar}$part`
        const call = callCode(name, part, true)
        return [
            `const ${repvar} = []`,
            `let ${part} = null`,
            `while (${call}) { ${repvar}.push(${part}) }`,
            `if (${repvar}.length === 0) { return nomatch }`,
            `${assignment} = ${repvar}`
        ]
    },
    "?": (name, assignment, or) => {
        if (or === true) {
            // const call = callCode(name, assignment, true)
            return [
                `${assignment} = ${name}()`,
                `return ${assignment} === nomatch ? null : ${assignment}`
            ]
        }
        if (assignment === null) {
            return `${name}()`
        }
        const repvar = `rep$${ counter.repeat }`
        counter.repeat += 1
        return [
            `const ${repvar} = ${name}()`,
            `${assignment} = (${repvar} === nomatch) ? null : ${repvar}`
        ]
    }
}
const gen = {
    rule: (def) => {
        if (def.defs.length === 1) {
            return rule_base(def.name, def.defs[0].seq)
        }
        return [
            rule_mbase(def),
            ...def.defs.map(
                info => rule_base(`${def.name}$${info.name}`, info.seq)
            )
        ].join(indenter)
    },
    string: (item, index, assignment, or) => {
        return repeater[item.repeat](
            getStringMatcher(item.string),
            assignment ?? argName(item, index),
            or
        )
    },
    regex: (item, index, assignment, or) => {
        return repeater[item.repeat](
            getRegexMatcher(item),
            assignment ?? argName(item, index),
            or
        )
    },
    ruleref: (item, index, assignment, or) => {
        return repeater[item.repeat](
            `rule_${item.rule}`,
            assignment ?? argName(item, index),
            or
        )
    },
    or: (item, index, assignment, or) => {
        const ornum = counter.or
        counter.or += 1
        const name = `or$${ornum}`
        const value = `${name}$value`
        additionalFuncs[name] = `() => {
        const indexReset = parseIndex
        let ${value} = null
        ${item.items.map(
            (item, index) => [
                gen[item.type](item, index, value, true),
                "parseIndex = indexReset"
            ]
        ).flat(inf).join(indenter)}

        return nomatch
    }`
        return repeater[item.repeat](
            name,
            assignment ?? argName(item, index),
            or
        )
    },
    seq: (item, index, assignment, or) => {
        const snum = counter.sequence
        counter.sequence += 1
        const name = `seq$${snum}`
        const seqvars = item.seq.map(
            (_, i) => `${name}$${i}`
        )
        additionalFuncs[name] = `() => {
        const indexReset = parseIndex
        ${seqvars.map(
            (name) => `let ${name} = null`
        ).join(indenter)}
        ${item.seq.map(
            (item, index) => gen[item.type](item, index, seqvars[index])
        ).flat(inf).join(indenter)}

        return [${seqvars.join(", ")}]
    }`
        return repeater[item.repeat](
            name,
            assignment ?? argName(item, index),
            or
        )
    },
    "join": (item, index, assignment, or) => {
        const name = `join$${counter.join}`
        counter.join += 1
        additionalFuncs[name] = `() => {
        const indexReset = parseIndex

        ${item.seq.map(
            (item, index) => gen[item.type](item, index)
        ).flat(inf).join(indenter)}

        return str.slice(indexReset, parseIndex)
    }`
        return repeater[item.repeat](
            name,
            assignment ?? argName(item, index),
            or
        )
    }
}

const idfuncs = ["id0", "id1"]
const ruleList = tree.reduce(
    (list, rule) => {
        if (rule.defs.length === 1) {
            const argCount = argList(rule.defs[0].seq).length
            const idfunc = idfuncs[argCount] ?? "idl"
            return [...list, [rule.name, idfunc]]
        }
        return [
            ...list,
            ...rule.defs.map(
                info => {
                    const argCount = argList(info.seq).length
                    const idfunc = idfuncs[argCount] ?? "idl"
                    return [`${rule.name}.${info.name}`, idfunc]
                }
            )
        ]
    },
    []
)

const ruleCode = tree.map(br => gen[br.type](br)).join("")
const matchersCode = Object.values(charMatchers).map(
    ({ name, code }) => `const ${name} = ${code}`
).join("\n    ")
const additionalCode = Object.entries(additionalFuncs).map(
    ([name, func]) => `const ${name} = ${func}`
).join("\n    ")

const parser = `const id0 = () => null
const id1 = i => i
const idl = (...args) => args
const nomatch = Symbol("no match")

const defs = {
    ${ruleList.map(
        i => `"${i[0]}": ${i[1]}`
    ).flat(inf).join(",\n    ")}
}
const rules = Object.keys(defs)

const parse = (str, sem) => {
    const $sem = {}
    for (const ruleName of rules) {
        $sem[ruleName] = sem[ruleName] ?? defs[ruleName]
    }
    const strmatch = (source) => {
        const l = source.length
        return () => {
            if (source === str.substr(parseIndex, l)) {
                parseIndex += l
                return source
            }
            return nomatch
        }
    }
    const regmatch = (reg) => {
        return () => {
            const c = str.charAt(parseIndex)
            if (reg.test(c) !== false) {
                parseIndex += 1
                return c
            }
            return nomatch
        }
    }

    ${matchersCode}
    ${additionalCode}
    ${ruleCode}

    let parseIndex = 0
    const result = rule_$()
    if (parseIndex !== str.length) {
        return new Error("End of input not found")
    }
    return result
}`
return parser

}
