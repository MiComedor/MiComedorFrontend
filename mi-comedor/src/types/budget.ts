export interface BudgetDTO {
  idBudget: number;
  descriptionProduct: string;
  amountBudget: number;
  dateBudget: string;
  users?: {
    idUser: number;
  };
  budgetCategory?: {
    idBudgetCategory: number;
  };
}
