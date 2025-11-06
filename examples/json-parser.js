const id0 = () => null
const id1 = i => i
const idl = (...args) => args
const nomatch = Symbol("no match")

const defs = {
    "$": id1,
    "value": id1,
    "string": id1,
    "stresc": id0,
    "number": id1,
    "array": id1,
    "object": id1,
    "pair": idl,
    "_": id0,
    "__": id0
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

    const $0 = strmatch('"')
    const $1 = regmatch(/[^"]/)
    const $2 = strmatch("\\")
    const $3 = regmatch(/[\\rntvbxu'"]/)
    const $4 = regmatch(/[0-9]/)
    const $5 = strmatch(".")
    const $6 = strmatch("e")
    const $7 = strmatch("-")
    const $8 = strmatch("+")
    const $9 = strmatch("[")
    const $10 = strmatch(",")
    const $11 = strmatch("]")
    const $12 = strmatch("{")
    const $13 = strmatch("}")
    const $14 = strmatch(":")
    const $15 = regmatch(/[\s]/m)
    const or$0 = () => {
        const indexReset = parseIndex
        let or$0$value = null
        if ((or$0$value = rule_string()) !== nomatch) { return or$0$value }
        parseIndex = indexReset
        if ((or$0$value = rule_number()) !== nomatch) { return or$0$value }
        parseIndex = indexReset
        if ((or$0$value = rule_array()) !== nomatch) { return or$0$value }
        parseIndex = indexReset
        if ((or$0$value = rule_object()) !== nomatch) { return or$0$value }
        parseIndex = indexReset

        return nomatch
    }
    const or$1 = () => {
        const indexReset = parseIndex
        let or$1$value = null
        if ((or$1$value = rule_stresc()) !== nomatch) { return or$1$value }
        parseIndex = indexReset
        if ((or$1$value = $1()) !== nomatch) { return or$1$value }
        parseIndex = indexReset

        return nomatch
    }
    const join$0 = () => {
        const indexReset = parseIndex

        if ($0() === nomatch) { parseIndex = indexReset; return nomatch }
        while (or$1() !== nomatch) {}
        if ($0() === nomatch) { parseIndex = indexReset; return nomatch }

        return str.slice(indexReset, parseIndex)
    }
    const seq$0 = () => {
        const indexReset = parseIndex
        let seq$0$0 = null
        let seq$0$1 = null
        if ((seq$0$0 = $5()) === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$1 = []
        let rep$1$part = null
        while ((rep$1$part = $4()) !== nomatch) { rep$1.push(rep$1$part) }
        if (rep$1.length === 0) { return nomatch }
        seq$0$1 = rep$1

        return [seq$0$0, seq$0$1]
    }
    const or$2 = () => {
        const indexReset = parseIndex
        let or$2$value = null
        if ((or$2$value = $7()) !== nomatch) { return or$2$value }
        parseIndex = indexReset
        if ((or$2$value = $8()) !== nomatch) { return or$2$value }
        parseIndex = indexReset

        return nomatch
    }
    const seq$1 = () => {
        const indexReset = parseIndex
        let seq$1$0 = null
        let seq$1$1 = null
        let seq$1$2 = null
        if ((seq$1$0 = $6()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$1$1 = or$2()) === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$2 = []
        let rep$2$part = null
        while ((rep$2$part = $4()) !== nomatch) { rep$2.push(rep$2$part) }
        if (rep$2.length === 0) { return nomatch }
        seq$1$2 = rep$2

        return [seq$1$0, seq$1$1, seq$1$2]
    }
    const join$1 = () => {
        const indexReset = parseIndex

        const rep$0 = parseIndex
        while ($4() !== nomatch) {}
        if (parseIndex - rep$0 === 0) { return nomatch }
        seq$0()
        seq$1()

        return str.slice(indexReset, parseIndex)
    }
    const seq$3 = () => {
        const indexReset = parseIndex
        let seq$3$0 = null
        let seq$3$1 = null
        let seq$3$2 = null
        let seq$3$3 = null
        if ((seq$3$0 = $10()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$3$1 = rule__()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$3$2 = rule_value()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$3$3 = rule__()) === nomatch) { parseIndex = indexReset; return nomatch }

        return [seq$3$0, seq$3$1, seq$3$2, seq$3$3]
    }
    const seq$2 = () => {
        const indexReset = parseIndex
        let seq$2$0 = null
        let seq$2$1 = null
        let seq$2$2 = null
        if ((seq$2$0 = rule_value()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$2$1 = rule__()) === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$3 = []
        let rep$3$part = null
        while ((rep$3$part = seq$3()) !== nomatch) { rep$3.push(rep$3$part) }
        seq$2$2 = rep$3

        return [seq$2$0, seq$2$1, seq$2$2]
    }
    const seq$5 = () => {
        const indexReset = parseIndex
        let seq$5$0 = null
        let seq$5$1 = null
        let seq$5$2 = null
        let seq$5$3 = null
        if ((seq$5$0 = $10()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$5$1 = rule__()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$5$2 = rule_pair()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$5$3 = rule__()) === nomatch) { parseIndex = indexReset; return nomatch }

        return [seq$5$0, seq$5$1, seq$5$2, seq$5$3]
    }
    const seq$4 = () => {
        const indexReset = parseIndex
        let seq$4$0 = null
        let seq$4$1 = null
        let seq$4$2 = null
        if ((seq$4$0 = rule_pair()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$4$1 = rule__()) === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$5 = []
        let rep$5$part = null
        while ((rep$5$part = seq$5()) !== nomatch) { rep$5.push(rep$5$part) }
        seq$4$2 = rep$5

        return [seq$4$0, seq$4$1, seq$4$2]
    }
    
    const rule_$ = () => {
        let indexReset = parseIndex
        let arg0 = null
        if ((arg0 = rule_value()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["$"](arg0)
        return value
    }
    const rule_value = () => {
        let indexReset = parseIndex
        let arg0 = null
        if ((arg0 = or$0()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["value"](arg0)
        return value
    }
    const rule_string = () => {
        let indexReset = parseIndex
        let arg0 = null
        if ((arg0 = join$0()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["string"](arg0)
        return value
    }
    const rule_stresc = () => {
        let indexReset = parseIndex
        
        if ($2() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($3() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["stresc"]()
        return value
    }
    const rule_number = () => {
        let indexReset = parseIndex
        let arg0 = null
        if ((arg0 = join$1()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["number"](arg0)
        return value
    }
    const rule_array = () => {
        let indexReset = parseIndex
        let arg2 = null
        if ($9() === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$4 = seq$2()
        arg2 = (rep$4 === nomatch) ? null : rep$4
        if ($11() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["array"](arg2)
        return value
    }
    const rule_object = () => {
        let indexReset = parseIndex
        let arg2 = null
        if ($12() === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$6 = seq$4()
        arg2 = (rep$6 === nomatch) ? null : rep$6
        if ($13() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["object"](arg2)
        return value
    }
    const rule_pair = () => {
        let indexReset = parseIndex
        let arg0 = null
        let arg4 = null
        if ((arg0 = rule_string()) === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($14() === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg4 = rule_value()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["pair"](arg0, arg4)
        return value
    }
    const rule__ = () => {
        let indexReset = parseIndex
        
        while ($15() !== nomatch) {}

        const value = $sem["_"]()
        return value
    }
    const rule___ = () => {
        let indexReset = parseIndex
        
        const rep$7 = parseIndex
        while ($15() !== nomatch) {}
        if (parseIndex - rep$7 === 0) { return nomatch }

        const value = $sem["__"]()
        return value
    }

    let parseIndex = 0
    const result = rule_$()
    if (parseIndex !== str.length) {
        return new Error("End of input not found")
    }
    return result
}

export { parse }
