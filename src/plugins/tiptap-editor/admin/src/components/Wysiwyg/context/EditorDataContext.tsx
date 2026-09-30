import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useFetchClient, useNotification } from "@strapi/helper-plugin";
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

export const EditorDataProvider: React.FC<EditorDataProviderProps> = ({ children }) => {
    const [pages, setPages] = useState<Page[]>([]);
    const [newsEntries, setNewsEntries] = useState<NewsEntry[]>([]);
    const [isPagesLoading, setIsPagesLoading] = useState(false);
    const [isNewsEntriesLoading, setIsNewsEntriesLoading] = useState(false);
    const toggleNotification = useNotification();
    const { get } = useFetchClient();

    const fetchPages = async () => {
        // Only fetch if we don't already have pages
        if (pages.length > 0 && !isPagesLoading) return;

        try {
            setIsPagesLoading(true);
            const { data } = await get<Page[] | { data?: Page[] }>(
                "/api/pages?pagination[pageSize]=1000&fields[0]=title&fields[1]=slug&fields[2]=locale"
            );
            setPages(toList<Page>(data));
            setIsPagesLoading(false);
        } catch (error) {
            console.error("Error fetching pages:", error);
            toggleNotification({
                type: "warning",
                message: "Failed to fetch pages",
            });
            setIsPagesLoading(false);
        }
    };

    const fetchNewsEntries = async () => {
        // Only fetch if we don't already have news entries
        if (newsEntries.length > 0 && !isNewsEntriesLoading) return;

        try {
            setIsNewsEntriesLoading(true);
            const { data } = await get<
                NewsEntry[] | { news?: NewsEntry[]; data?: NewsEntry[] }
            >("/api/news?pagination[pageSize]=1000&fields[0]=title&fields[1]=slug&fields[2]=locale");
            setNewsEntries(toList<NewsEntry>(data));
            setIsNewsEntriesLoading(false);
        } catch (error) {
            console.error("Error fetching news entries:", error);
            toggleNotification({
                type: "warning",
                message: "Failed to fetch news entries",
            });
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
