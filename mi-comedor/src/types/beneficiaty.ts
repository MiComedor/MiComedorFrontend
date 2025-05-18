export default interface Beneficiary {
  idBeneficiary: number;
  dniBenefeciary: number;
  fullnameBenefeciary: string;
  ageBeneficiary: number;
  observationsBeneficiary: string;
  users?: {
    idUser: number;
  };
}
