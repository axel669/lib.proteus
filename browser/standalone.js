var proteus = (function (exports) {
    'use strict';

    let currentID = 0;
    const id = () => {
        currentID += 1;
        return currentID
    };

    const Token = {
        opt: Symbol("opt"),
        repeat: Symbol("repeat"),
        or: Symbol("or"),
        marked: Symbol("token")
    };

    const generateCondtional = (condition, parsers) => {
        if (condition === null) {
            return ""
        }

        const name = `$condition${id()}`;
        parsers[Symbol.for(name)] = condition.toString();

        return `
        if (${name}(partialValue, state, parentResults) !== true) {
            loc = startLoc
            break
        }
    `.trim()
    };
    const tokenRepeat = ({ count, tokens }, parsers) => {
        const name = `$parse_repeat${id()}`;
        const [condition, tokenList] =
            (typeof tokens[0] === "function")
            ? [tokens[0], tokens.slice(1)]
            : [null, tokens];
        const looped = tokenList.map(
            (item) => tokenStep({ [Token.marked]: true, loop: true, item }, parsers)
        ).join("\n\n");
        const conditional = generateCondtional(condition, parsers);

        parsers[Symbol.for(name)] = `(input, pos, parentResults) => {
        const results = []
        let loc = pos
        let match = null

        while (true) {
            const startLoc = loc
            const partial = []
            ${looped}

            const partialValue = partial${looped.length === 1 ? "[0]" : ""}
            ${conditional}

            results.push(partialValue)
        }
        if (results.length < ${count}) {
            return [pos, none]
        }
        return [loc, results]
    }`;

        return `${name}(input, loc, results)`
    };
    const tokenOr = ({ tokens }, parsers) => {
        const name = `$parse_or${id()}`;
        const helpers = tokens.map(
            (tokens, index) => [
                `${name}_${index}`,
                tokens.map(
                    token => tokenStep(token, parsers)
                )
            ]
        );

        parsers[Symbol.for(name)] = `(input, pos) => {
        let loc = pos
        let match = null

        ${helpers.map(
        ([name, steps]) => {
            if (steps.length === 1) {
                return `
                    ${steps[0].split("\n")[0]}
                    if (match !== none) { return [loc, match] }
                `.trim()
            }

            parsers[Symbol.for(name)] = `(input, pos) => {
                const results = []
                let loc = pos
                let match = null

                ${steps.join("\n\n")}

                return [loc, results${steps.length === 1 ? "[0]" : ""}]
            }`;
            return `
                ;[loc, match] = ${name}(input, pos)
                if (match !== none) { return [loc, match] }
            `.trim()
        }
    ).join("\n\n")}

        return [pos, none]
    }`;

        return `${name}(input, loc)`
    };
    const tokenOpt = ({ tokens }, parsers, target) => {
        const name = `$parse_opt${id()}`;
        parsers[Symbol.for(name)] = `(input, pos) => {
        const results = []
        let loc = pos
        let match = null

        ${tokens.map(
        token => `
            ${tokenStep({ [Token.marked]: true, opt: true, item: token }, parsers)}
            if (match === none) { location(pos); return [pos, null] }
        `
    ).join("\n\n")}

        return [loc, results]
    }`;

        return `${name}(input, loc)`
    };
    const tokenAction = (token, parsers) => {
        const item = token.item ?? token;

        if (item[Token.repeat] === true) {
            const code = tokenRepeat(item, parsers);
            return code
        }
        if (item[Token.opt] === true) {
            return tokenOpt(item, parsers)
        }
        if (item[Token.or] === true) {
            return tokenOr(item, parsers)
        }
        if (item.constructor === RegExp) {
            const sticky = new RegExp(
                item.source,
                [...new Set(`y${item.flags}`)].join("")
            );
            return `consumeRegex(${sticky}, input, loc)`
        }

        if (typeof item === "string") {
            return `consumeString(${JSON.stringify(item)}, input, loc)`
        }

        if (item.constructor === Symbol) {
            const name = Symbol.keyFor(item);
            return `parse_${name}(input, loc)`
        }

        console.log("failed action:", token);
    };
    const tokenReaction = (token) => {
        if (token.opt === true) {
            return ""
        }
        if (token.loop === true) {
            return "if (match === none) { location(pos); break }"
        }
        return "if (match === none) { location(pos); return [pos, none] }"
    };
    const tokenStep = (tokenInfo, parsers) => {
        const [name, token] =
            (tokenInfo.constructor === Object && tokenInfo[Token.marked] !== true)
            ? Object.entries(tokenInfo)[0]
            : [null, tokenInfo];
        const target = token.loop === true ? "partial" : "results";

        const action = tokenAction(token, parsers);
        const early = tokenReaction(token);
        const step = `;[loc, match] = ${action}\n${early}`.trim();
        const named = (name === null) ? "" : `${target}.${name} = match`;

        return `
        ${step}
        ${target}.push(match)
        ${named}
    `.trim()
    };

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
    };

    const Rule = new Proxy(
        ([name]) =>
            (...args) => {
                const [tokens, action] =
                    (typeof args[args.length - 1] === "function")
                    ? [args.slice(0, -1), args[args.length - 1]]
                    : [args, null];
                return (parsers, actions) => {
                    const steps = tokens.map(
                        token => tokenStep(token, parsers)
                    );
                    parsers[name] = `(input, pos) => {
                        const results = []
                        let loc = pos
                        let match = null

                        currentRule = "${name}"

                        ${steps.join("\n\n")}

                        return [loc, action_${name}(results, state, opt)]
                    }`;
                    actions[name] = action;
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
    );

    const parseHeader = `
const none = Symbol("none")

let state = null
let opt = null

const consumeString = (pattern, input, pos) => {
    if (input.substr(pos, pattern.length) === pattern) {
        return [pos + pattern.length, pattern]
    }
    return [pos, none]
}
const consumeRegex = (pattern, input, pos) => {
    pattern.lastIndex = pos
    const match = pattern.exec(input)
    if (match === null) {
        return [pos, none]
    }
    return [pattern.lastIndex, match?.[0] ?? null]
}

let last = 0
let lastRule = null
let currentRule = null
const location = (pos) => {
    if (pos < last) {
        return
    }
    last = pos
    lastRule = currentRule
}
const linePosition = (input, pos) => {
    let line = 0
    let next = 0
    while (next < pos && next !== -1) {
        line += 1
        next = input.indexOf("\\n", next + 1)
    }
    return {
        line,
        col: pos - input.lastIndexOf("\\n", pos)
    }
}
`.trim();

    const formatCode = (code) => {
        let level = 0;
        let indent = "    ";
        return (
            code
            .trim()
            .split("\n")
            .map(
                (line) => {
                    const l = line.trim();
                    if (l === "") {
                        return ""
                    }
                    if (l === "}") {
                        level -= 1;
                        return `${indent.repeat(level)}${l}`
                    }

                    const out = `${indent.repeat(level)}${l}`;

                    if (l.endsWith("{") === true) {
                        level += 1;
                        return out
                    }
                    if (l.startsWith("if ") === false && l.endsWith("}") === true) {
                        level -= 1;
                        return out
                    }
                    return out
                }
            )
            .join("\n")
            .replace(
                /\n\n(\n*)/g,
                "\n\n"
            )
        )
    };

    const compileParser = (parsers, entry, actions) => {
        const iden = i => i;
        return [
            formatCode(`
            ${parseHeader}
            ${Object.getOwnPropertySymbols(parsers).map(
                (sym) => `const ${Symbol.keyFor(sym)} = ${parsers[sym]}`
            ).join("\n")}

            ${Object.entries(parsers).map(
                ([name, code]) => `
                    const action_${name} = ${(actions[name] ?? iden).toString()}
                    const parse_${name} = ${code}
                `.trim()
            ).join("\n")}
        `),
            formatCode(`(input, options) => {
            last = 0
            opt = options
            state = {
            }
            const [index, value] = parse_${entry}(input, 0)
            if (index !== input.length) {
                if (value === none) {
                    const pos = linePosition(input, last)
                    const error = new Error(\`
                        Parser failed at line \${pos.line}, col \${pos.col}.
                        -> Expected \${lastRule} but got \${JSON.stringify(input.at(last))}.
                        \`
                        .trim()
                        .replace(/^\\s/mg, "")
                    )
                    error.input = input
                    error.position = pos
                    error.index = last
                    error.rule = lastRule

                    return error
                }
                const error = new Error("Expected EOF got not that dingus")
                error.index = last
                error.parsed = input.slice(0, last)
                error.remaining = input.slice(last)
                return error
            }

            return value
        }`)
        ]
    };

    /*md
    */


    const parser = (options, ...rules) => {
        const parsers = {};
        const actions = {};

        for (const rule of rules) {
            rule(parsers, actions);
        }

        const parserSource = compileParser(
            parsers,
            Symbol.keyFor(options.start),
            actions
        );
        const genSource = parserSource.join("\nreturn ");
        const generateParser = new Function(
            genSource
        );

        return {
            parse: generateParser(),
            source: genSource,
            module: parserSource.join("\nexport default ")
        }
    };

    exports.Parser = parser;
    exports.Rule = Rule;

    return exports;

})({});
