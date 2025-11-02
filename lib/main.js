import { generate } from "./codegen.js"
import semantics from "./rule-semantics.js"
import * as internal from "./parser.js"

export default {
    parser: (grammar) => {
        const tree = internal.parse(grammar, semantics)
        const baseCode = generate(tree)
        return new Function(`${baseCode}\nreturn parse`)()
    }
}
