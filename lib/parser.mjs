/*md
*/

import compileParser from "./compile.mjs"

const start = Symbol("Starting Rule")
const parser = (ruleMap) => {
    const parsers = {}
    const actions = {}

    for (const [name, rule] of Object.entries(ruleMap)) {
        rule(name, parsers, actions)
    }

    const parserSource = compileParser(
        parsers,
        Symbol.keyFor(ruleMap[start]),
        actions
    )
    const genSource = parserSource.join("\nreturn ")
    const generateParser = new Function(
        genSource
    )

    return {
        parse: generateParser(),
        source: genSource,
        module: parserSource.join("\nexport default ")
    }
}
parser.start = start

export default parser
