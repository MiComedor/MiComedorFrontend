export default interface Beneficiary {
  idBeneficiary: number;
  dniBenefeciary: number;
  fullnameBenefeciary: string;
  ageBeneficiary: number;
  isActive: boolean;
  observationsBeneficiary: string;
  users?: {
    idUser: number;
  };
}
