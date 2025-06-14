import api from "../axiosInstance";
import { BudgetDTO } from "../types/budget";
import BugdetByDay from "../types/BudgetByDay";
import { BugdetByWeek } from "../types/BudgetByWeek";
import BugdeCategoty from "../types/budgetCategory";

const API_URL = "/budget";
const CATEGORY_URL = "/budgetCategory";

class BudgetService {
  // ⬇️ ESTE MÉTODO es para insertar un presupuesto
  insertar = async (data: BudgetDTO) => {
    return await api.post(API_URL, data);
  };

  // ⬇️ ESTE MÉTODO es para listar categorías
  listarCategorias = async (): Promise<BugdeCategoty[]> => {
    const res = await api.get<BugdeCategoty[]>(CATEGORY_URL);
    return res.data;
  };

  // ⬇️ ESTE MÉTODO es para listar presupuestos
  listar = async (): Promise<BudgetDTO[]> => {
    const res = await api.get<BudgetDTO[]>("/budget");
    return res.data;
  };

  listarPorUsuario = async (idUser: number): Promise<BudgetDTO[]> => {
  const res = await api.get<BudgetDTO[]>(`/budget/usuario/${idUser}`);
  return res.data;
};

  presupuestoPorDia = async (id: number): Promise<BugdetByDay[]> => {
    const res = await api.get<BugdetByDay[]>(
      `${API_URL}/reportePresupuestoPorDia/${id}`
    );
    return res.data;
  };

  presupuestoPorSemana = async (id: number): Promise<BugdetByWeek[]> => {
    const res = await api.get<BugdetByWeek[]>(
      `${API_URL}/reportePresupuestoPorSemana/${id}`
    );
    return res.data;
  };
}

export default new BudgetService();
