export const libs: {
    [name: string]: {
        name: string;
        language: string;
        path: string;
    }
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
};
