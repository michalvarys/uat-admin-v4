import { useState, useEffect, useCallback } from "react";
import { MediaFile, LinkAttributes } from "./types";
import usePages from "../../hooks/usePages";
import useNewsEntries from "../../hooks/useNewsEntries";

interface UseLinkDialogProps {
  isOpen: boolean;
  initialAttributes: Partial<LinkAttributes>;
  onSave: (attributes: LinkAttributes) => void;
  onClose: () => void;
}

// Constants
export const LINK_TYPES = {
  CUSTOM: "custom",
  PAGES: "pages",
  NEWS: "news",
  DOWNLOAD: "download",
};

type LinkType = (typeof LINK_TYPES)[keyof typeof LINK_TYPES];

const TAB_INDICES = {
  CUSTOM: 0,
  PAGES: 1,
  NEWS: 2,
  DOWNLOAD: 3,
};

const TAB_LINKS = [
  LINK_TYPES.CUSTOM,
  LINK_TYPES.PAGES,
  LINK_TYPES.NEWS,
  LINK_TYPES.DOWNLOAD,
];

type TabIndex = (typeof TAB_INDICES)[keyof typeof TAB_INDICES];

const defaultType = "link";
const defaultTarget = "_self";
const defaultLinkCategory = LINK_TYPES.CUSTOM;

export const useLinkDialog = ({
  isOpen,
  initialAttributes,
  onSave,
  onClose,
}: UseLinkDialogProps) => {
  // State
  const [url, setUrl] = useState("");
  const [type, setType] = useState(defaultType);
  const [target, setTarget] = useState(defaultTarget);
  const [linkCategory, setLinkCategory] =
    useState<LinkType>(defaultLinkCategory);
  const [activeTab, setActiveTab] = useState<TabIndex>(TAB_INDICES.CUSTOM);
  const [mediaLibVisible, setMediaLibVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [recordId, setRecordId] = useState("");

  // Data hooks
  const { pages } = usePages();
  const { newsEntries } = useNewsEntries();

  // Reset form to default values
  const resetForm = useCallback(() => {
    setUrl("");
    setType(defaultType);
    setTarget(defaultTarget);
    setLinkCategory(defaultLinkCategory);
    setSelectedFile(null);
    setRecordId("");
  }, []);

  // Event handlers - memoized with useCallback for better performance
  const handleMediaLibChange = useCallback((files: MediaFile[]) => {
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setUrl(file.url);
    }
    setMediaLibVisible(false);
  }, []);

  const handleRecordChange = useCallback(
    (value: string, category: LinkType) => {
      setRecordId(value);
      if (value) {
        setUrl(`${category}:${value}`);
      }
    },
    []
  );

  // Convenience handlers for specific record types
  const handlePageChange = useCallback(
    (value: string) => {
      handleRecordChange(value, LINK_TYPES.PAGES);
    },
    [handleRecordChange]
  );

  const handleNewsEntryChange = useCallback(
    (value: string) => {
      handleRecordChange(value, LINK_TYPES.NEWS);
    },
    [handleRecordChange]
  );

  // Map tab index to link category
  const getCategoryFromTabIndex = useCallback((index: number): LinkType => {
    switch (index) {
      case TAB_INDICES.PAGES:
        return LINK_TYPES.PAGES;
      case TAB_INDICES.NEWS:
        return LINK_TYPES.NEWS;
      case TAB_INDICES.DOWNLOAD:
        return LINK_TYPES.DOWNLOAD;
      case TAB_INDICES.CUSTOM:
      default:
        return LINK_TYPES.CUSTOM;
    }
  }, []);

  const handleTabChange = useCallback(
    (index: number) => {
      setActiveTab(index as TabIndex);
      const category = getCategoryFromTabIndex(index);
      setLinkCategory(category);

      // If DOWNLOAD is selected, automatically set type to "button" and target to "_blank"
      if (category === LINK_TYPES.DOWNLOAD) {
        setType("button");
        setTarget("_blank");
      }

      // Reset selection state when changing tabs
      setUrl("");
      setRecordId("");
      setSelectedFile(null);
    },
    [getCategoryFromTabIndex]
  );

  const handleSave = useCallback(() => {
    if (!url) return;

    const attributes: LinkAttributes = {
      href: url,
      type,
      linkCategory,
      class: type === "button" ? "custom-link button" : "custom-link",
      target,
      rel: "",
      download:
        linkCategory === LINK_TYPES.DOWNLOAD ? selectedFile?.alt || true : null,
    };

    // Add record type and ID based on the link category
    if (
      (linkCategory === LINK_TYPES.PAGES || linkCategory === LINK_TYPES.NEWS) &&
      recordId
    ) {
      attributes.recordType = linkCategory;
      attributes.recordId = recordId;
    }

    onSave(attributes);
    resetForm();
  }, [
    url,
    type,
    linkCategory,
    target,
    selectedFile,
    recordId,
    onSave,
    resetForm,
  ]);

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

  // Initialize form when dialog opens
  useEffect(() => {
    if (!isOpen) return;

    // Set basic attributes
    setUrl(initialAttributes.href || "");
    setType(initialAttributes.type || defaultType);
    setTarget(initialAttributes.target || defaultTarget);

    const category = initialAttributes.linkCategory || defaultLinkCategory;
    setLinkCategory(category as LinkType);

    // Set active tab and selected record based on link category
    switch (category) {
      case LINK_TYPES.PAGES:
        setActiveTab(TAB_INDICES.PAGES as TabIndex);

        // Set selected record from recordId or extract from href
        if (initialAttributes.recordId) {
          setRecordId(initialAttributes.recordId.toString());
        } else {
          setRecordId(
            extractIdFromHref(initialAttributes.href, LINK_TYPES.PAGES)
          );
        }
        break;

      case LINK_TYPES.NEWS:
        setActiveTab(TAB_INDICES.NEWS as TabIndex);

        // Set selected record from recordId or extract from href
        if (initialAttributes.recordId) {
          setRecordId(initialAttributes.recordId.toString());
        } else {
          setRecordId(
            extractIdFromHref(initialAttributes.href, LINK_TYPES.NEWS)
          );
        }
        break;

      case LINK_TYPES.DOWNLOAD:
        setActiveTab(TAB_INDICES.DOWNLOAD as TabIndex);
        // For download links, automatically set type to "button" and target to "_blank"
        setType("button");
        setTarget("_blank");
        break;

      case LINK_TYPES.CUSTOM:
      default:
        setActiveTab(TAB_INDICES.CUSTOM as TabIndex);
        break;
    }
  }, [isOpen, initialAttributes, extractIdFromHref]);

  return {
    // State
    url,
    type,
    target,
    linkCategory,
    activeTab,
    mediaLibVisible,
    selectedFile,
    pages,
    newsEntries,
    recordId,
    linkType: TAB_LINKS[activeTab],

    // Setters
    setUrl,
    setType,
    setTarget,
    setMediaLibVisible,
    setRecordId,

    // Event handlers
    handleMediaLibChange,
    handlePageChange,
    handleNewsEntryChange,
    handleSave,
    handleTabChange,
    onClose,
  };
};

export default useLinkDialog;
