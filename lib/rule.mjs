import Token, { tokenStep } from "./token.mjs"

const helper = {
    $repeat: (num, ...tokens) => ({
        [Token.marked]: true,
        [Token.repeat]: true,
        count: num,
        tokens
    }),
    $opt: (...tokens) => ({
        [Token.marked]: true,
        [Token.opt]: true,
        tokens
    }),
    $or: (...tokens) => ({
        [Token.marked]: true,
        [Token.or]: true,
        tokens
    }),
}

const Rule = new Proxy(
    (...args) => {
        const [tokens, action] =
            (typeof args[args.length - 1] === "function")
            ? [args.slice(0, -1), args[args.length - 1]]
            : [args, null]
        return (name, parsers, actions) => {
            const steps = tokens.map(
                token => tokenStep(token, parsers)
            )
            parsers[name] = `(input, pos) => {
                    const results = []
                    let loc = pos
                    let match = null

                    currentRule = "${name}"

                    ${steps.join("\n\n")}

                    return [loc, action_${name}(results, state, opt)]
                }`
            actions[name] = action
        }
    },
    {
        apply(target, _, args) {
            return target(...args)
        },
        get(_, name) {
            if (helper.hasOwnProperty(name) === true) {
                return helper[name]
            }
            return Symbol.for(name)
        }
    }
)

export default Rule
