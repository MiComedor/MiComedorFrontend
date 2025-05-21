import api from "../axiosInstance";
import BugdetByDay from "../types/BudgetByDay";
import BugdetByWeek from "../types/BudgetByWeek";

const API_URL = "/budget";

class BudgetService {
    
  /*-------------------REPORTES----------------------*/
  presupuestoPorDia = async (id: number): Promise<BugdetByDay[]> => {
    const response = await api.get<BugdetByDay[]>(
      `${API_URL}/reportePresupuestoPorDia/${id}`
    );
    return response.data;
  };

  presupuestoPorSemana = async (id: number): Promise<BugdetByWeek[]> => {
    const response = await api.get<BugdetByWeek[]>(
      `${API_URL}/reportePresupuestoPorSemana/${id}`
    );
    return response.data;
  };
}

export default new BudgetService();
