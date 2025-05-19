export interface Product {
  idProduct?: number;
  descriptionProduct: string;
  amountProduct: number;
  unitOfMeasurement_id: number;
  productType_id: number;
  user_id: number;
  expirationDate?: string;
}

export interface ProductListResponse {
  idProduct: number;
  descriptionProduct: string;
  amountProduct: number;
  unitOfMeasurementAbbreviation: string;
  productTypeName: string;
  expirationDate: string | null;
  user_id: number;
}