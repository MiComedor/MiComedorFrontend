
import api from "../axiosInstance";
import { Product, ProductListResponse } from "../types/product";
import ProductsByDay from "../types/ProductsByDay";
import { ProductsByWeek } from "../types/ProductsByWeek";

const API_URL = "/product";

class ProductService {
  insertar = async (product: Product): Promise<void> => {
    await api.post(API_URL, product);
  };

  listarPorUsuario = async (
    usuarioId: number
  ): Promise<ProductListResponse[]> => {
    const response = await api.get<ProductListResponse[]>(
      `${API_URL}/productoPorUsuario/${usuarioId}`
    );
    return response.data;
  };

  eliminar = async (id: number): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
  };

  async actualizar(id: number, data: any) {
  return api.put(`${API_URL}/${id}`, data);
}


  obtenerPorId = async function (id: number): Promise<ProductListResponse> {
    const response = await api.get<ProductListResponse>(`${API_URL}/${id}`);
    return response.data;
  };

  obtenerProductosAvencerDiario = async (
    id: number
  ): Promise<ProductsByDay[]> => {
    const response = await api.get<ProductsByDay[]>(`${API_URL}/reporteProductosAvencerDiario/${id}`);
    return response.data;
  };

  obtenerProductosAvencerSemanal = async (
    id: number
  ): Promise<ProductsByWeek[]> => {
    const response = await api.get<ProductsByWeek[]>(`${API_URL}/reporteProductosAvencerSemanal/${id}`);
    return response.data;
  };
}

export default new ProductService();
