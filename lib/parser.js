const nomatch = Symbol("no match")

const parse = (str, options) => {
    
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
    const $3 = strmatch("---")
    const $4 = strmatch("\n")
    const $5 = regmatch(/[\s]/)
    const $6 = strmatch("---\n")
    const $7 = regmatch(/[^\n]/)
    const $8 = strmatch("(")
    const $9 = regmatch(/[^\)\n]/)
    const $10 = strmatch(")")
    const $11 = strmatch("#")
    const $12 = strmatch("*")
    const $13 = strmatch("+")
    const $14 = strmatch("?")
    const $15 = strmatch("!")
    const $16 = strmatch('"')
    const $17 = regmatch(/[^"]/)
    const $18 = strmatch("'")
    const $19 = regmatch(/[^']/)
    const $20 = strmatch("\\")
    const $21 = regmatch(/[\\rntvbxu'"]/)
    const $22 = strmatch("[")
    const $23 = strmatch("]")
    const $24 = strmatch("i")
    const $25 = strmatch("m")
    const $26 = regmatch(/[^\-\]\\]/)
    const $27 = regmatch(/[snwrntvb\]\-\\\(\)\[\^\$\/\.]/)
    const $28 = strmatch("-")
    const $29 = strmatch("|")
    const $30 = strmatch("{")
    const $31 = strmatch("}")
    const $32 = regmatch(/[a-z0-9_]/i)
    const $33 = strmatch("@")
    const $34 = regmatch(/[\s]/m)
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
        let seq$1$4 = null
        if ((seq$1$0 = rule___()) === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$2 = seq$2()
        seq$1$1 = (rep$2 === nomatch) ? null : rep$2
        if ((seq$1$2 = $2()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$1$3 = rule_items()) === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$3 = rule_action()
        seq$1$4 = (rep$3 === nomatch) ? null : rep$3

        return [seq$1$0, seq$1$1, seq$1$2, seq$1$3, seq$1$4]
    }
    const join$0 = () => {
        const indexReset = parseIndex

        const rep$5 = parseIndex
        while (rule_codeLine() !== nomatch) {}
        if (parseIndex - rep$5 === 0) { return nomatch }

        return str.slice(indexReset, parseIndex)
    }
    const join$1 = () => {
        const indexReset = parseIndex

        if ($8() === nomatch) { parseIndex = indexReset; return nomatch }
        while ($9() !== nomatch) {}
        if ($10() === nomatch) { parseIndex = indexReset; return nomatch }

        return str.slice(indexReset, parseIndex)
    }
    const join$2 = () => {
        const indexReset = parseIndex

        const rep$6 = parseIndex
        while (rule_codeLine() !== nomatch) {}
        if (parseIndex - rep$6 === 0) { return nomatch }

        return str.slice(indexReset, parseIndex)
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
        if ((or$2$value = $12()) !== nomatch) { return or$2$value }
        parseIndex = indexReset
        if ((or$2$value = $13()) !== nomatch) { return or$2$value }
        parseIndex = indexReset
        if ((or$2$value = $14()) !== nomatch) { return or$2$value }
        parseIndex = indexReset

        return nomatch
    }
    const or$3 = () => {
        const indexReset = parseIndex
        let or$3$value = null
        if ((or$3$value = rule_seq()) !== nomatch) { return or$3$value }
        parseIndex = indexReset
        if ((or$3$value = rule_ruleref()) !== nomatch) { return or$3$value }
        parseIndex = indexReset
        if ((or$3$value = rule_string()) !== nomatch) { return or$3$value }
        parseIndex = indexReset

        return nomatch
    }
    const or$4 = () => {
        const indexReset = parseIndex
        let or$4$value = null
        if ((or$4$value = rule_stresc()) !== nomatch) { return or$4$value }
        parseIndex = indexReset
        if ((or$4$value = $17()) !== nomatch) { return or$4$value }
        parseIndex = indexReset

        return nomatch
    }
    const join$3 = () => {
        const indexReset = parseIndex

        if ($16() === nomatch) { parseIndex = indexReset; return nomatch }
        while (or$4() !== nomatch) {}
        if ($16() === nomatch) { parseIndex = indexReset; return nomatch }

        return str.slice(indexReset, parseIndex)
    }
    const or$5 = () => {
        const indexReset = parseIndex
        let or$5$value = null
        if ((or$5$value = rule_stresc()) !== nomatch) { return or$5$value }
        parseIndex = indexReset
        if ((or$5$value = $19()) !== nomatch) { return or$5$value }
        parseIndex = indexReset

        return nomatch
    }
    const join$4 = () => {
        const indexReset = parseIndex

        if ($18() === nomatch) { parseIndex = indexReset; return nomatch }
        while (or$5() !== nomatch) {}
        if ($18() === nomatch) { parseIndex = indexReset; return nomatch }

        return str.slice(indexReset, parseIndex)
    }
    const or$6 = () => {
        const indexReset = parseIndex
        let or$6$value = null
        if ((or$6$value = rule_range()) !== nomatch) { return or$6$value }
        parseIndex = indexReset
        if ((or$6$value = rule_ch()) !== nomatch) { return or$6$value }
        parseIndex = indexReset

        return nomatch
    }
    const join$5 = () => {
        const indexReset = parseIndex

        if ($22() === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$10 = parseIndex
        while (or$6() !== nomatch) {}
        if (parseIndex - rep$10 === 0) { return nomatch }
        if ($23() === nomatch) { parseIndex = indexReset; return nomatch }

        return str.slice(indexReset, parseIndex)
    }
    const join$6 = () => {
        const indexReset = parseIndex

        $24()
        $25()

        return str.slice(indexReset, parseIndex)
    }
    const seq$4 = () => {
        const indexReset = parseIndex
        let seq$4$0 = null
        let seq$4$1 = null
        let seq$4$2 = null
        let seq$4$3 = null
        if ((seq$4$0 = rule___()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$4$1 = $29()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$4$2 = rule___()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((seq$4$3 = rule_item()) === nomatch) { parseIndex = indexReset; return nomatch }

        return [seq$4$0, seq$4$1, seq$4$2, seq$4$3]
    }
    const join$7 = () => {
        const indexReset = parseIndex

        const rep$12 = parseIndex
        while ($32() !== nomatch) {}
        if (parseIndex - rep$12 === 0) { return nomatch }

        return str.slice(indexReset, parseIndex)
    }
    
    const action_$ = (init, rules) => {
    return {
        init,
        rules: rules.map(rule => rule[0])
    }

    }
    
    const rule_$ = () => {
        let indexReset = parseIndex
        let arg0 = null
        let arg2 = null
        const rep$0 = rule_init()
        arg0 = (rep$0 === nomatch) ? null : rep$0
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$1 = []
        let rep$1$part = null
        while ((rep$1$part = seq$0()) !== nomatch) { rep$1.push(rep$1$part) }
        arg2 = rep$1

        const value = action_$(arg0, arg2)
        return value
    }
    const action_rule = (name, defs) => {
    return {
        type: "rule",
        name,
        defs: defs.map(
            (def, index) => ({
                name: def[1]?.[1] ?? index.toString(),
                seq: def[3],
                action: def[4]
            })
        )
    }

    }
    
    const rule_rule = () => {
        let indexReset = parseIndex
        let arg0 = null
        let arg1 = null
        if ((arg0 = or$0()) === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$4 = []
        let rep$4$part = null
        while ((rep$4$part = seq$1()) !== nomatch) { rep$4.push(rep$4$part) }
        if (rep$4.length === 0) { return nomatch }
        arg1 = rep$4

        const value = action_rule(arg0, arg1)
        return value
    }
    const action_delim = () => undefined
    const rule_delim = () => {
        let indexReset = parseIndex
        
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($3() === nomatch) { parseIndex = indexReset; return nomatch }
        $4()

        const value = action_delim()
        return value
    }
    const action_codeLine = () => undefined
    const rule_codeLine = () => {
        let indexReset = parseIndex
        
        while ($5() !== nomatch) {}
        if ($6() !== nomatch) { parseIndex = indexReset; return nomatch }
        while ($7() !== nomatch) {}
        if ($4() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_codeLine()
        return value
    }
    const action_init = (value) => value
    const rule_init = () => {
        let indexReset = parseIndex
        let arg1 = null
        if (rule_delim() === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg1 = join$0()) === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule_delim() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_init(arg1)
        return value
    }
    const action_actionDelim = (value) => value
    const rule_actionDelim = () => {
        let indexReset = parseIndex
        let arg2 = null
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($3() === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg2 = join$1()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ($4() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_actionDelim(arg2)
        return value
    }
    const action_action = (args, code) => {
    return { args, code }

    }
    
    const rule_action = () => {
        let indexReset = parseIndex
        let arg0 = null
        let arg1 = null
        if ((arg0 = rule_actionDelim()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg1 = join$2()) === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule_delim() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_action(arg0, arg1)
        return value
    }
    const action_items = (list) => {
    return list.map(item => item[1])

    }
    
    const rule_items = () => {
        let indexReset = parseIndex
        let arg0 = null
        const rep$7 = []
        let rep$7$part = null
        while ((rep$7$part = seq$3()) !== nomatch) { rep$7.push(rep$7$part) }
        arg0 = rep$7

        const value = action_items(arg0)
        return value
    }
    const rule_item = () => {
        let result = null

        if ((result = rule_item$normal()) !== nomatch) { return result }
        if ((result = rule_item$negate()) !== nomatch) { return result }

        return nomatch
    }
        
    const action_item$normal = (arg, item, repeat) => {
        item.arg = arg !== null
        item.repeat = repeat
        return item

    }
    
    const rule_item$normal = () => {
        let indexReset = parseIndex
        let arg0 = null
        let arg1 = null
        let arg2 = null
        const rep$8 = $11()
        arg0 = (rep$8 === nomatch) ? null : rep$8
        if ((arg1 = or$1()) === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$9 = or$2()
        arg2 = (rep$9 === nomatch) ? null : rep$9

        const value = action_item$normal(arg0, arg1, arg2)
        return value
    }
        
    const action_item$negate = (expr) => {
        expr.arg = false
        expr.repeat = null
        return { type: "negate", expr, arg: false }

    }
    
    const rule_item$negate = () => {
        let indexReset = parseIndex
        let arg1 = null
        if ($15() === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg1 = or$3()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_item$negate(arg1)
        return value
    }
    const rule_string = () => {
        let result = null

        if ((result = rule_string$dbl()) !== nomatch) { return result }
        if ((result = rule_string$sgl()) !== nomatch) { return result }

        return nomatch
    }
        
    const action_string$dbl = (string) => {
        return { type: "string", string }

    }
    
    const rule_string$dbl = () => {
        let indexReset = parseIndex
        let arg0 = null
        if ((arg0 = join$3()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_string$dbl(arg0)
        return value
    }
        
    const action_string$sgl = (string) => {
        return { type: "string", string }

    }
    
    const rule_string$sgl = () => {
        let indexReset = parseIndex
        let arg0 = null
        if ((arg0 = join$4()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_string$sgl(arg0)
        return value
    }
    const action_stresc = () => undefined
    const rule_stresc = () => {
        let indexReset = parseIndex
        
        if ($20() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($21() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_stresc()
        return value
    }
    const action_chars = (regex, flags) => {
    return { type: "regex", regex, flags }

    }
    
    const rule_chars = () => {
        let indexReset = parseIndex
        let arg0 = null
        let arg1 = null
        if ((arg0 = join$5()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg1 = join$6()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_chars(arg0, arg1)
        return value
    }
    const rule_ch = () => {
        let result = null

        if ((result = rule_ch$0()) !== nomatch) { return result }
        if ((result = rule_ch$1()) !== nomatch) { return result }

        return nomatch
    }
        
    const action_ch$0 = () => undefined
    const rule_ch$0 = () => {
        let indexReset = parseIndex
        
        if ($26() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_ch$0()
        return value
    }
        
    const action_ch$1 = () => undefined
    const rule_ch$1 = () => {
        let indexReset = parseIndex
        
        if ($20() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($27() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_ch$1()
        return value
    }
    const action_range = () => undefined
    const rule_range = () => {
        let indexReset = parseIndex
        
        if (rule_ch() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($28() === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule_ch() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_range()
        return value
    }
    const action_ruleref = (rule) => {
    return { type: "ruleref", rule }

    }
    
    const rule_ruleref = () => {
        let indexReset = parseIndex
        let arg0 = null
        if ((arg0 = rule_name()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_ruleref(arg0)
        return value
    }
    const action_seq = (first, rest) => {
    return { type: "seq", seq: [first, ...rest] }

    }
    
    const rule_seq = () => {
        let indexReset = parseIndex
        let arg2 = null
        let arg3 = null
        if ($8() === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg2 = rule_item()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg3 = rule_items()) === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($10() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_seq(arg2, arg3)
        return value
    }
    const action_or = (first, rest) => {
    return {
        type: "or",
        items: [
            first,
            ...rest.map(
                r => r[3]
            )
        ]
    }

    }
    
    const rule_or = () => {
        let indexReset = parseIndex
        let arg1 = null
        let arg2 = null
        if ($8() === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg1 = rule_item()) === nomatch) { parseIndex = indexReset; return nomatch }
        const rep$11 = []
        let rep$11$part = null
        while ((rep$11$part = seq$4()) !== nomatch) { rep$11.push(rep$11$part) }
        if (rep$11.length === 0) { return nomatch }
        arg2 = rep$11
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($10() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_or(arg1, arg2)
        return value
    }
    const action_join = (first, rest) => {
    return { type: "join", seq: [first, ...rest] }

    }
    
    const rule_join = () => {
        let indexReset = parseIndex
        let arg2 = null
        let arg3 = null
        if ($30() === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg2 = rule_item()) === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg3 = rule_items()) === nomatch) { parseIndex = indexReset; return nomatch }
        if (rule__() === nomatch) { parseIndex = indexReset; return nomatch }
        if ($31() === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_join(arg2, arg3)
        return value
    }
    const action_name = (value) => value
    const rule_name = () => {
        let indexReset = parseIndex
        let arg0 = null
        if ((arg0 = join$7()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_name(arg0)
        return value
    }
    const action_rulename = (value) => value
    const rule_rulename = () => {
        let indexReset = parseIndex
        let arg1 = null
        if ($33() === nomatch) { parseIndex = indexReset; return nomatch }
        if ((arg1 = rule_name()) === nomatch) { parseIndex = indexReset; return nomatch }

        const value = action_rulename(arg1)
        return value
    }
    const action__ = () => undefined
    const rule__ = () => {
        let indexReset = parseIndex
        
        while ($34() !== nomatch) {}

        const value = action__()
        return value
    }
    const action___ = () => undefined
    const rule___ = () => {
        let indexReset = parseIndex
        
        const rep$13 = parseIndex
        while ($34() !== nomatch) {}
        if (parseIndex - rep$13 === 0) { return nomatch }

        const value = action___()
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
