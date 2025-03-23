import { useState, useEffect, useCallback } from "react";
import { LinkAttributes } from "./types";
import useDialog from "../../hooks/useDialog";
import useRecordSelector, {
  RECORD_TYPES,
  RecordType,
} from "../../hooks/useRecordSelector";
import useMediaLibrary from "../../hooks/useMediaLibrary";

interface UseLinkDialogProps {
  isOpen: boolean;
  initialAttributes: Partial<LinkAttributes>;
  onSave: (attributes: LinkAttributes) => void;
  onClose: () => void;
}

// Constants
export const LINK_TYPES = {
  CUSTOM: "custom",
  PAGES: RECORD_TYPES.PAGES,
  NEWS: RECORD_TYPES.NEWS,
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
  // Use shared dialog hook
  const dialog = useDialog({
    isOpen,
    onClose,
    onSave,
    initialData: initialAttributes,
  });

  // State
  const [url, setUrl] = useState("");
  const [type, setType] = useState(defaultType);
  const [target, setTarget] = useState(defaultTarget);
  const [linkCategory, setLinkCategory] =
    useState<LinkType>(defaultLinkCategory);
  const [activeTab, setActiveTab] = useState<TabIndex>(TAB_INDICES.CUSTOM);

  // Use shared record selector hook
  const recordSelector = useRecordSelector();

  // Use shared media library hook
  const mediaLibrary = useMediaLibrary({
    onFileSelect: (file) => {
      setUrl(file.url);
    },
  });

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

  // Handle tab change - this function is called by the TabGroup component
  // The index parameter is the tab index (0-based)
  const handleTabChange = useCallback(
    (index: number) => {
      // Convert to TabIndex type for our internal state
      const tabIndex = Number(index) as TabIndex;
      setActiveTab(tabIndex);

      // Get the corresponding link category
      const category = getCategoryFromTabIndex(tabIndex);
      setLinkCategory(category);

      // If DOWNLOAD is selected, automatically set type to "button" and target to "_blank"
      if (category === LINK_TYPES.DOWNLOAD) {
        setType("button");
        setTarget("_blank");
      }

      // Reset selection state when changing tabs
      setUrl("");
      recordSelector.setRecordId("");
      mediaLibrary.setSelectedFile(null);

      // Update record selector type if changing to a record-based tab
      if (category === LINK_TYPES.PAGES) {
        recordSelector.setRecordType(RECORD_TYPES.PAGES);
      } else if (category === LINK_TYPES.NEWS) {
        recordSelector.setRecordType(RECORD_TYPES.NEWS);
      }
    },
    [
      getCategoryFromTabIndex,
      recordSelector,
      mediaLibrary,
      setType,
      setTarget,
      setUrl,
    ]
  );

  // Custom URL setter that handles record selection
  const handleUrlChange = useCallback((newUrl: string) => {
    setUrl(newUrl);
  }, []);

  // Handle record selection
  const handleRecordChange = useCallback(
    (value: string) => {
      recordSelector.handleRecordChange(value);
      if (value) {
        setUrl(`${recordSelector.recordType}:${value}`);
      }
    },
    [recordSelector]
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
        linkCategory === LINK_TYPES.DOWNLOAD
          ? mediaLibrary.selectedFile?.alt || true
          : null,
    };

    // Add record type and ID based on the link category
    if (
      (linkCategory === LINK_TYPES.PAGES || linkCategory === LINK_TYPES.NEWS) &&
      recordSelector.recordId
    ) {
      attributes.recordType = linkCategory;
      attributes.recordId = recordSelector.recordId;
    }

    dialog.handleSave(attributes);

    // Reset form
    setUrl("");
    setType(defaultType);
    setTarget(defaultTarget);
    setLinkCategory(defaultLinkCategory);
    mediaLibrary.setSelectedFile(null);
    recordSelector.setRecordId("");
  }, [
    url,
    type,
    linkCategory,
    target,
    recordSelector,
    mediaLibrary.selectedFile,
    dialog,
  ]);

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
        recordSelector.setRecordType(RECORD_TYPES.PAGES);

        // Set selected record from recordId or extract from href
        if (initialAttributes.recordId) {
          recordSelector.setRecordId(initialAttributes.recordId.toString());
        } else {
          recordSelector.setRecordId(
            recordSelector.extractIdFromHref(
              initialAttributes.href,
              LINK_TYPES.PAGES
            )
          );
        }
        break;

      case LINK_TYPES.NEWS:
        setActiveTab(TAB_INDICES.NEWS as TabIndex);
        recordSelector.setRecordType(RECORD_TYPES.NEWS);

        // Set selected record from recordId or extract from href
        if (initialAttributes.recordId) {
          recordSelector.setRecordId(initialAttributes.recordId.toString());
        } else {
          recordSelector.setRecordId(
            recordSelector.extractIdFromHref(
              initialAttributes.href,
              LINK_TYPES.NEWS
            )
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
  }, [isOpen, initialAttributes]);

  return {
    // State
    url,
    type,
    target,
    linkCategory,
    activeTab,
    linkType: TAB_LINKS[activeTab],

    // From record selector
    recordSelector,

    // From media library
    mediaLibrary,

    // Setters
    setUrl: handleUrlChange,
    setType,
    setTarget,

    // Event handlers
    handlePageChange: handleRecordChange,
    handleNewsEntryChange: handleRecordChange,
    handleSave,
    handleTabChange,
    onClose: dialog.onClose,
  };
};

export default useLinkDialog;
