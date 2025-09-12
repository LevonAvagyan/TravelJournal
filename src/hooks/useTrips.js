import { create } from "zustand";
import { apiService } from "../services/apiService";
import toast from "react-hot-toast";

export const useTrips = create((set, get) => ({
  allTrips: [],
  userTrips: [],
  currentTrip: null,
  handleLoading: false,
  tripLoading: false,

  // ================= TRIPS =================
  fetchAllTrips: async () => {
    set({ handleLoading: true });
    try {
      const data = await apiService.fetchTrips();
      set({ allTrips: data });
      if (data.length === 0) console.log("No trips found in database");
    } catch (err) {
      console.error("Ошибка загрузки всех поездок:", err);
      set({ allTrips: [] });
    } finally {
      set({ handleLoading: false });
    }
  },

  fetchUserTrips: async (userId) => {
    if (!userId) return set({ userTrips: [] });
    set({ handleLoading: true });
    try {
      const data = await apiService.fetchTrips(userId);
      set({ userTrips: data });
    } catch (err) {
      console.error("Ошибка загрузки поездок пользователя:", err);
      set({ userTrips: [] });
    } finally {
      set({ handleLoading: false });
    }
  },

  fetchTripById: async (tripId) => {
    if (!tripId) return set({ currentTrip: null });
    set({ tripLoading: true });
    try {
      const trip = await apiService.getTripById(tripId);
      set({ currentTrip: trip });
      return trip;
    } catch (err) {
      toast.error("Failed to load trip");
      set({ currentTrip: null });
      return null;
    } finally {
      set({ tripLoading: false });
    }
  },

  addTrip: async (values, userId) => {
    if (!userId) {
      toast.error("Please login to add a trip");
      return;
    }
    set({ handleLoading: true });
    try {
      const newTrip = await apiService.addTrip({
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        userId,
      });
      set((state) => ({
        allTrips: [...state.allTrips, newTrip],
        userTrips: [...state.userTrips, newTrip],
      }));
      toast.success("Trip added successfully! 🎉");
      return newTrip;
    } catch (err) {
      toast.error("Failed to add trip");
      throw err;
    } finally {
      set({ handleLoading: false });
    }
  },

  editTrip: async (tripId, updatedTrip) => {
    try {
      const newTrip = await apiService.updateTrip(tripId, updatedTrip);
      set((state) => ({
        userTrips: state.userTrips.map((trip) =>
          trip.id === tripId ? newTrip : trip
        ),
      }));
      toast.success("Trip updated ✏️");
    } catch (err) {
      console.error("Ошибка редактирования:", err);
      toast.error("Failed to edit trip");
    }
  },

  deleteTrip: async (id) => {
    set({ handleLoading: true });
    try {
      await apiService.deleteTrip(id);
      set((state) => ({
        allTrips: state.allTrips.filter((t) => t.id !== id),
        userTrips: state.userTrips.filter((t) => t.id !== id),
      }));
      toast.success("Trip deleted");
    } catch (err) {
      toast.error("Failed to delete trip");
      throw err;
    } finally {
      set({ handleLoading: false });
    }
  },

  clearTrips: () => set({ allTrips: [], userTrips: [], currentTrip: null }),
  clearCurrentTrip: () => set({ currentTrip: null }),
}));
