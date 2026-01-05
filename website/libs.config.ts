export const supportedLngs = ['en', 'pl', 'de', 'es', 'ca', 'pt', 'fr'] as const;


export const libs: {
    [name: string]: {
        name: string;
        language: string;
        path: string;
    };
} = {
    dpp: {
        name: 'C++: DPP',
        language: 'cpp',
        path: '/dpp-code-generator',
    },

    hikari: {
        name: 'Python: hikari',
        language: 'python',
        path: '/hikari-python-code-generator',
    },

    discordpy: {
        name: 'Python: discord.py',
        language: 'python',
        path: '/discordpy-python-code-generator',
    },

    pycord: {
        name: 'Python: py-cord',
        language: 'python',
        path: '/pycord-python-code-generator',
    },

    nyxx: {
        name: 'Dart: nyxx',
        language: 'dart',
        path: '/nyxx-dart-code-generator',
    },

    'discordjs-js': {
        name: 'JavaScript: discord.js',
        language: 'javascript',
        path: '/discordjs-javascript-code-generator',
    },

    'discordjs-ts': {
        name: 'TypeScript: discord.js',
        language: 'typescript',
        path: '/discordjs-typescript-code-generator',
    },

    dressed: {
        name: 'TypeScript: dressed',
        language: 'typescript',
        path: '/dressed-typescript-code-generator',
    },

    itsmybot: {
        name: 'YAML: ItsMyBot',
        language: 'yaml',
        path: '/itsmybot-code-generator',
    },

    jda: {
        name: 'Java: JDA',
        language: 'java',
        path: '/jda-java-code-generator',
    },

    discatsharp: {
        name: 'C#: DisCatSharp',
        language: 'csharp',
        path: '/discatsharp-csharp-code-generator'
    },

    'discord-net-component-designer': {
        name: 'C#: Discord.Net Component Designer',
        language: 'csharp',
        path: '/discord-net-component-designer-csharp-code-generator'
    },
};


export function translatePath(lang: typeof supportedLngs[number], path: string) {
    if (path.endsWith('/')) path = path.slice(0, -1); // remove trailing slash

    switch (lang) {
        case 'pl':
            return '/' + lang + path.replace('code-generator', 'generator-kodu');
        default:
            return '/' + lang + path;
    }
}
