import api from "../axiosInstance";
import BeneficiaryByUserId from "../types/BeneficiaryByUserId";
import Beneficiary from "../types/beneficiaty";


const API_URL = "/beneficiary";

class BeneficiaryService {
  insertarBeneficiary = async (
    beneficiary: Partial<Beneficiary>
  ): Promise<Beneficiary> => {
    const response = await api.post<Beneficiary>(API_URL, beneficiary);
    return response.data;
  };
  listarBeneficiarios = async (): Promise<Beneficiary[]> => {
    const response = await api.get<Beneficiary[]>(API_URL);
    return response.data;
  };

  actualizarBeneficiary = async (
    beneficiary: Beneficiary
  ): Promise<Beneficiary> => {
    const response = await api.put<Beneficiary>(
      `${API_URL}/${beneficiary.idBeneficiary}`,
      beneficiary
    );
    return response.data;
  };

  eliminarBeneficiaryActive = async (id: number): Promise<void> => {
    await api.put(`${API_URL}/deleteActive/${id}`);
  };

  buscarBeneficiaryPorUserId = async (
    id: number
  ): Promise<BeneficiaryByUserId[]> => {
    const response = await api.get<BeneficiaryByUserId[]>(
      `${API_URL}/beneficiarioPorUsuario/${id}`
    );
    return response.data;
  };
}

export default new BeneficiaryService();
