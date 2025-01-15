export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  created_at: string;
}

export interface Measurement {
  id: string;
  childId: string;
  date: string;
  weight: number;
  height: number;
  created_at: string;
}

export interface Intervention {
  id: string;
  childId: string;
  name: string;
  startDate: string;
  type: 'nutrition' | 'medical' | 'behavioral';
  description: string;
  impact: number;
  created_at: string;
}
