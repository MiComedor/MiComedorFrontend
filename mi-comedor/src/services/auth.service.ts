import axios from "axios";

const API_URL = "http://localhost:8084/";

// Función para decodificar JWT y extraer payload
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const register = (username: string, name: string, mail: string, password: string, enabled: boolean) => {
  return axios.post(API_URL + "users", { username, name, mail, password, enabled });
};


export const login = (username: string, password: string) => {
  return axios
    .post(API_URL + "authenticate", { username, password })
    .then((response) => {
      const token = response.data.jwttoken;
      if (token) {
        const decoded = parseJwt(token);
        const user = {
          username: decoded.sub || decoded.username, // depende de cómo está en el JWT
          accessToken: token,
        };
        localStorage.setItem("user", JSON.stringify(user));
      }
      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
