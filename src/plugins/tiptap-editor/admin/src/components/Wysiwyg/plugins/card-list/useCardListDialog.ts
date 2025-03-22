import { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { CardItem, CardListAttributes, ColumnsConfig } from "./types";
import { MediaFile } from "../../plugins/link/types";
import usePages from "../../hooks/usePages";
import useNewsEntries from "../../hooks/useNewsEntries";

interface UseCardListDialogProps {
  isOpen: boolean;
  initialAttributes: Partial<CardListAttributes>;
  onSave: (attributes: CardListAttributes) => void;
  onClose: () => void;
}

export const breakpoints = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

const defaultColumns: ColumnsConfig = [1, 2, 3, 4, 5];

export const useCardListDialog = ({
  isOpen,
  initialAttributes,
  onSave,
  onClose,
}: UseCardListDialogProps) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [columns, setColumns] = useState<ColumnsConfig>(defaultColumns);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const [mediaLibVisible, setMediaLibVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"pages" | "news">("pages");
  const [selectedRecordId, setSelectedRecordId] = useState<string>("");

  // Use the custom hooks for fetching pages and news entries
  const { pages } = usePages();
  const { newsEntries } = useNewsEntries();

  const handleMediaLibChange = (files: MediaFile[]) => {
    if (files && files.length > 0 && selectedCardIndex !== null) {
      const file = files[0];
      updateCardAtIndex(selectedCardIndex, { image: file });
    }
    setMediaLibVisible(false);
  };

  const handleRecordChange = (value: string) => {
    setSelectedRecordId(value);

    if (selectedCardIndex === null) return;

    if (activeTab === "pages") {
      const selectedPage = pages.find((page) => page.id.toString() === value);
      if (selectedPage) {
        updateCardAtIndex(selectedCardIndex, {
          recordType: "pages",
          href: `pages:${value}`,
          recordId: value,
          title:
            selectedPage.attributes.title ||
            selectedPage.attributes.name ||
            `Page ${selectedPage.id}`,
        });
      }
    } else if (activeTab === "news") {
      const selectedNews = newsEntries.find(
        (entry) => entry.id.toString() === value
      );

      if (selectedNews) {
        updateCardAtIndex(selectedCardIndex, {
          recordType: "news",
          href: `news:${value}`,
          recordId: value,
          title: selectedNews.title || `News ${selectedNews.id}`,
        });
      }
    }
  };

  const handleTabChange = (tab: "pages" | "news") => {
    setActiveTab(tab);
  };

  const handleColumnsChange = (
    breakpoint: keyof typeof breakpoints,
    value: number | null
  ) => {
    setColumns((cols) => {
      const newCols = [...cols];
      newCols[breakpoints[breakpoint]] = value || null;
      return newCols;
    });
  };

  const addCard = () => {
    const newCard: CardItem = {
      id: uuidv4(),
      image: null,
      recordType: activeTab,
      href: "",
      recordId: "",
      title: undefined,
    };

    setCards([...cards, newCard]);
    setSelectedCardIndex(cards.length);

    // Reset the selected record
    setSelectedRecordId("");
  };

  const removeCard = (index: number) => {
    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);

    // If we're removing the selected card, deselect it
    if (selectedCardIndex === index) {
      setSelectedCardIndex(null);
    } else if (selectedCardIndex !== null && selectedCardIndex > index) {
      // If we're removing a card before the selected card, adjust the selected index
      setSelectedCardIndex(selectedCardIndex - 1);
    }
  };

  const selectCard = (index: number) => {
    setSelectedCardIndex(index);

    // Set the active tab and selected record based on the selected card
    const card = cards[index];
    if (card) {
      setActiveTab(card.recordType);
      setSelectedRecordId(card.recordId.toString());
    }
  };

  const updateCardAtIndex = (index: number, updates: Partial<CardItem>) => {
    const newCards = [...cards];
    newCards[index] = {
      ...newCards[index],
      ...updates,
    };
    setCards(newCards);
  };

  // New functions for sorting cards
  const moveCardUp = (index: number) => {
    if (index <= 0) return; // Can't move the first card up

    const newCards = [...cards];
    const temp = newCards[index];
    newCards[index] = newCards[index - 1];
    newCards[index - 1] = temp;
    setCards(newCards);

    // Update selected card index if needed
    if (selectedCardIndex === index) {
      setSelectedCardIndex(index - 1);
    } else if (selectedCardIndex === index - 1) {
      setSelectedCardIndex(index);
    }
  };

  const moveCardDown = (index: number) => {
    if (index >= cards.length - 1) return; // Can't move the last card down

    const newCards = [...cards];
    const temp = newCards[index];
    newCards[index] = newCards[index + 1];
    newCards[index + 1] = temp;
    setCards(newCards);

    // Update selected card index if needed
    if (selectedCardIndex === index) {
      setSelectedCardIndex(index + 1);
    } else if (selectedCardIndex === index + 1) {
      setSelectedCardIndex(index);
    }
  };

  const handleSave = useCallback(() => {
    onSave({ cards, columns });
    onClose();
  }, [cards, columns, onSave, onClose]);

  const ref = useRef<Boolean>(false);

  // Initialize the dialog when it opens
  useEffect(() => {
    if (isOpen && !ref.current) {
      setCards(initialAttributes.cards || []);
      setColumns(initialAttributes.columns || defaultColumns);
      setSelectedCardIndex(null);
      ref.current = true;
    }
  }, [isOpen, initialAttributes]);

  return {
    cards,
    columns,
    selectedCardIndex,
    mediaLibVisible,
    pages,
    newsEntries,
    activeTab,
    selectedRecordId,
    setMediaLibVisible,
    handleMediaLibChange,
    handleRecordChange,
    handleTabChange,
    handleColumnsChange,
    addCard,
    removeCard,
    selectCard,
    moveCardUp,
    moveCardDown,
    handleSave,
    onClose,
  };
};

export default useCardListDialog;
