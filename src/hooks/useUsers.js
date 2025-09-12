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
      allUsers: [],

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
            toast.error("Invalid login or password");
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
          return {
            error: true,
            message: error.message || "Registration failed",
          };
        } finally {
          set({ loading: false });
        }
      },

      logout: () => set({ user: null }),

      fetchUserById: async (userId) => {
        try {
          const data = await apiService.getUserByUserId(userId);
          set({ selectedUser: data });
          return data;
        } catch {
          set({ selectedUser: null });
          return null;
        }
      },

      fetchUserByLogin: async (login) => {
        try {
          const data = await apiService.getUserByLogin(login);
          set({ selectedUser: data });
          return data;
        } catch {
          set({ selectedUser: null });
          return null;
        }
      },

      fetchAllUsers: async () => {
        try {
          const users = await apiService.getAllUsers();
          set({ allUsers: users });
          return users;
        } catch {
          set({ allUsers: [] });
          return [];
        }
      },

      updateUserAvatar: async (avatarUrl) => {
        const { user } = get();
        if (!user) {
          toast.error("Please log in");
          return;
        }
        set({ loading: true });
        try {
          const updatedUser = await apiService.updateUser(user.userId, {
            avatar: avatarUrl,
          });
          set({
            user: updatedUser,
            avatarLastUpdated: Date.now(),
          });
          toast.success("Avatar updated! 📸");
        } catch (err) {
          toast.error("Failed to update avatar");
        } finally {
          set({ loading: false });
        }
      },

      updateUserProfile: async (newLogin, newPassword) => {
        const { user, allUsers } = get();
        if (!user) {
          toast.error("Please log in");
          return false;
        }

        set({ loading: true });

        try {
          // Проверка валидности
          const { valid, message } = apiService.validateCredentials(
            newLogin,
            newPassword
          );
          if (!valid) {
            toast.error(message);
            return false;
          }

          // Проверка уникальности логина
          const loginExists = allUsers.some(
            (u) =>
              u.login.toLowerCase() === newLogin.toLowerCase() &&
              u.userId !== user.userId
          );
          if (loginExists) {
            toast.error("This login is already taken");
            return false;
          }

          // Проверка на изменение
          if (user.login === newLogin) {
            toast.error("New login must be different from the current one");
            return false;
          }
          if (user.password === newPassword) {
            toast.error("New password must be different from the current one");
            return false;
          }

          // Обновление пользователя
          const updatedUser = await apiService.updateUser(user.userId, {
            login: newLogin,
            password: newPassword,
          });
          set({ user: updatedUser });
          toast.success("Profile updated successfully!");
          return true;
        } catch (err) {
          toast.error(
            "Failed to update profile: " + (err.message || "Unknown error")
          );
          return false;
        } finally {
          set({ loading: false });
        }
      },

      searchUsers: (query) => {
        const { allUsers } = get();
        if (!query) return allUsers;
        return allUsers.filter((u) =>
          u.login.toLowerCase().includes(query.toLowerCase())
        );
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
