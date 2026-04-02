export enum ProductType {
  CDT = 'CDT',
  MORTGAGE = 'MORTGAGE',
  CREDIT_CARD = 'CREDIT_CARD',
  SAVINGS_ACCOUNT = 'SAVINGS_ACCOUNT',
  PERSONAL_LOAN = 'PERSONAL_LOAN',
}

export const PRODUCT_TYPE_VALUES: ReadonlyArray<ProductType> = [
  ProductType.CDT,
  ProductType.MORTGAGE,
  ProductType.CREDIT_CARD,
  ProductType.SAVINGS_ACCOUNT,
  ProductType.PERSONAL_LOAN,
];

export interface ProductModel {
  productType: ProductType;
  user: string;
  amount: number;
  term: number;
}
