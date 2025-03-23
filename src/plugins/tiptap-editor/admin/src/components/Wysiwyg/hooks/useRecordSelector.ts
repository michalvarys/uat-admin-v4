import { useState, useCallback } from "react";
import usePages from "./usePages";
import useNewsEntries from "./useNewsEntries";

// Constants that can be shared across different dialogs
export const RECORD_TYPES = {
  PAGES: "pages",
  NEWS: "news",
} as const;

export type RecordType = (typeof RECORD_TYPES)[keyof typeof RECORD_TYPES];

interface UseRecordSelectorProps {
  initialRecordType?: RecordType;
  initialRecordId?: string;
}

/**
 * A shared hook for selecting records (pages/news) in dialogs
 */
export const useRecordSelector = ({
  initialRecordType = RECORD_TYPES.PAGES,
  initialRecordId = "",
}: UseRecordSelectorProps = {}) => {
  // State
  const [recordType, setRecordType] = useState<RecordType>(initialRecordType);
  const [recordId, setRecordId] = useState(initialRecordId);

  // Data hooks
  const { pages, isLoading: isPagesLoading } = usePages();
  const { newsEntries, isLoading: isNewsEntriesLoading } = useNewsEntries();

  // Get the selected record data
  const getSelectedRecord = useCallback(() => {
    if (!recordId) return null;

    if (recordType === RECORD_TYPES.PAGES) {
      return pages.find((page) => page.id.toString() === recordId) || null;
    } else if (recordType === RECORD_TYPES.NEWS) {
      return (
        newsEntries.find((entry) => entry.id.toString() === recordId) || null
      );
    }

    return null;
  }, [recordType, recordId, pages, newsEntries]);

  // Get the title of the selected record
  const getRecordTitle = useCallback(() => {
    const record = getSelectedRecord();

    if (!record) return "";

    if (recordType === RECORD_TYPES.PAGES) {
      const page = record as any;
      return (
        page.attributes?.title || page.attributes?.name || `Page ${page.id}`
      );
    } else if (recordType === RECORD_TYPES.NEWS) {
      const entry = record as any;
      return entry.title || `News ${entry.id}`;
    }

    return "";
  }, [getSelectedRecord, recordType]);

  // Generate a URL for the selected record
  const getRecordUrl = useCallback(() => {
    if (!recordId) return "";
    return `${recordType}:${recordId}`;
  }, [recordType, recordId]);

  // Handle record type change
  const handleRecordTypeChange = useCallback((type: RecordType) => {
    setRecordType(type);
    setRecordId(""); // Reset record ID when changing type
  }, []);

  // Handle record selection
  const handleRecordChange = useCallback((value: string) => {
    setRecordId(value);
  }, []);

  // Extract ID from href format "type:id"
  const extractIdFromHref = useCallback(
    (href: string | undefined, prefix: string): string => {
      if (!href) return "";

      const parts = href.split(":");
      if (parts.length === 2 && parts[0] === prefix) {
        return parts[1] || "";
      }

      return "";
    },
    []
  );

  return {
    // State
    recordType,
    recordId,
    pages,
    newsEntries,
    isPagesLoading,
    isNewsEntriesLoading,

    // Getters
    getSelectedRecord,
    getRecordTitle,
    getRecordUrl,

    // Setters
    setRecordType,
    setRecordId,

    // Handlers
    handleRecordTypeChange,
    handleRecordChange,

    // Utilities
    extractIdFromHref,
  };
};

export default useRecordSelector;
