import { useCallback, useEffect, useState } from 'react';
import { libs, supportedLngs, translatePath } from '../libs.config';

const isCrawler = () => /(bot|crawler|spider|crawling|google|baidu|bing|teoma|slurp|yandex)/.test(navigator.userAgent.toLowerCase());

const allPages = Object.entries(libs).reduce((acc, [page, lib]) => {
    acc[lib.path] = page;
    for (const lang of supportedLngs) acc[translatePath(lang, lib.path)] = page;
    return acc;
}, {} as { [path: string]: string; });

for (const lang of supportedLngs) allPages[`/${lang}`] = '200.home';
allPages[''] = '200.home';


function findPath(page: string): string | null {
    if (page === "200.home") return '/';

    const libInfo = libs[page];
    if (typeof libInfo !== "undefined") return libInfo.path;

    return null;
}

function findPage(path: string): string {
    path = path.replace(/\/$/, ''); // remove trailing slash
    return allPages[path] || '404.not-found';
}

function firstLoadPage(): string {
    const page = findPage(window.location.pathname);
    if (window.location.pathname === "/" && !isCrawler()) {
        const cacheLib = localStorage.getItem("discord.builders__selectedLib");
        const libPath = cacheLib && findPath(cacheLib);
        if (libPath && libPath !== "/") {
            redirect(libPath);
            return cacheLib;
        }
    }

    return page
}

function redirect(path: string) {
    history.replaceState(null, '', `${path}${window.location.search}${window.location.hash}`);
}

export function useRouter(): [string, (page: string) => void] {
    const [pageInternal, setPageInternal] = useState(firstLoadPage);

    useEffect(() => {
        const handlePopState = () =>  setPageInternal(findPage(window.location.pathname));
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);
    const setPage = useCallback((page: string) => {
        setPageInternal(page);
        localStorage.setItem("discord.builders__selectedLib", page || '');

        const targetPath = findPath(page);
        if (targetPath !== null) redirect(targetPath);
    }, []);

    return [pageInternal, setPage]
}
