#! /usr/bin/env node

import fs from "fs-jetpack"
import proteus from "./main.js"

const [, , grammarFile] = process.argv

const grammar = fs.read(grammarFile)
console.log(
    proteus.module(grammar)
)
