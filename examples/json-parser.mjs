import fs from "fs-jetpack"

import { Parser, Rule } from "../lib/main.mjs"

const json = Parser({
    [Parser.start]: Rule.json,
    number: Rule(
        { num: /\d+(\.\d+(e(\+|\-)\d+)?)?/i },
        ({ num }) => parseFloat(num)
    ),
    string: Rule(
        /"(\\"|[^"])*"/,
        ([str]) => JSON.parse(str)
    ),
    true: Rule(
        "true",
        () => true
    ),
    false: Rule(
        "false",
        () => false
    ),
    null: Rule(
        "null",
        () => null
    ),
    array: Rule(
        "[",
        /\s*/,
        { info: Rule.$opt(
            Rule.value,
            /s*/,
            Rule.$repeat(
                0,
                /s*/,
                ",",
                /\s*/,
                Rule.value
            )
        ) },
        /\s*/,
        "]",
        ({ info }) =>
            (info === null)
                ? []
                : [
                    info[0],
                    ...info[2].map(
                        item => item[3]
                    )
                ]
    ),
    object: Rule(
        "{",
        /\s*/,
        { info: Rule.$opt(
            Rule.kvpair,
            /s*/,
            Rule.$repeat(
                0,
                /s*/,
                ",",
                /\s*/,
                Rule.kvpair
            )
        ) },
        /\s*/,
        "}",
        ({ info }) =>
            (info === null)
                ? []
                : Object.fromEntries([
                    info[0],
                    ...info[2].map(
                        item => item[3]
                    )
                ])
    ),
    kvpair: Rule(
        { key: Rule.string },
        /\s*/,
        ":",
        /\s*/,
        { value: Rule.value },
        ({ key, value }) => [key, value]
    ),
    value: Rule(
        Rule.$or(
            [Rule.number],
            [Rule.string],
            [Rule.true],
            [Rule.false],
            [Rule.null],
            [Rule.array],
            [Rule.object],
        ),
        ([value]) => value
    ),
    json: Rule(
        /\s*/,
        { value: Rule.value },
        /\s*/,
        ({ value }) => value
    )
})

fs.write("examples/json-parser-module.mjs", json.module)

const obj = [
    1,
    2,
    3,
    null,
    [ false ],
    { a: [ "b" ] }
]
const valid = JSON.stringify(obj, null, 2) + "  "
console.log(
    json.parse(valid)
)

const invalid = `[
    1,
    2,
    3,
    null,
    [ false ],
    { a: [ "b" ] }
]`
console.log(
    json.parse(invalid)
)
