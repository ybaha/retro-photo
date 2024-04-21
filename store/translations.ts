import { create } from "zustand";

type Translation = {
  [key: string]: object;
};

type State = {
  translations: Translation;
  setTranslations: (translations: Translation) => void;
};

export const useTranslations = create<State>((set) => ({
  translations: {},
  setTranslations: (translations) => set({ translations }),
}));
