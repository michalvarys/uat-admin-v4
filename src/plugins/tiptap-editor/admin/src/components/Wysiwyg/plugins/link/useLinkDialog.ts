import { useState, useEffect } from "react";
import { useFetchClient, useNotification } from "@strapi/helper-plugin";
import { MediaFile, Page, NewsEntry, LinkAttributes } from "./types";

interface UseLinkDialogProps {
  isOpen: boolean;
  initialAttributes: Partial<LinkAttributes>;
  onSave: (attributes: LinkAttributes) => void;
  onClose: () => void;
}

const defaultType = "link";
const defaultTarget = "_self";
const defaultLinkCategory = "custom";

export const useLinkDialog = ({
  isOpen,
  initialAttributes,
  onSave,
  onClose,
}: UseLinkDialogProps) => {
  const [, selectedId] = initialAttributes.href?.split(":") || [, ""];
  const [url, setUrl] = useState("");
  const [type, setType] = useState(defaultType);
  const [target, setTarget] = useState(defaultTarget);
  const [linkCategory, setLinkCategory] = useState(defaultLinkCategory);
  const [activeTab, setActiveTab] = useState(0);
  const [mediaLibVisible, setMediaLibVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [newsEntries, setNewsEntries] = useState<NewsEntry[]>([]);
  const [selectedPage, setSelectedPage] = useState(selectedId);
  const [selectedNewsEntry, setSelectedNewsEntry] = useState(selectedId);
  const [isLoading, setIsLoading] = useState(false);
  const toggleNotification = useNotification();
  const { get } = useFetchClient();

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const { data } = await get<{ data: Page[] }>(
        "/api/pages?pagination[pageSize]=1000&populate=*"
      );
      setPages(data.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toggleNotification({
        type: "warning",
        message: "Failed to fetch pages",
      });
      setIsLoading(false);
    }
  };

  const fetchNewsEntries = async () => {
    try {
      setIsLoading(true);
      const { data } = await get<NewsEntry[]>(
        "/api/news?pagination[pageSize]=1000&populate=*"
      );
      setNewsEntries(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching news entries:", error);
      toggleNotification({
        type: "warning",
        message: "Failed to fetch news entries",
      });
      setIsLoading(false);
    }
  };

  const handleMediaLibChange = (files: MediaFile[]) => {
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setUrl(file.url);
    }
    setMediaLibVisible(false);
  };

  const handlePageChange = (value: string) => {
    setSelectedPage(value);

    // We'll store the record ID and type, but not generate the URL yet
    // The URL will be generated at render time
    if (value) {
      // Set a placeholder URL to indicate this is a page link
      setUrl(`pages:${value}`);
    }
  };

  const handleNewsEntryChange = (value: string) => {
    setSelectedNewsEntry(value);

    // We'll store the record ID and type, but not generate the URL yet
    // The URL will be generated at render time
    if (value) {
      // Set a placeholder URL to indicate this is a news entry link
      setUrl(`news:${value}`);
    }
  };

  const handleSave = () => {
    if (url) {
      const attributes: LinkAttributes = {
        href: url,
        type: type,
        linkCategory: linkCategory,
        class: type === "button" ? "custom-link button" : "custom-link",
        target: target,
        rel: "",
        download:
          linkCategory === "download" ? selectedFile?.alt || true : null,
      };

      // Add record type and ID based on the link category
      if (linkCategory === "page" && selectedPage) {
        attributes.recordType = "page";
        attributes.recordId = selectedPage;
      } else if (linkCategory === "news" && selectedNewsEntry) {
        attributes.recordType = "news";
        attributes.recordId = selectedNewsEntry;
      }

      onSave(attributes);
      resetForm();
    }
  };

  const resetForm = () => {
    setUrl("");
    setType(defaultType);
    setTarget(defaultTarget);
    setLinkCategory(defaultLinkCategory);
    setSelectedFile(null);
    setSelectedPage("");
    setSelectedNewsEntry("");
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setLinkCategory(
      index === 0
        ? "custom"
        : index === 1
        ? "page"
        : index === 2
        ? "news"
        : "download"
    );
    setUrl("");
    setSelectedPage("");
    setSelectedNewsEntry("");
    setSelectedFile(null);
  };

  useEffect(() => {
    if (isOpen) {
      setUrl(initialAttributes.href || "");
      setType(initialAttributes.type || defaultType);
      setTarget(initialAttributes.target || defaultTarget);
      setLinkCategory(initialAttributes.linkCategory || defaultLinkCategory);

      // Set active tab based on link category
      if (initialAttributes.linkCategory === "page") {
        setActiveTab(1);
      } else if (initialAttributes.linkCategory === "news") {
        setActiveTab(2);
      } else if (initialAttributes.linkCategory === "download") {
        setActiveTab(3);
      } else {
        setActiveTab(0);
      }

      // Load data based on the link category
      if (initialAttributes.linkCategory === "page") {
        fetchPages();
      } else if (initialAttributes.linkCategory === "news") {
        fetchNewsEntries();
      }
    }
  }, [isOpen, initialAttributes]);

  useEffect(() => {
    if (linkCategory === "page" && pages.length === 0) {
      fetchPages();
    } else if (linkCategory === "news" && newsEntries.length === 0) {
      fetchNewsEntries();
    }
  }, [linkCategory]);

  return {
    url,
    type,
    target,
    linkCategory,
    activeTab,
    mediaLibVisible,
    selectedFile,
    pages,
    newsEntries,
    selectedPage,
    selectedNewsEntry,
    isLoading,
    setUrl,
    setType,
    setTarget,
    setMediaLibVisible,
    handleMediaLibChange,
    handlePageChange,
    handleNewsEntryChange,
    handleSave,
    handleTabChange,
    onClose,
  };
};

export default useLinkDialog;
