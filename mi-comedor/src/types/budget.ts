import BugdeCategoty from "./budgetCategory";

export interface BudgetDTO {
  idBudget: number;
  descriptionProduct: string;
  amountBudget: number;
  dateBudget: string;
  users?: {
    idUser: number;
  };
  budgetCategory?: BugdeCategoty; // ✅ Esto es lo correcto
}