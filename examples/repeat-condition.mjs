import fs from "fs-jetpack"

import { Parser, Rule } from "../lib/main.mjs"

const nums = Parser(
    { start: Rule.nums },
    Rule`nums`(
        /\d+/,
        Rule.$repeat(
            0,
            ([n]) => n < 4,
            Rule.num
        ),
        /.*/
    ),
    Rule`num`(
        /\s+/,
        /\d+/,
        ([, n]) => parseInt(n)
    )
)

fs.write("examples/repeat-condition-module.mjs", nums.module)

console.log(
    nums.parse("1 2 3 4")
)
