import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiService } from "../services/apiService";
import toast from "react-hot-toast";

export const useUser = create(
  persist(
    (set, get) => ({
      user: null,
      loginVisible: false,
      registerVisible: false,
      loading: false,
      selectedUser: null,

      setLoginVisible: (visible) => set({ loginVisible: visible }),
      setRegisterVisible: (visible) => set({ registerVisible: visible }),

      login: async (username, password) => {
        set({ loading: true });
        try {
          const data = await apiService.loginUser(username, password);
          if (data) {
            const userData = {
              ...data,
              userId: Number(data.userId) || data.userId,
            };
            set({ user: userData, loginVisible: false });
            return userData;
          } else {
            return null;
          }
        } finally {
          set({ loading: false });
        }
      },

      register: async (username, password) => {
        set({ loading: true });
        try {
          const data = await apiService.registerUser(username, password);
          if (data) {
            set({ user: data, registerVisible: false });
            return data;
          } else {
            return null;
          }
        } catch (error) {
          toast.error(error.message || "Registration failed");
          console.error("Registration error:", error);
          return {
            error: true,
            message: error.message || "Registration failed",
          };
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        set({ user: null });
      },

      fetchUserById: async (userId) => {
        try {
          const data = await apiService.getUserByUserId(userId);
          set({ selectedUser: data });
          return data;
        } catch (error) {
          console.error("Fetch user by userId error:", error);
          set({ selectedUser: null });
          return null;
        }
      },
      fetchUserByLogin: async (login) => {
        try {
          const data = await apiService.getUserByLogin(login);
          set({ selectedUser: data });
          return data;
        } catch (error) {
          console.error("Fetch user by login error:", error);
          set({ selectedUser: null });
          return null;
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
