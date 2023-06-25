export default [
    {
        input: "lib/main.mjs",
        output: {
            format: "module",
            file: "browser/module.mjs",
        }
    },
    {
        input: "lib/main.mjs",
        output: {
            format: "iife",
            file: "browser/standalone.js",
            name: "proteus"
        }
    },
]
