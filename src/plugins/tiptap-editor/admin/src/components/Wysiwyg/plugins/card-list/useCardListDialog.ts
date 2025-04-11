import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { CardItem, CardListAttributes, ColumnsConfig } from "./types";
import { MediaFile } from "../link/types";
import useDialog from "../../hooks/useDialog";
import useRecordSelector, {
  RECORD_TYPES,
  RecordType,
} from "../../hooks/useRecordSelector";
import useMediaLibrary from "../../hooks/useMediaLibrary";

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
  // Use shared dialog hook
  const dialog = useDialog({
    isOpen,
    onClose,
    onSave,
    initialData: initialAttributes,
  });

  // State
  const [cards, setCards] = useState<CardItem[]>(initialAttributes.cards || []);
  const [columns, setColumns] = useState<ColumnsConfig>(
    initialAttributes.columns || defaultColumns
  );
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );

  // Use shared record selector hook
  const recordSelector = useRecordSelector({
    initialRecordType: RECORD_TYPES.PAGES,
    initialRecordId: "",
  });

  // Use shared media library hook with a callback to update the selected card
  const mediaLibrary = useMediaLibrary({
    onFileSelect: (file: MediaFile) => {
      if (selectedCardIndex !== null) {
        updateCardAtIndex(selectedCardIndex, { image: file });
      }
    },
  });

  // Handle columns configuration
  const handleColumnsChange = useCallback(
    (breakpoint: keyof typeof breakpoints, value: number | null) => {
      setColumns((cols) => {
        const newCols = [...cols];
        newCols[breakpoints[breakpoint]] = value || null;
        return newCols;
      });
    },
    []
  );

  // Card management functions
  const addCard = useCallback(() => {
    const newCard: CardItem = {
      id: uuidv4(),
      image: null,
      recordType: recordSelector.recordType,
      href: "",
      recordId: "",
      title: undefined,
    };

    setCards((prevCards) => [...prevCards, newCard]);
    setSelectedCardIndex(cards.length);

    // Reset the selected record
    recordSelector.setRecordId("");
  }, [cards.length, recordSelector]);

  const removeCard = useCallback(
    (index: number) => {
      setCards((prevCards) => {
        const newCards = [...prevCards];
        newCards.splice(index, 1);
        return newCards;
      });

      // If we're removing the selected card, deselect it
      if (selectedCardIndex === index) {
        setSelectedCardIndex(null);
      } else if (selectedCardIndex !== null && selectedCardIndex > index) {
        // If we're removing a card before the selected card, adjust the selected index
        setSelectedCardIndex(selectedCardIndex - 1);
      }
    },
    [selectedCardIndex]
  );

  const selectCard = useCallback(
    (index: number) => {
      setSelectedCardIndex(index);

      // Set the record type and ID based on the selected card
      const card = cards[index];
      if (card) {
        recordSelector.setRecordType(card.recordType as RecordType);
        recordSelector.setRecordId(card.recordId.toString());
      }
    },
    [cards, recordSelector]
  );

  const updateCardAtIndex = useCallback(
    (index: number, updates: Partial<CardItem>) => {
      setCards((prevCards) => {
        const newCards = [...prevCards];
        newCards[index] = {
          ...newCards[index],
          ...updates,
        };
        return newCards;
      });
    },
    []
  );

  // Card reordering functions
  const moveCardUp = useCallback(
    (index: number) => {
      if (index <= 0) return; // Can't move the first card up

      setCards((prevCards) => {
        const newCards = [...prevCards];
        const temp = newCards[index];
        newCards[index] = newCards[index - 1];
        newCards[index - 1] = temp;
        return newCards;
      });

      // Update selected card index if needed
      if (selectedCardIndex === index) {
        setSelectedCardIndex(index - 1);
      } else if (selectedCardIndex === index - 1) {
        setSelectedCardIndex(index);
      }
    },
    [selectedCardIndex]
  );

  const moveCardDown = useCallback(
    (index: number) => {
      if (index >= cards.length - 1) return; // Can't move the last card down

      setCards((prevCards) => {
        const newCards = [...prevCards];
        const temp = newCards[index];
        newCards[index] = newCards[index + 1];
        newCards[index + 1] = temp;
        return newCards;
      });

      // Update selected card index if needed
      if (selectedCardIndex === index) {
        setSelectedCardIndex(index + 1);
      } else if (selectedCardIndex === index + 1) {
        setSelectedCardIndex(index);
      }
    },
    [cards.length, selectedCardIndex]
  );

  // Custom record change handler for card list
  const handleRecordChange = useCallback(
    (value: string) => {
      recordSelector.handleRecordChange(value);

      if (selectedCardIndex === null) return;

      const recordType = recordSelector.recordType;
      const selectedRecord =
        recordType === RECORD_TYPES.PAGES
          ? recordSelector.pages.find((page) => page.id.toString() === value)
          : recordSelector.newsEntries.find(
              (entry) => entry.id.toString() === value
            );

      if (selectedRecord) {
        const title =
          recordType === RECORD_TYPES.PAGES
            ? (selectedRecord as any)?.title ||
              (selectedRecord as any)?.name ||
              `Page ${(selectedRecord as any).id}`
            : (selectedRecord as any).title ||
              `News ${(selectedRecord as any).id}`;

        updateCardAtIndex(selectedCardIndex, {
          recordType,
          recordId: value,
          href: `${recordType}:${value}`,
          title,
        });
      }
    },
    [recordSelector, selectedCardIndex, updateCardAtIndex]
  );

  // Handle tab change (record type change)
  const handleTabChange = useCallback(
    (index: number) => {
      // Convert to number to ensure it's a proper index
      const tabIndex = Number(index);
      const newRecordType =
        tabIndex === 0 ? RECORD_TYPES.PAGES : RECORD_TYPES.NEWS;
      recordSelector.handleRecordTypeChange(newRecordType);
    },
    [recordSelector]
  );

  // Save handler
  const handleSave = useCallback(() => {
    dialog.handleSave({ cards, columns });
  }, [cards, columns, dialog]);

  return {
    // State
    activeTab: recordSelector.recordType === RECORD_TYPES.PAGES ? 0 : 1,
    cards,
    columns,
    selectedCardIndex,
    recordSelector,

    // From media library
    mediaLibrary,

    // Card list specific handlers
    handleRecordChange,
    handleTabChange,
    handleColumnsChange,
    addCard,
    removeCard,
    selectCard,
    moveCardUp,
    moveCardDown,

    // Dialog handlers
    handleSave,
    onClose: dialog.onClose,
  };
};

export default useCardListDialog;
