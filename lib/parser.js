const id0 = () => null
const id1 = i => i
const idl = (...args) => args
const nomatch = Symbol("no match")

const defs = {
    "$": id1,
    "rule": idl,
    "items": id1,
    "item": idl,
    "string.dbl": id1,
    "string.sgl": id1,
    "stresc": id0,
    "chars": idl,
    "ch.0": id0,
    "ch.1": id0,
    "range": id0,
    "ruleref": id1,
    "seq": idl,
    "or": idl,
    "join": idl,
    "name": id1,
    "rulename": id1,
    "_": id0,
    "__": id0
}
const rules = Object.keys(defs)

export const parse = (str, sem) => {
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

    const $0 = strmatch("$")
    const $1 = strmatch(".")
    const $2 = strmatch("=")
    const $3 = strmatch("#")
    const $4 = strmatch("*")
    const $5 = strmatch("+")
    const $6 = strmatch("?")
    const $7 = strmatch('"')
    const $8 = regmatch(/[^"]/)
    const $9 = strmatch("'")
    const $10 = regmatch(/[^']/)
    const $11 = strmatch("\\")
    const $12 = regmatch(/[\\rntvbxu'"]/)
    const $13 = strmatch("[")
    const $14 = strmatch("]")
    const $15 = strmatch("i")
    const $16 = strmatch("m")
    const $17 = regmatch(/[^\-\]\\]/)
    const $18 = regmatch(/[snwrntvb\]\-\\]/)
    const $19 = strmatch("-")
    const $20 = strmatch("(")
    const $21 = strmatch(")")
    const $22 = strmatch("|")
    const $23 = strmatch("{")
    const $24 = strmatch("}")
    const $25 = regmatch(/[a-z0-9_]/i)
    const $26 = strmatch("@")
    const $27 = regmatch(/[\s]/m)
    const seq$0 = () => {
        const indexReset = parseIndex
        let seq$0$0 = null
        let seq$0$1 = null
        if ((seq$0$0 = rule_rule()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$0$1 = rule__()) === nomatch) { parseIndex = indexReset; return nomatch }

        return [seq$0$0, seq$0$1]
    }
    const or$0 = () => {
        const indexReset = parseIndex
        let or$0$value = null
        if ((or$0$value = rule_rulename()) !== nomatch) { return or$0$value }
        parseIndex = indexReset
        if ((or$0$value = $0()) !== nomatch) { return or$0$value }
        parseIndex = indexReset

        return nomatch
    }
    const seq$2 = () => {
        const indexReset = parseIndex
        let seq$2$0 = null
        let seq$2$1 = null
        let seq$2$2 = null
        if ((seq$2$0 = $1()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$2$1 = rule_name()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$2$2 = rule___()) === nomatch) { parseIndex = indexReset; return nomatch }

        return [seq$2$0, seq$2$1, seq$2$2]
    }
    const seq$1 = () => {
        const indexReset = parseIndex
        let seq$1$0 = null
        let seq$1$1 = null
        let seq$1$2 = null
        let seq$1$3 = null
        if ((seq$1$0 = rule___()) === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$1 = seq$2()
        seq$1$1 = (rep$1 === nomatch) ? null : rep$1
        if ((seq$1$2 = $2()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$1$3 = rule_items()) === nomatch) { parseIndex = indexReset; return nomatch }

        return [seq$1$0, seq$1$1, seq$1$2, seq$1$3]
    }
    const seq$3 = () => {
        const indexReset = parseIndex
        let seq$3$0 = null
        let seq$3$1 = null
        if ((seq$3$0 = rule___()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$3$1 = rule_item()) === nomatch) { parseIndex = indexReset; return nomatch }

        return [seq$3$0, seq$3$1]
    }
    const or$1 = () => {
        const indexReset = parseIndex
        let or$1$value = null
        if ((or$1$value = rule_string()) !== nomatch) { return or$1$value }
        parseIndex = indexReset
        if ((or$1$value = rule_chars()) !== nomatch) { return or$1$value }
        parseIndex = indexReset
        if ((or$1$value = rule_ruleref()) !== nomatch) { return or$1$value }
        parseIndex = indexReset
        if ((or$1$value = rule_seq()) !== nomatch) { return or$1$value }
        parseIndex = indexReset
        if ((or$1$value = rule_or()) !== nomatch) { return or$1$value }
        parseIndex = indexReset
        if ((or$1$value = rule_join()) !== nomatch) { return or$1$value }
        parseIndex = indexReset

        return nomatch
    }
    const or$2 = () => {
        const indexReset = parseIndex
        let or$2$value = null
        if ((or$2$value = $4()) !== nomatch) { return or$2$value }
        parseIndex = indexReset
        if ((or$2$value = $5()) !== nomatch) { return or$2$value }
        parseIndex = indexReset
        if ((or$2$value = $6()) !== nomatch) { return or$2$value }
        parseIndex = indexReset

        return nomatch
    }
    const or$3 = () => {
        const indexReset = parseIndex
        let or$3$value = null
        if ((or$3$value = rule_stresc()) !== nomatch) { return or$3$value }
        parseIndex = indexReset
        if ((or$3$value = $8()) !== nomatch) { return or$3$value }
        parseIndex = indexReset

        return nomatch
    }
    const join$0 = () => {
        const indexReset = parseIndex

        if ($7() === nomatch) { parseIndex = indexReset; return nomatch }
        while (or$3() !== nomatch) {}
        if ($7() === nomatch) { parseIndex = indexReset; return nomatch }

        return str.slice(indexReset, parseIndex)
    }
    const or$4 = () => {
        const indexReset = parseIndex
        let or$4$value = null
        if ((or$4$value = rule_stresc()) !== nomatch) { return or$4$value }
        parseIndex = indexReset
        if ((or$4$value = $10()) !== nomatch) { return or$4$value }
        parseIndex = indexReset

        return nomatch
    }
    const join$1 = () => {
        const indexReset = parseIndex

        if ($9() === nomatch) { parseIndex = indexReset; return nomatch }
        while (or$4() !== nomatch) {}
        if ($9() === nomatch) { parseIndex = indexReset; return nomatch }

        return str.slice(indexReset, parseIndex)
    }
    const or$5 = () => {
        const indexReset = parseIndex
        let or$5$value = null
        if ((or$5$value = rule_range()) !== nomatch) { return or$5$value }
        parseIndex = indexReset
        if ((or$5$value = rule_ch()) !== nomatch) { return or$5$value }
        parseIndex = indexReset

        return nomatch
    }
    const join$2 = () => {
        const indexReset = parseIndex

        if ($13() === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$6 = parseIndex
        while (or$5() !== nomatch) {}
        if (parseIndex - rep$6 === 0) { return nomatch }
        if ($14() === nomatch) { parseIndex = indexReset; return nomatch }

        return str.slice(indexReset, parseIndex)
    }
    const join$3 = () => {
        const indexReset = parseIndex

        $15()
        $16()

        return str.slice(indexReset, parseIndex)
    }
    const seq$4 = () => {
        const indexReset = parseIndex
        let seq$4$0 = null
        let seq$4$1 = null
        let seq$4$2 = null
        let seq$4$3 = null
        if ((seq$4$0 = rule___()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$4$1 = $22()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$4$2 = rule___()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$4$3 = rule_item()) === nomatch) { parseIndex = indexReset; return nomatch }

        return [seq$4$0, seq$4$1, seq$4$2, seq$4$3]
    }
    const join$4 = () => {
        const indexReset = parseIndex

        const rep$8 = parseIndex
        while ($25() !== nomatch) {}
        if (parseIndex - rep$8 === 0) { return nomatch }

        return str.slice(indexReset, parseIndex)
    }
    
    const rule_$ = () => {
        let indexReset = parseIndex
        let arg1 = null
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$0 = []
        let rep$0$part = null
        while ((rep$0$part = seq$0()) !== nomatch) { rep$0.push(rep$0$part) }
        arg1 = rep$0

        const value = $sem["$"](arg1)
        return value
    }
    const rule_rule = () => {
        let indexReset = parseIndex
        let arg0 = null
        let arg1 = null
        if ((arg0 = or$0()) === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$2 = []
        let rep$2$part = null
        while ((rep$2$part = seq$1()) !== nomatch) { rep$2.push(rep$2$part) }
        if (rep$2.length === 0) { return nomatch }
        arg1 = rep$2

        const value = $sem["rule"](arg0, arg1)
        return value
    }
    const rule_items = () => {
        let indexReset = parseIndex
        let arg0 = null
        const rep$3 = []
        let rep$3$part = null
        while ((rep$3$part = seq$3()) !== nomatch) { rep$3.push(rep$3$part) }
        arg0 = rep$3

        const value = $sem["items"](arg0)
        return value
    }
    const rule_item = () => {
        let indexReset = parseIndex
        let arg0 = null
        let arg1 = null
        let arg2 = null
        const rep$4 = $3()
        arg0 = (rep$4 === nomatch) ? null : rep$4
        if ((arg1 = or$1()) === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$5 = or$2()
        arg2 = (rep$5 === nomatch) ? null : rep$5

        const value = $sem["item"](arg0, arg1, arg2)
        return value
    }
    const rule_string = () => {
        let result = null

        if ((result = rule_string$dbl()) !== nomatch) { return result }
        if ((result = rule_string$sgl()) !== nomatch) { return result }

        return nomatch
    }
        
    const rule_string$dbl = () => {
        let indexReset = parseIndex
        let arg0 = null
        if ((arg0 = join$0()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["string.dbl"](arg0)
        return value
    }
        
    const rule_string$sgl = () => {
        let indexReset = parseIndex
        let arg0 = null
        if ((arg0 = join$1()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["string.sgl"](arg0)
        return value
    }
    const rule_stresc = () => {
        let indexReset = parseIndex
        
        if ($11() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($12() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["stresc"]()
        return value
    }
    const rule_chars = () => {
        let indexReset = parseIndex
        let arg0 = null
        let arg1 = null
        if ((arg0 = join$2()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg1 = join$3()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["chars"](arg0, arg1)
        return value
    }
    const rule_ch = () => {
        let result = null

        if ((result = rule_ch$0()) !== nomatch) { return result }
        if ((result = rule_ch$1()) !== nomatch) { return result }

        return nomatch
    }
        
    const rule_ch$0 = () => {
        let indexReset = parseIndex
        
        if ($17() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["ch.0"]()
        return value
    }
        
    const rule_ch$1 = () => {
        let indexReset = parseIndex
        
        if ($11() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($18() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["ch.1"]()
        return value
    }
    const rule_range = () => {
        let indexReset = parseIndex
        
        if (rule_ch() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($19() === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule_ch() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["range"]()
        return value
    }
    const rule_ruleref = () => {
        let indexReset = parseIndex
        let arg0 = null
        if ((arg0 = rule_name()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["ruleref"](arg0)
        return value
    }
    const rule_seq = () => {
        let indexReset = parseIndex
        let arg2 = null
        let arg3 = null
        if ($20() === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg2 = rule_item()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg3 = rule_items()) === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($21() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["seq"](arg2, arg3)
        return value
    }
    const rule_or = () => {
        let indexReset = parseIndex
        let arg1 = null
        let arg2 = null
        if ($20() === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg1 = rule_item()) === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$7 = []
        let rep$7$part = null
        while ((rep$7$part = seq$4()) !== nomatch) { rep$7.push(rep$7$part) }
        if (rep$7.length === 0) { return nomatch }
        arg2 = rep$7
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($21() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["or"](arg1, arg2)
        return value
    }
    const rule_join = () => {
        let indexReset = parseIndex
        let arg2 = null
        let arg3 = null
        if ($23() === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg2 = rule_item()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg3 = rule_items()) === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($24() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["join"](arg2, arg3)
        return value
    }
    const rule_name = () => {
        let indexReset = parseIndex
        let arg0 = null
        if ((arg0 = join$4()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["name"](arg0)
        return value
    }
    const rule_rulename = () => {
        let indexReset = parseIndex
        let arg1 = null
        if ($26() === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg1 = rule_name()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = $sem["rulename"](arg1)
        return value
    }
    const rule__ = () => {
        let indexReset = parseIndex
        
        while ($27() !== nomatch) {}

        const value = $sem["_"]()
        return value
    }
    const rule___ = () => {
        let indexReset = parseIndex
        
        const rep$9 = parseIndex
        while ($27() !== nomatch) {}
        if (parseIndex - rep$9 === 0) { return nomatch }

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