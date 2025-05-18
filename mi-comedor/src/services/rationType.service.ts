import api from "../axiosInstance";
import RationType from "../types/TypeRation";

const API_URL = "/rationType";

class RationTypeService {
  listarRacion = async (): Promise<RationType[]> => {
    const response = await api.get<RationType[]>(API_URL);
    return response.data;
  };
}

export default new RationTypeService();
