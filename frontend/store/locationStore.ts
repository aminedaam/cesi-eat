import { create } from "zustand";
import { produce } from "immer";
import { Position } from "../types/Position";

interface LocationState {
  location: Position | null;
  updateLocation: (newLocation: Position) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  updateLocation: (newLocation: Position) =>
    set(
      produce((state: LocationState) => {
        state.location = newLocation;
      })
    ),
}));
