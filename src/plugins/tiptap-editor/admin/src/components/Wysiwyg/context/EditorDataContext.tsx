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
            const { data } = await get<Page[]>(
                "/api/pages?pagination[pageSize]=1000&populate=*"
            );
            setPages(data || []);
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
            const { data } = await get<NewsEntry[]>(
                "/api/news?pagination[pageSize]=1000&populate=*"
            );
            setNewsEntries(data);
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
