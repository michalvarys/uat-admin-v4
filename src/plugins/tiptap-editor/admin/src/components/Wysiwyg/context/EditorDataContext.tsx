import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useFetchClient } from "@strapi/helper-plugin";
import { Page, NewsEntry } from "../plugins/link/types";

interface EditorDataContextType {
    pages: Page[];
    newsEntries: NewsEntry[];
    isPagesLoading: boolean;
    isNewsEntriesLoading: boolean;
    fetchPages: () => Promise<void>;
    fetchNewsEntries: () => Promise<void>;
}

const EditorDataContext = createContext<EditorDataContextType | undefined>(undefined);

/**
 * Vytáhne seznam záznamů z odpovědi API.
 *
 * Vlastní controllery v tomhle projektu nevracejí standardní obálku
 * `{ data: [...] }`: /api/pages vrací pole přímo a /api/news objekt
 * `{ years, news }`. Editor přitom čekal pole, takže se seznam odkazů
 * nenaplnil a v administraci vyskočilo „Failed to fetch".
 */
function toList<T>(payload: unknown): T[] {
    if (Array.isArray(payload)) {
        return payload as T[];
    }

    if (payload && typeof payload === "object") {
        const source = payload as Record<string, unknown>;
        const list = source.news ?? source.data;

        if (Array.isArray(list)) {
            return list as T[];
        }
    }

    return [];
}

interface EditorDataProviderProps {
    children: ReactNode;
}

/**
 * Seznamy se drží mimo komponentu.
 *
 * Provider se montuje uvnitř každého editoru, takže na stránce s šesti
 * bloky vznikne šest kopií stavu a každá si data stahuje zvlášť.
 * Sdílená paměť zajistí jediný dotaz na celou stránku; slouží jen
 * k vyplnění nabídky odkazů, takže nemusí být čerstvá.
 */
const cache: { pages?: Page[]; news?: NewsEntry[] } = {};
const pending: { pages?: Promise<Page[]>; news?: Promise<NewsEntry[]> } = {};

export const EditorDataProvider: React.FC<EditorDataProviderProps> = ({ children }) => {
    const [pages, setPages] = useState<Page[]>([]);
    const [newsEntries, setNewsEntries] = useState<NewsEntry[]>([]);
    const [isPagesLoading, setIsPagesLoading] = useState(false);
    const [isNewsEntriesLoading, setIsNewsEntriesLoading] = useState(false);
    const { get } = useFetchClient();

    const fetchPages = async () => {
        if (cache.pages) {
            setPages(cache.pages);
            return;
        }

        try {
            setIsPagesLoading(true);

            // Souběžné editory se svezou na jednom dotazu.
            pending.pages ??= get<Page[] | { data?: Page[] }>(
                "/api/pages?pagination[pageSize]=1000&fields[0]=title&fields[1]=slug&fields[2]=locale"
            ).then(({ data }) => toList<Page>(data));

            const list = await pending.pages;
            cache.pages = list;
            setPages(list);
        } catch (error) {
            // Nabídka odkazů se nenaplní, ale psát ani upravovat obsah
            // to nebrání — vyskakovací varování by editora jen rušilo,
            // navíc pro každý blok zvlášť. Chyba zůstává v konzoli.
            pending.pages = undefined;
            console.error("Nepodařilo se načíst stránky pro nabídku odkazů:", error);
        } finally {
            setIsPagesLoading(false);
        }
    };

    const fetchNewsEntries = async () => {
        if (cache.news) {
            setNewsEntries(cache.news);
            return;
        }

        try {
            setIsNewsEntriesLoading(true);

            pending.news ??= get<
                NewsEntry[] | { news?: NewsEntry[]; data?: NewsEntry[] }
            >("/api/news?pagination[pageSize]=1000&fields[0]=title&fields[1]=slug&fields[2]=locale")
                .then(({ data }) => toList<NewsEntry>(data));

            const list = await pending.news;
            cache.news = list;
            setNewsEntries(list);
        } catch (error) {
            pending.news = undefined;
            console.error("Nepodařilo se načíst novinky pro nabídku odkazů:", error);
        } finally {
            setIsNewsEntriesLoading(false);
        }
    };

    // Fetch data on initial load
    useEffect(() => {
        fetchPages();
        fetchNewsEntries();
    }, []);

    const value = {
        pages,
        newsEntries,
        isPagesLoading,
        isNewsEntriesLoading,
        fetchPages,
        fetchNewsEntries,
    };

    return (
        <EditorDataContext.Provider value={value}>
            {children}
        </EditorDataContext.Provider>
    );
};

export const useEditorData = (): EditorDataContextType => {
    const context = useContext(EditorDataContext);
    if (context === undefined) {
        throw new Error("useEditorData must be used within an EditorDataProvider");
    }
    return context;
};
