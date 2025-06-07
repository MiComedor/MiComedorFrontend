
import api from "../axiosInstance";
import { unitOfMeasurement } from "../types/unitOfMeasurement";

const API_URL = "/unitOfMeasurementController";

class unitOfMeasurementService {
  listar = async (): Promise<unitOfMeasurement[]> => {
    const response = await api.get<unitOfMeasurement[]>(API_URL);
    return response.data;
  };
}

export default new unitOfMeasurementService();
