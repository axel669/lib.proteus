import { generate } from "./codegen.js"
import semantics from "./rule-semantics.js"
import * as internal from "./parser.js"

export default {
    parser: (grammar) => {
        const tree = internal.parse(grammar, semantics)
        const baseCode = generate(tree)
        const func = new Function(`${baseCode}\nreturn parse`)()
        func.source = baseCode
        return func
    },
    module: (grammar) => {
        const tree = internal.parse(grammar, semantics)
        const baseCode = generate(tree)
        return `${baseCode}\n\nexport { parse }`
    },
    generate,
    semantics,
}
