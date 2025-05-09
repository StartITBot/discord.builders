
export const libs = {
    dpp:{
        name: "C++: DPP",
        language: "cpp"
    },

    hikari:{
        name: "Python: hikari",
        language: 'python'
    },

    nyxx: {
        name: "Dart: nyxx",
        language: "dart"
    },

    "discordjs-js": {
        name: "JavaScript: discord.js",
        language: "javascript"
    },

    "discordjs-ts": {
        name: "TypeScript: discord.js",
        language: "typescript"
    },

    itsmybot: {
        name: "YAML: ItsMyBot",
        language: "yaml"
    }
} as {
    [name: string] : {
        name: string,
        language: string
    }
}
