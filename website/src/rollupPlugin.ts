import ejs from 'ejs'
import type { PluginOption } from 'vite';

// Yes, I have actually written plugin to compile .ejs files on build XD

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
      console.log(compiled)
      return {
        code: 'export default ' + compiled,
        map: null,
      }
    }

  }
}
