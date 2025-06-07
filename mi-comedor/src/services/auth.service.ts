import axios from "axios";

const API_URL = "http://localhost:8084/";

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const register = (
  username: string,
  name: string,
  mail: string,
  password: string,
  enabled: boolean
) => {
  return axios.post(API_URL + "users", {
    username,
    name,
    mail,
    password,
    enabled,
  });
};

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(API_URL + "authenticate", {
      username,
      password,
    });
    const token = response.data.jwttoken;

    if (token) {
      const decoded = parseJwt(token);
      const usernameFromToken = decoded.sub || decoded.username;

      const usersResponse = await axios.get(API_URL + "users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersArray = usersResponse.data;

      const userData = usersArray.find(
        (u: { username: string }) => u.username === usernameFromToken
      );

      if (!userData) {
        throw new Error("Usuario no encontrado.");
      }
      const user = {
        ...userData,
        accessToken: token,
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    }

    return response.data;
  } catch (error) {
    console.error("Error al hacer login:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
