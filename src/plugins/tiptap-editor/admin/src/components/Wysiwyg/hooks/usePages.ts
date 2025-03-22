import { useEditorData } from "../context/EditorDataContext";

export const usePages = () => {
  const { pages, isPagesLoading, fetchPages } = useEditorData();

  return {
    pages,
    isLoading: isPagesLoading,
    fetchPages,
  };
};

export default usePages;
