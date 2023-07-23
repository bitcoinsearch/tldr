export const defaultFilter = {
  bitcoinDev: false,
  lightningDev: false,
};

type FilterState = {
  bitcoinDev: boolean;
  lightningDev: boolean;
};

type FilterAction =
  | { type: "bitcoinDev" }
  | { type: "lightningDev" }
  | { type: "clear" };

export const filterReducer = (state: FilterState, action: FilterAction) => {
  switch (action.type) {
    case "bitcoinDev":
      return { ...state, bitcoinDev: !state.bitcoinDev };
    case "lightningDev":
      return { ...state, lightningDev: !state.lightningDev };
    case "clear":
      return defaultFilter;
    default:
      return defaultFilter;
  }
};
