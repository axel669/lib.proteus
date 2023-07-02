import fs from "fs-jetpack"

import { Parser, Rule } from "../lib/main.mjs"

const nums = Parser(
    { start: Rule.lists },
    Rule`lists`(
        Rule.$repeat(
            0,
            Rule.numberList
        ),
        ([ lists ]) => lists
    ),
    Rule`numberList`(
        { name: /\w/ },
        ":",
        { n: Rule.number },
        Rule.$repeat(
            0,
            ([n], _, prev) => n < prev.n,
            Rule.item
        ),
        { rest: /[\d\s]*/ }
    ),
    Rule`number`(
        /\d+/,
        ([ n ]) => parseInt(n)
    ),
    Rule`item`(
        /\s+/,
        Rule.number,
        ([, n]) => n
    )
)

fs.write("examples/repeat-condition-module.mjs", nums.module)

console.dir(
    nums.parse(`a:5 2 3 4 b:3 1 1 2 3 4`),
    { depth: null }
)
