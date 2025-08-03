interface SearchHistoryState {
    histories: string[];
}

interface SearchHistoryAction {
    createHistory: (keyword: string) => void;
    removeHistory: (keyword: string) => void;
    clearHistory: () => void;
}

export { SearchHistoryState, SearchHistoryAction };
