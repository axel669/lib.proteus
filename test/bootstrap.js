import util from "node:util"

import fs from "fs-jetpack"
import proteus from "@axel669/proteus"

import * as nextgen from "./codegen-exp.js"

util.inspect.defaultOptions.depth = null

// const grammar = fs.read("lib/grammar.proteus")
const next = fs.read("test/grammar-next.proteus")
const expgram = fs.read("test/grammar-exp.proteus")

const parserModule = proteus.module(next)
// console.log(parserModule)
fs.write("test/next-parser.js", parserModule)

const semantics = {
    ...proteus.semantics,
    $: (init, rules) => {
        return { init, rules: rules.map(r => r[0]) }
    },
    "rule": (name, defs) => ({
        type: "rule",
        name,
        defs: defs.map(
            (def, index) => ({
                name: def[1]?.[1] ?? index.toString(),
                seq: def[3],
                action: def[4]
            })
        )
    }),
    action: (args, code) => ({ args, code })
}

const parse = proteus.parser(next)
const exptree = parse(expgram, semantics)
fs.write("test/tree-exp.json", exptree)

const expmodule = nextgen.generate(exptree)
fs.write("test/parser-exp.js", expmodule)
// const tree = parse(`
//     ---
//     console.log("ready!")
//     ---
//     $ = "test" other none
//         ---()
//         return null
//         ---
//     @other = #test
//     @none = "hi"
//     `, semantics)
// console.log(tree)
// console.log(
//     nextgen.generate(tree)
// )

// const parser = proteus.parser(grammar)
// const semantics = {
//     ...proteus.semantics,
//     $: (header, rules) => {
//         console.log(header)
//         return rules.map(r => r[0])
//     },
//     // "$": (rules) => {
//     //     console.log("$")
//     //     console.log(header)
//     //     console.log(rules)
//     //     return rules.map(r => r[0])
//     // },
//     // code: (args, code) => {
//     //     console.log("code")
//     //     console.log(args)
//     //     console.log(code)
//     //     return null
//     // },
// }

// // const testgram = `
// //     $ = [\\s]m* sep #{ codeline* } sep [\\s]m*
// //     @sep = [\\s]* "---" "\\n"?
// //     @codeline = [\\s]* !"---\\n" [^\\n]* "\\n"
// // `
// const tree = parser(next, semantics)
// // console.log(tree)
// fs.write("test/tree.json", tree)

// const code = proteus.generate(tree)

// console.log(code)
// const p2 = new Function(`${code}\nreturn parse`)()

// console.log(
//     p2(
//         `
//         ---
//         test
//         pls?
//         ---`,
//         {}
//     )
// )
