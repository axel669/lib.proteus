import compileParser from "./compile.mjs"

const parser = (options, ...rules) => {
    const parsers = {}
    const actions = {}

    for (const rule of rules) {
        rule(parsers, actions)
    }

    const parserSource = compileParser(
        parsers,
        Symbol.keyFor(options.start)
    )
    const genSource = parserSource.join("\nreturn ")
    const generateParser = new Function(
        "actions",
        genSource
    )

    return {
        parse: generateParser(actions),
        source: genSource,
        module: parserSource.join("\nexport default ")
    }
}

export default parser
