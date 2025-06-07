import api from "../axiosInstance";
import { ProductType } from "../types/product.type";

const API_URL = "/producttype";

class ProductTypeService {
  listar = async (): Promise<ProductType[]> => {
    const response = await api.get<ProductType[]>(API_URL);
    return response.data;
  };
}

export default new ProductTypeService();
