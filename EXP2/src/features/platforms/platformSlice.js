// features/platforms/platformSlice.js
//
// Platforms slice: manages the list of social platforms (Instagram, Twitter, etc.)
// that posts can be associated with. Implements full CRUD using createEntityAdapter,
// matching the normalization approach used in the Posts slice (Experiment 2, section 3).

import { createSlice, createEntityAdapter, nanoid } from "@reduxjs/toolkit";

// createEntityAdapter gives us { ids: [], entities: {} } plus helper reducers
// (addOne, addMany, updateOne, removeOne, etc.) for free.
const platformsAdapter = createEntityAdapter({
  // Keep platforms sorted alphabetically by name for a stable, predictable UI.
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

// Seed data so the dashboard has platforms to select from on first load.
const initialPlatforms = [
  { id: "instagram", name: "Instagram", color: "#E1306C" },
  { id: "twitter", name: "Twitter", color: "#1DA1F2" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2" },
  { id: "facebook", name: "Facebook", color: "#1877F2" },
  { id: "youtube", name: "YouTube", color: "#FF0000" }
];

const initialState = platformsAdapter.getInitialState();

const platformSlice = createSlice({
  name: "platforms",
  initialState: platformsAdapter.setAll(initialState, initialPlatforms),
  reducers: {
    // Create: add a brand new platform with a generated id.
    addPlatform: {
      reducer(state, action) {
        platformsAdapter.addOne(state, action.payload);
      },
      // Prepare callback lets components dispatch addPlatform("Name") without
      // having to generate the id themselves.
      prepare(name, color = "#6C63FF") {
        return { payload: { id: nanoid(), name, color } };
      }
    },
    // Update: change name/color of an existing platform.
    updatePlatform(state, action) {
      const { id, changes } = action.payload;
      platformsAdapter.updateOne(state, { id, changes });
    },
    // Delete: remove a platform entirely.
    deletePlatform(state, action) {
      platformsAdapter.removeOne(state, action.payload);
    }
  }
});

export const { addPlatform, updatePlatform, deletePlatform } = platformSlice.actions;

// Adapter-generated selectors, scoped to the `platforms` slice of the store.
export const platformsSelectors = platformsAdapter.getSelectors(
  (state) => state.platforms
);

export default platformSlice.reducer;
