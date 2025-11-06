import fs from "fs-jetpack"
import proteus from "@axel669/proteus"

const grammar = fs.read("lib/grammar.proteus")
const next = fs.read("test/grammar-next.proteus")

const parserModule = proteus.module(grammar)
fs.write("test/next-parser.js", parserModule)

const parser = proteus.parser(grammar)
const semantics = {
    ...proteus.semantics,
    // "$": (rules) => {
    //     console.log("$")
    //     console.log(header)
    //     console.log(rules)
    //     return rules.map(r => r[0])
    // },
    code: (args, code) => {
        console.log("code")
        console.log(args)
        console.log(code)
        return null
    },
}

const testgram = `
    $ = #"a" !("b") #"c"
      = "a"
`
const tree = parser(testgram, proteus.semantics)
fs.write("test/tree.json", tree)

const code = proteus.generate(tree)

console.log(code)
const p2 = new Function(`${code}\nreturn parse`)()

console.log(p2("abc", {}))
