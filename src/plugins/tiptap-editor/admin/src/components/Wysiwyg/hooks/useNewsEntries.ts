import { useEditorData } from "../context/EditorDataContext";

export const useNewsEntries = () => {
  const { newsEntries, isNewsEntriesLoading, fetchNewsEntries } =
    useEditorData();

  return {
    newsEntries,
    isLoading: isNewsEntriesLoading,
    fetchNewsEntries,
  };
};

export default useNewsEntries;
