import ejs from 'ejs'
import type { PluginOption } from 'vite';

// Yes, I have actually written a plugin to compile .ejs files on build

// To be used by the codegen templates
const baseCode = `
function indent(text, depth, skipFirst = false) {
  const test = text.split('\\n').map(line => (line.length ? ' '.repeat(depth) : '') + line);

  if (skipFirst) {
    test[0] = test[0].trimStart();
  }

  return test.join('\\n');
}
`

export default function ejsTemplatePlugin(options : {
  compileDebug: boolean
}): PluginOption {
  return {
    name: 'vite-plugin-ejs-template',

    // Needed for Vite to recognize this as a JS module
    enforce: 'pre',

    async transform(code, id) {
      if (!id.endsWith('.ejs')) return null
      const compiled = ejs.compile(code, {
        client: true, // Generates a reusable client-side function
        // filename: id.slice(0, -'?ejstemplate'.length),
        strict: true,
        localsName: 'data',
        compileDebug: options.compileDebug,
        escape: "(markup => JSON.stringify(markup))",
      }).toString()
      //console.log(compiled)
      return {
        code: baseCode + 'export default ' + compiled,
        map: null,
      }
    }

  }
}
