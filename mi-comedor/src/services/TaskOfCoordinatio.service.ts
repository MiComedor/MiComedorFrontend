import api from "../axiosInstance";
import TaskCoordination from "../types/taskCoordination";
import TaskCoordinationByUserId from "../types/taskCoordinationByUserId";

const API_URL = "/taskCoordination";

class TaskOfCoordinatioService {
  insertarTarea = async (
    tarea: Partial<TaskCoordination>
  ): Promise<TaskCoordination> => {
    const response = await api.post<TaskCoordination>(API_URL, tarea);
    return response.data;
  };
  listarTarea = async (): Promise<TaskCoordination[]> => {
    const response = await api.get<TaskCoordination[]>(API_URL);
    return response.data;
  };

  actualizarTarea = async (
    racion: TaskCoordination
  ): Promise<TaskCoordination> => {
    const response = await api.put<TaskCoordination>(
      `${API_URL}/${racion.idTaskCoordination}`,
      racion
    );
    return response.data;
  };

  eliminarTarea = async (id: number): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
  };

  buscarTareaPorUserId = async (id: number): Promise<TaskCoordinationByUserId[]> => {
    const response = await api.get<TaskCoordinationByUserId[]>(
      `${API_URL}/taskCoordinationByUser/${id}`
    );
    return response.data;
  };
}

export default new TaskOfCoordinatioService();
