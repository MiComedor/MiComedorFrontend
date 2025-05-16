export default interface Ration {
  idRation?: number;
  date: string; // formato YYYY-MM-DD
  price: number;
  users?: {
    idUser: number;
  };
  rationType?: {
    idRationType: number;
  };
  beneficiary?: {
    idBeneficiary: number;
  };
}
