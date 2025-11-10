import { generate } from "./codegen.js"
import { parse } from "./parser.js"

export default {
    parser: (grammar) => {
        const tree = parse(grammar)
        const baseCode = generate(tree)
        const func = new Function(`${baseCode}\nreturn parse`)()
        func.source = baseCode
        return func
    },
    module: (grammar) => {
        const tree = parse(grammar)
        const baseCode = generate(tree)
        return `${baseCode}\n\nexport { parse }\n`
    },
    parse,
    generate,
}
