import { create } from "zustand";
import { apiService } from "../services/apiService";
import toast from "react-hot-toast";

export const useTrips = create((set, get) => ({
  allTrips: [],
  userTrips: [],
  currentTrip: null,
  handleLoading: false,
  tripLoading: false, 

  fetchAllTrips: async () => {
    set({ handleLoading: true });
    try {
      const data = await apiService.fetchTrips();
      set({ allTrips: data });

      if (data.length === 0) {
        console.log("No trips found in database");
      }
    } catch (err) {
      console.error("Ошибка загрузки всех поездок:", err);
      set({ allTrips: [] });
    } finally {
      set({ handleLoading: false });
    }
  },

  fetchTripById: async (tripId) => {
    if (!tripId) {
      set({ currentTrip: null });
      return null;
    }

    set({ tripLoading: true });
    try {
      const trip = await apiService.getTripById(tripId);
      set({ currentTrip: trip });
      return trip;
    } catch (err) {
      console.error("Ошибка загрузки поездки:", err);
      toast.error("Failed to load trip");
      set({ currentTrip: null });
      return null;
    } finally {
      set({ tripLoading: false });
    }
  },

  
  clearCurrentTrip: () => set({ currentTrip: null }),

  fetchUserTrips: async (userId) => {
    if (!userId) {
      set({ userTrips: [] });
      return;
    }

    set({ handleLoading: true });
    try {
      const data = await apiService.fetchTrips(userId);
      set({ userTrips: data });

      if (data.length === 0) {
        console.log("No trips found for user:", userId);
        toast("No trips yet. Add your first trip! ✈️", {
          icon: "📝",
          duration: 3000,
        });
      }
    } catch (err) {
      console.error("Ошибка загрузки поездок пользователя:", err);
      set({ userTrips: [] });
    } finally {
      set({ handleLoading: false });
    }
  },

  handleSubmit: async (values, userId, form, onClose) => {
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

      toast.success(`Trip added successfully! 🎉`);
      if (form) form.resetFields();
      if (onClose) onClose();
    } catch (err) {
      console.error("Ошибка при добавлении поездки:", err);
      toast.error(`Failed to add trip`);
    } finally {
      set({ handleLoading: false });
    }
  },
  

  clearTrips: () => set({ allTrips: [], userTrips: [], currentTrip: null }),
}));
