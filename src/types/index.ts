export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Transaction {
  _id?: string;
  personName: string;
  amount: number;
  purpose?: string;
  type: 'given' | 'received';
  createdAt: Date;
  userId: string;
}

export interface PersonSummary {
  name: string;
  totalGiven: number;
  totalReceived: number;
  netAmount: number; // positive = to receive, negative = to give
}