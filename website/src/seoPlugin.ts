import type { PluginOption } from 'vite';
import { libs, supportedLngs, translatePath } from '../libs.config';
import * as fs from 'node:fs';

const pages = Object.values(libs).map(lib => lib.path).concat(['/']);

export default function seoPlugin(): PluginOption {
    return {
        name: 'vite-plugin-seo',
        apply: 'build',
        enforce: 'post',
        generateBundle(_, bundle) {
            const headers: string[] = [];
            const redirects: string[] = [];
            const urlset: string[] = [];
            for (const page of pages) {
                headers.push(`${page}\n  Link: <https://discord.builders${page}>; rel="canonical"\n`);
                if (page !== '/') redirects.push(`${page} / 200`);

                const altKeys = supportedLngs.map((lang) => {
                    return `<xhtml:link rel="alternate" hreflang="${lang}" href="https://discord.builders${translatePath(lang, page)}" />`;
                }).join('') + `<xhtml:link rel="alternate" hreflang="x-default" href="https://discord.builders${page}" />`;

                urlset.push(
                    `<url><loc>https://discord.builders${page}</loc><changefreq>monthly</changefreq>${altKeys}</url>`
                );

                for (const lang of supportedLngs) {
                    headers.push(`${translatePath(lang, page)}\n  Link: <https://discord.builders${translatePath(lang, page)}>; rel="canonical"\n`);
                    redirects.push(`${translatePath(lang, page)} / 200`);
                    const priority = (page === '/') ? '<priority>1.0</priority>' : '';
                    urlset.push(
                        `<url><loc>https://discord.builders${translatePath(lang, page)}</loc>${priority}<changefreq>monthly</changefreq>${altKeys}</url>`
                    );
                }
            }

            this.emitFile({
                type: 'asset',
                fileName: 'sitemap.xml',
                source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlset.join('')}</urlset>`,
            });

            this.emitFile({
                type: 'asset',
                fileName: 'robots.txt',
                source: `User-agent: *\nAllow: /\nSitemap: https://discord.builders/sitemap.xml\n`,
            });

            this.emitFile({
                type: 'asset',
                fileName: '404.html',
                source: fs.readFileSync("./404.html"),
            });

            this.emitFile({
                type: 'asset',
                fileName: '_redirects',
                source: `${redirects.join('\n')}\n`,
            });

            this.emitFile({
                type: 'asset',
                fileName: '_headers',
                source: `${headers.join('\n')}`,
            });
        },
    };
}
