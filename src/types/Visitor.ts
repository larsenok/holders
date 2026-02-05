export type VisitorType = 'Trader' | 'Burglar' | 'NiceStranger' | 'RealEstate' | 'Bard';

export type Visitor = {
  id: string;
  type: VisitorType;
};
