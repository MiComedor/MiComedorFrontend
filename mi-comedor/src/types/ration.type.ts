export default interface Ration {
  idRation?: number;
  date: string; 
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

/* const initialRationValues = {
  date: "",
  nameRationType: "",
  beneficiary: null,
  price: "",
};*/