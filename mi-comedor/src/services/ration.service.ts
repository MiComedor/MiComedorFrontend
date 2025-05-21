import api from "../axiosInstance";
import BeneficiaryByDay from "../types/BeneficiaryByDay";
import BeneficiaryByWeek from "../types/BeneficiaryByWeek";
import Ration from "../types/ration.type";
import { RationByDay } from "../types/RationByDay";
import RationByUserId from "../types/rationByUserId";
import { RationByWeek } from "../types/RationByWeek";
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

  racionesPorDia = async (id: number): Promise<RationByDay> => {
    const response = await api.get<RationByDay>(
      `${API_URL}/racionPorDia/${id}`
    );
    return response.data;
  };

  racionesPorSemana = async (id: number): Promise<RationByWeek[]> => {
    const response = await api.get<RationByWeek[]>(
      `${API_URL}/reporteTotalRacionesBeneficiariosSemana/${id}`
    );
    return response.data;
  };

  BeneficiariosPorDia = async (id: number): Promise<BeneficiaryByDay[]> => {
    const response = await api.get<BeneficiaryByDay[]>(
      `${API_URL}/reporteTotalRacionesBeneficiariosDiario/${id}`
    );
    return response.data;
  };

  BeneficiariosPorSemana = async (id: number): Promise<BeneficiaryByWeek[]> => {
    const response = await api.get<BeneficiaryByWeek[]>(
      `${API_URL}/reporteTotalRacionesBeneficiariosSemana/${id}`
    );
    return response.data;
  };
}

export default new RationService();
