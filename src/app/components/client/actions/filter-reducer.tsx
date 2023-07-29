export const defaultFilter = {
  bitcoinDev: false,
  lightningDev: false,
  old: false,
  new: false,
};

type FilterState = {
  bitcoinDev: boolean;
  lightningDev: boolean;
  old: boolean;
  new: boolean;
};

type FilterAction =
  | { type: "bitcoinDev" }
  | { type: "lightningDev" }
  | { type: "old-new" }
  | { type: "new-old" }
  | { type: "clear" };

export const filterReducer = (state: FilterState, action: FilterAction) => {
  switch (action.type) {
    case "bitcoinDev":
      return { ...state, bitcoinDev: !state.bitcoinDev };
    case "lightningDev":
      return { ...state, lightningDev: !state.lightningDev };
    case "old-new":
      return { ...state, old: !state.old, new: false };
    case "new-old":
      return { ...state, new: !state.new, old: false };
    case "clear":
      return defaultFilter;
    default:
      return defaultFilter;
  }
};
