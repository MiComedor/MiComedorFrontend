import api from "../axiosInstance";
import { Product, ProductListResponse } from "../types/product";

const API_URL = "/product";

class ProductService {
  insertar = async (product: Product): Promise<void> => {
    await api.post(API_URL, product);
  };

  listar = async (): Promise<ProductListResponse[]> => {
    const response = await api.get<ProductListResponse[]>(API_URL);
    return response.data;
  };

  eliminar = async (id: number): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
  };

  actualizar = async (product: Product): Promise<void> => {
    await api.put(API_URL, product);
  };

  obtenerPorId = async (id: number): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>(`${API_URL}/${id}`);
    return response.data;
  };
}

export default new ProductService();
