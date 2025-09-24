export default interface Beneficiary {
  idBeneficiary: number;
  dniBenefeciary: number;
  fullnameBenefeciary: string;
  ageBeneficiary: number;
  is_active:boolean;
  observationsBeneficiary: string;
  users?: {
    idUser: number;
  };
}
