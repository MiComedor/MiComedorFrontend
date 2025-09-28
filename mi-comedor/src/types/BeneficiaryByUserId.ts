import { ReactNode } from "react";

export default interface BeneficiaryByUserId {
  age: ReactNode;
  observation: ReactNode;
  idBeneficiary: number;
  dniBenefeciary: number;
  fullnameBenefeciary: string;
  ageBeneficiary: number;
  observationsBeneficiary: string;
  isActive: boolean;
}
