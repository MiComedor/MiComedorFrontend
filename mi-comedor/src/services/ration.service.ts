import api from "../axiosInstance";
import Ration from "../types/ration.type";
import RationByUserId from "../types/rationByUserId";
const API_URL = "/ration";

class RationService {
  insertarRacion = async (racion: Partial<Ration>): Promise<Ration> => {
    const response = await api.post<Ration>(API_URL, racion);
    return response.data;
  };
  listarRacion = async (): Promise<Ration[]> => {
    const response = await api.get<Ration[]>(API_URL);
    return response.data;
  };

  actualizarRacion = async (racion: Ration): Promise<Ration> => {
    const response = await api.put<Ration>(
      `${API_URL}/${racion.idRation}`,
      racion
    );
    return response.data;
  };

  eliminarRacion = async (id: number): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
  };

  buscarRacionPorUserId = async (id: number): Promise<RationByUserId[]> => {
    const response = await api.get<RationByUserId[]>(
      `${API_URL}/racionPorUsuario/${id}`
    );
    return response.data;
  };
}

export default new RationService();
