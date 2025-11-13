#! /usr/bin/env node

import fs from "fs-jetpack"
import proteus from "./main.js"
import { parseArgs } from "node:util"

const actions = {
    console: () => {
        console.log(
            proteus.func(grammar)
        )
    },
    module: () => {
        fs.write(
            dest,
            proteus.module(grammar)
        )
    },
    test: () => {
        // const pls = proteus.parse(grammar)
        // console.dir(pls, { depth: null })
        const parse = proteus.parser(grammar)
        console.log(parse)
        const codestr = fs.read(code)
        console.dir(
            parse(codestr),
            { depth: null }
        )
    }
}

const args = parseArgs({
    allowPositionals: true,
    options: {
        target: {
            type: "string",
            default: "console",
        },
        dest: {
            type: "string",
        },
        code: {
            type: "string"
        }
    }
})

const [grammarFile] = args.positionals
const { target, dest, code } = args.values

const grammar = fs.read(grammarFile)

actions[target]()
