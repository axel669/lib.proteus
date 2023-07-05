import fs from "fs-jetpack"

import { Parser, Rule } from "../lib/main.mjs"

const nums = Parser({
    [Parser.start]: Rule.lists,
    lists: Rule(
        Rule.$repeat(0)(
            Rule.numberList
        ),
        Rule.$or(
            [/\s+/],
            [Rule.eof]
        ),
        // Rule.$or
        //     (/\s+/)
        //     (Rule.eof)
        // ,
        ([ lists ]) => lists
    ),
    numberList: Rule(
        { name: /\w/ },
        ":",
        { n: Rule.number },
        Rule.$repeat(0)(
            ([n], _, prev) => n < prev.n,
            Rule.item
        ),
        { rest: /[\d ]*/ }
    ),
    number: Rule(
        /\d+/,
        ([ n ]) => parseInt(n)
    ),
    item: Rule(
        /\s+/,
        Rule.number,
        ([, n]) => n
    )
})

fs.write("examples/repeat-condition-module.mjs", nums.module)

console.dir(
    nums.parse(`a:5 2 3 4 b:3 1 1 2 3 4`),
    { depth: null }
)
console.dir(
    nums.parse(`a:5 2 3 4 b:3 1 1 2 3 4
    `),
    { depth: null }
)
