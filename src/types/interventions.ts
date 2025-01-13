export type InterventionType = 
  | 'nutrition' 
  | 'deworming' 
  | 'vitamin_supplementation'
  | 'immunization'
  | 'dietary_counseling'
  | 'other';

export interface Intervention {
  id: string;
  type: InterventionType;
  startDate: string;
  endDate: string;
  description: string;
  status: 'ongoing' | 'completed' | 'discontinued';
  notes?: string;
}

export interface GrowthMeasurement {
  date: string;
  age: number;
  height: number;
  weight: number;
  interventionPeriod?: string; // ID of the intervention if measurement was taken during one
}

export interface InterventionImpact {
  interventionId: string;
  preIntervention: {
    heightVelocity: number; // cm/month
    weightVelocity: number; // kg/month
    heightForAgeZ: number;
    weightForAgeZ: number;
  };
  duringIntervention: {
    heightVelocity: number;
    weightVelocity: number;
    heightForAgeZ: number;
    weightForAgeZ: number;
  };
  postIntervention: {
    heightVelocity: number;
    weightVelocity: number;
    heightForAgeZ: number;
    weightForAgeZ: number;
  };
}
