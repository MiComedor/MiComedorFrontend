import api from "../axiosInstance";
import TypeOfTask from "../types/TypeTask";

const API_URL = "/typeOfTask";

class TaskTypeService {
  listarTipoDeTarea = async (): Promise<TypeOfTask[]> => {
    const response = await api.get<TypeOfTask[]>(API_URL);
    return response.data;
  };
}

export default new TaskTypeService();
