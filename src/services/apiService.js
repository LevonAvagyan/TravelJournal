import axios from "axios";

class ApiService {
  constructor() {
    this.MAIN_URL = "https://68a0546c6e38a02c58186395.mockapi.io/travel";
    this.TRIPS_URL = `${this.MAIN_URL}/trips`;
    this.USERS_URL = `${this.MAIN_URL}/users`;
  }

  // ================== USERS ==================
  validateCredentials(loginInput, password) {
    const loginRegex = /^[A-Za-z0-9]+$/;
    if (!loginRegex.test(loginInput)) {
      return {
        valid: false,
        message: "Логин должен содержать только английские буквы и цифры",
      };
    }
    if (loginInput.length < 4 || loginInput.length > 16) {
      return { valid: false, message: "Логин должен быть от 4 до 16 символов" };
    }
    if (password.length < 6 || password.length > 20) {
      return {
        valid: false,
        message: "Пароль должен быть от 6 до 20 символов",
      };
    }
    return { valid: true };
  }

  async loginUser(loginInput, password) {
    try {
      const res = await axios.get(this.USERS_URL);
      const allUsers = res.data;

      console.log("All users from API:", allUsers);

      const userFound = allUsers.find(
        (user) => user.login === loginInput && user.password === password
      );

      console.log("User found:", userFound);

      return userFound || null;
    } catch (error) {
      console.error("Login API error:", error);
      return null;
    }
  }

  async registerUser(loginInput, password) {
    try {
      const allUsersRes = await axios.get(this.USERS_URL);
      const allUsers = allUsersRes.data;

      const userExists = allUsers.find((user) => user.login === loginInput);
      if (userExists) {
        throw new Error("User with this login already exists");
      }
      const maxUserId =
        allUsers.length > 0
          ? Math.max(...allUsers.map((user) => user.userId || 0))
          : 0;
      const newUserId = maxUserId + 1;

      const newUser = {
        userId: newUserId,
        login: loginInput,
        password: password,
        createdAt: new Date().toISOString(),
      };

      const res = await axios.post(this.USERS_URL, newUser);
      console.log("New user created:", res.data);
      return res.data;
    } catch (error) {
      console.error("Registration API error:", error);
      throw error;
    }
  }

  async getUserByUserId(userId) {
    try {
      const res = await axios.get(this.USERS_URL);
      const allUsers = res.data;
      return (
        allUsers.find((user) => Number(user.userId) === Number(userId)) || null
      );
    } catch (error) {
      console.error("Get user by userId error:", error);
      throw error;
    }
  }

  async getUserByLogin(login) {
    try {
      const res = await axios.get(this.USERS_URL);
      const allUsers = res.data;
      return (
        allUsers.find(
          (user) => user.login.toLowerCase() === login.toLowerCase()
        ) || null
      );
    } catch (error) {
      console.error("Get user by login error:", error);
      throw error;
    }
  }

  // ================== TRIPS ==================
  async fetchTrips(userId) {
    try {
      const res = await axios.get(this.TRIPS_URL);
      const allTrips = res.data;

      if (userId) {
        return allTrips.filter((trip) => trip.userId == userId);
      }

      return allTrips;
    } catch (error) {
      console.error("Fetch trips error:", error);
      return [];
    }
  }

  async addTrip(trip) {
    try {
      const res = await axios.post(this.TRIPS_URL, trip);
      return res.data;
    } catch (error) {
      console.error("Add trip error:", error);
      throw error;
    }
  }

  async deleteTrip(id) {
    try {
      await axios.delete(`${this.TRIPS_URL}/${id}`);
      return id;
    } catch (error) {
      console.error("Delete trip error:", error);
      throw error;
    }
  }

  async updateTrip(id, updatedTrip) {
    try {
      const res = await axios.put(`${this.TRIPS_URL}/${id}`, updatedTrip);
      return res.data;
    } catch (error) {
      console.error("Update trip error:", error);
      throw error;
    }
  }
  async getTripById(id) {
    try {
      const res = await axios.get(`${this.TRIPS_URL}/${id}`);
      return res.data;
    } catch (error) {
      console.error("Get trip by ID error:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
