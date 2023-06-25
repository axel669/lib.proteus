import { Parser, Rule } from "../main.mjs"

const json = Parser(
    { start: Rule.value },
    Rule`number`(
        /\d+(\.\d+(e(\+|\-)\d+)?)?/i,
        ([n]) => parseFloat(n)
    ),
    Rule`string`(
        /"(\\"|[^"])*"/,
        ([str]) => JSON.parse(str)
    ),
    Rule`true`(
        "true",
        () => true
    ),
    Rule`false`(
        "false",
        () => false
    ),
    Rule`null`(
        "null",
        () => null
    ),
    Rule`array`(
        "[",
        /\s*/,
        Rule.$opt(
            Rule.value,
            /s*/,
            Rule.$repeat(
                0,
                /s*/,
                ",",
                /\s*/,
                Rule.value
            )
        ),
        /\s*/,
        "]",
        ([, , info]) =>
            (info === null)
                ? []
                : [
                    info[0],
                    ...info[2].map(
                        item => item[3]
                    )
                ]
    ),
    Rule`object`(
        "{",
        /\s*/,
        Rule.$opt(
            Rule.kvpair,
            /s*/,
            Rule.$repeat(
                0,
                /s*/,
                ",",
                /\s*/,
                Rule.kvpair
            )
        ),
        /\s*/,
        "}",
        ([, , info]) =>
            (info === null)
                ? []
                : Object.fromEntries([
                    info[0],
                    ...info[2].map(
                        item => item[3]
                    )
                ])
    ),
    Rule`kvpair`(
        Rule.string,
        /\s*/,
        ":",
        /\s*/,
        Rule.value,
        ([key, , , , value]) => [key, value]
    ),
    Rule`value`(
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
    )
)

const obj = [
    1,
    2,
    3,
    null,
    [ false ],
    { a: [ "b" ] }
]
const input = JSON.stringify(obj, null, 2)
console.log(input)
console.log(
    json.parse(input)
)