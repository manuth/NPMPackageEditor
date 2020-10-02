const path = require("path");

module.exports = {
    extends: [
        "plugin:@manuth/typescript/recommended-requiring-type-checking"
    ],
    env: {
        node: true,
        es6: true
    },
    parserOptions: {
        project: [
            path.join(__dirname, "tsconfig.json"),
            path.join(__dirname, "tsconfig.eslint.json"),
            path.join(__dirname, "src", "tests", "tsconfig.json")
        ]
    }
};
