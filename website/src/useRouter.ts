import { useCallback, useEffect, useState } from 'react';
import { libs } from '../libs.config';


function findPath(page: string): string | null {
    if (page === "200.home") return '/';

    const libInfo = libs[page];
    if (typeof libInfo !== "undefined") return libInfo.path;

    return null;
}

function findPage(path: string): string {
    path = path.replace(/\/$/, ''); // remove trailing slash

    if (path === '') return '200.home';

    const selectedLib = Object.keys(libs).find(key => path === libs[key].path);
    if (selectedLib) return selectedLib;

    return '404.not-found'
}

function firstLoadPage(): string {
    const page = findPage(window.location.pathname);
    if (page === "200.home") {
        const cacheLib = localStorage.getItem("discord.builders__selectedLib");
        const libPath = cacheLib && findPath(cacheLib);
        if (libPath) {
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
