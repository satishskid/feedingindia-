import { Intervention, GrowthMeasurement } from '../types/interventions';

interface Child {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  measurements: GrowthMeasurement[];
  interventions: Intervention[];
}

interface GrowthMeasurement {
  date: string;
  age: number;
  height: number;
  weight: number;
}

interface Intervention {
  id: string;
  type: 'nutrition' | 'deworming' | 'vitamin_supplementation';
  startDate: string;
  endDate: string;
  description: string;
  status: 'completed' | 'ongoing' | 'planned';
  notes: string;
}

// Seeded random number generator for consistent values
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Simple random number generator with seed
  random(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

const seededRandom = new SeededRandom(12345); // Fixed seed for consistent data

function generateMeasurements(
  startDate: string,
  startAge: number,
  baseHeight: number,
  baseWeight: number,
  gender: 'male' | 'female',
  hasIntervention: boolean = false
): GrowthMeasurement[] {
  const measurements: GrowthMeasurement[] = [];
  const startDateTime = new Date(startDate).getTime();
  
  // Use seeded random for consistent values
  const heightGrowthRate = 6 + seededRandom.random() * 2;
  const weightGrowthRate = 1.5 + seededRandom.random() * 0.5;
  
  const interventionMultiplier = hasIntervention ? 1.2 : 1;

  for (let i = 0; i < 5; i++) {
    const measurementDate = new Date(startDateTime + i * 6 * 30 * 24 * 60 * 60 * 1000);
    const age = startAge + i * 6;
    
    const seasonalEffect = Math.sin(measurementDate.getMonth() * Math.PI / 6) * 0.2;
    const randomVariation = (seededRandom.random() - 0.5) * 0.5;

    const interventionEffect = (i >= 2 && hasIntervention) ? interventionMultiplier : 1;
    
    const height = baseHeight + 
      (heightGrowthRate * i * interventionEffect) + 
      (seasonalEffect * 0.5) + 
      randomVariation;
    
    const weight = baseWeight + 
      (weightGrowthRate * i * interventionEffect) + 
      (seasonalEffect * 0.2) + 
      (randomVariation * 0.3);

    measurements.push({
      date: measurementDate.toISOString().split('T')[0],
      age,
      height: parseFloat(height.toFixed(1)),
      weight: parseFloat(weight.toFixed(1))
    });
  }

  return measurements;
}

function generateIntervention(
  childId: string,
  startDate: string,
  type: 'nutrition' | 'deworming' | 'vitamin_supplementation'
): Intervention {
  const interventionStart = new Date(startDate);
  const interventionEnd = new Date(interventionStart.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);

  return {
    id: `${childId}-${type}`,
    type,
    startDate: interventionStart.toISOString().split('T')[0],
    endDate: interventionEnd.toISOString().split('T')[0],
    description: getInterventionDescription(type),
    status: 'completed',
    notes: getInterventionNotes(type)
  };
}

function getInterventionDescription(type: string): string {
  switch (type) {
    case 'nutrition':
      return 'Enhanced nutrition program with protein supplementation and balanced diet planning';
    case 'deworming':
      return 'Standard deworming treatment with follow-up monitoring';
    case 'vitamin_supplementation':
      return 'Comprehensive vitamin A, D, and multivitamin supplementation';
    default:
      return '';
  }
}

function getInterventionNotes(type: string): string {
  switch (type) {
    case 'nutrition':
      return 'Good compliance with nutrition program. Parent education provided.';
    case 'deworming':
      return 'Complete course administered. No adverse effects reported.';
    case 'vitamin_supplementation':
      return 'Regular supplementation maintained. Vitamin D levels monitored.';
    default:
      return '';
  }
}

// Generate 35 children with measurements and interventions
export const generateMockChildren = (): Child[] => Array.from({ length: 35 }, (_, index) => {
  const id = (index + 1).toString().padStart(3, '0');
  const gender = seededRandom.random() > 0.5 ? 'male' : 'female';
  
  const birthYear = 2021 + (seededRandom.random() > 0.5 ? 0 : 1);
  const birthMonth = Math.floor(seededRandom.random() * 12) + 1;
  const birthDay = Math.floor(seededRandom.random() * 28) + 1;
  const birthDate = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;

  const baseHeight = gender === 'male' ? 50 + seededRandom.random() * 2 : 49 + seededRandom.random() * 2;
  const baseWeight = gender === 'male' ? 3.5 + seededRandom.random() * 0.5 : 3.3 + seededRandom.random() * 0.5;

  const hasIntervention = seededRandom.random() < 0.7;

  const measurements = generateMeasurements(
    birthDate,
    0,
    baseHeight,
    baseWeight,
    gender,
    hasIntervention
  );

  const interventions: Intervention[] = hasIntervention
    ? [generateIntervention(
        id,
        measurements[2].date,
        ['nutrition', 'deworming', 'vitamin_supplementation'][Math.floor(seededRandom.random() * 3)] as any
      )]
    : [];

  return {
    id,
    name: `Child ${id}`,
    gender,
    birthDate,
    measurements,
    interventions
  };
});

// Group children by intervention type
export const getChildrenByIntervention = (children: Child[]) => ({
  nutrition: children.filter(child => 
    child.interventions.some(i => i.type === 'nutrition')
  ),
  deworming: children.filter(child => 
    child.interventions.some(i => i.type === 'deworming')
  ),
  vitamin_supplementation: children.filter(child => 
    child.interventions.some(i => i.type === 'vitamin_supplementation')
  ),
  control: children.filter(child => 
    child.interventions.length === 0
  )
});

// Calculate growth velocities
export const getGrowthVelocities = (childrenByIntervention: Record<string, Child[]>) => ({
  nutrition: calculateAverageGrowthVelocity(childrenByIntervention.nutrition),
  deworming: calculateAverageGrowthVelocity(childrenByIntervention.deworming),
  vitamin_supplementation: calculateAverageGrowthVelocity(childrenByIntervention.vitamin_supplementation),
  control: calculateAverageGrowthVelocity(childrenByIntervention.control)
});

function calculateAverageGrowthVelocity(children: Child[]) {
  if (children.length === 0) return { height: 0, weight: 0 };

  const velocities = children.map(child => {
    const firstMeasurement = child.measurements[0];
    const lastMeasurement = child.measurements[child.measurements.length - 1];
    const monthsDiff = lastMeasurement.age - firstMeasurement.age;

    return {
      height: (lastMeasurement.height - firstMeasurement.height) / monthsDiff,
      weight: (lastMeasurement.weight - firstMeasurement.weight) / monthsDiff
    };
  });

  return {
    height: velocities.reduce((sum, v) => sum + v.height, 0) / velocities.length,
    weight: velocities.reduce((sum, v) => sum + v.weight, 0) / velocities.length
  };
}

// Sample data for WHO standards (simplified)
export const mockWHOStandards = {
  male: {
    height: [
      { age: 0, median: 50.0, sd: 2.0 },
      { age: 6, median: 67.6, sd: 2.5 },
      { age: 12, median: 75.7, sd: 2.8 },
      { age: 18, median: 82.3, sd: 3.0 },
      { age: 24, median: 87.8, sd: 3.2 }
    ],
    weight: [
      { age: 0, median: 3.5, sd: 0.5 },
      { age: 6, median: 7.9, sd: 0.8 },
      { age: 12, median: 9.6, sd: 1.0 },
      { age: 18, median: 11.1, sd: 1.2 },
      { age: 24, median: 12.2, sd: 1.4 }
    ]
  },
  female: {
    height: [
      { age: 0, median: 49.1, sd: 2.0 },
      { age: 6, median: 65.7, sd: 2.4 },
      { age: 12, median: 74.0, sd: 2.7 },
      { age: 18, median: 80.7, sd: 2.9 },
      { age: 24, median: 86.4, sd: 3.1 }
    ],
    weight: [
      { age: 0, median: 3.3, sd: 0.5 },
      { age: 6, median: 7.3, sd: 0.8 },
      { age: 12, median: 8.9, sd: 1.0 },
      { age: 18, median: 10.2, sd: 1.2 },
      { age: 24, median: 11.5, sd: 1.4 }
    ]
  }
};
