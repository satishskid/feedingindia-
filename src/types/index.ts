export interface ChildData {
  id: string;
  age: number;
  height: number;
  weight: number;
  gender: 'boy' | 'girl';
  createdAt: string;
  updatedAt: string;
}

export interface WHOStandard {
  age: number;
  SD4neg: number;
  SD3neg: number;
  SD2neg: number;
  SD1neg: number;
  SD0: number;
  SD1: number;
  SD2: number;
  SD3: number;
  SD4: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface ChartData {
  labels: number[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
  }[];
}

export interface Measurement {
  date: string;
  age: number;
  height: number;
  weight: number;
}

export interface Intervention {
  id: string;
  date: string;
  type: 'Nutrition' | 'Medical' | 'Educational' | 'Other';
  description: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  outcome?: string;
  nextFollowUp?: string;
}

export interface Program {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  organization: string;
  description: string;
  status: 'Active' | 'Completed' | 'Planned';
  location: string;
  targetBeneficiaries: number;
  currentBeneficiaries: number;
}

export interface Child {
  id: string;
  name: string;
  birthDate: string;
  gender: 'boy' | 'girl';
  image?: string;
  programId: string;
  measurements: Measurement[];
  interventions: Intervention[];
}
