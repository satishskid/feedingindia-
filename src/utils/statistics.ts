import { GrowthMeasurement } from '../types/interventions';

export function calculateMean(values: number[]): number {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

export function calculateStandardDeviation(values: number[]): number {
  const mean = calculateMean(values);
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  return Math.sqrt(calculateMean(squareDiffs));
}

export function calculateZScore(value: number, mean: number, sd: number): number {
  return (value - mean) / sd;
}

// Perform t-test for independent samples
export function tTest(sample1: number[], sample2: number[]): {
  tValue: number;
  pValue: number;
  significant: boolean;
} {
  const n1 = sample1.length;
  const n2 = sample2.length;
  const mean1 = calculateMean(sample1);
  const mean2 = calculateMean(sample2);
  const var1 = calculateStandardDeviation(sample1) ** 2;
  const var2 = calculateStandardDeviation(sample2) ** 2;

  // Pooled variance
  const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
  const standardError = Math.sqrt(pooledVar * (1/n1 + 1/n2));
  
  const tValue = (mean1 - mean2) / standardError;
  
  // Approximate p-value using normal distribution (for large samples)
  const pValue = 2 * (1 - normalCDF(Math.abs(tValue)));
  
  return {
    tValue,
    pValue,
    significant: pValue < 0.05 // Using 0.05 significance level
  };
}

// Helper function for normal cumulative distribution function
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

export function calculateGrowthVelocity(
  measurements: GrowthMeasurement[],
  type: 'height' | 'weight'
): number {
  if (measurements.length < 2) return 0;

  const firstMeasurement = measurements[0];
  const lastMeasurement = measurements[measurements.length - 1];
  const monthsDiff =
    (new Date(lastMeasurement.date).getTime() -
      new Date(firstMeasurement.date).getTime()) /
    (1000 * 60 * 60 * 24 * 30.44);

  const valueDiff =
    type === 'height'
      ? lastMeasurement.height - firstMeasurement.height
      : lastMeasurement.weight - firstMeasurement.weight;

  return monthsDiff > 0 ? valueDiff / monthsDiff : 0;
}

interface WHOStandard {
  age: number;
  l: number;  // Box-Cox power
  m: number;  // median
  s: number;  // coefficient of variation
  sd: number[]; // standard deviations
}

export function calculateWHOZScore(
  measurement: number,
  age: number,
  gender: 'male' | 'female',
  type: 'height' | 'weight',
  whoStandards: WHOStandard[]
): number {
  // Find the closest age standard
  const standard = whoStandards.reduce((prev, curr) => {
    return Math.abs(curr.age - age) < Math.abs(prev.age - age) ? curr : prev;
  });

  // Use the LMS method to calculate z-score
  // Z = ((value/M)^L - 1)/(L*S) if L ≠ 0
  // Z = ln(value/M)/S if L = 0
  if (standard.l === 0) {
    return Math.log(measurement / standard.m) / standard.s;
  } else {
    return (Math.pow(measurement / standard.m, standard.l) - 1) / (standard.l * standard.s);
  }
}

export function calculatePercentile(zScore: number): number {
  return normalCDF(zScore) * 100;
}

export function calculateEffectSize(sample1: number[], sample2: number[]): {
  cohensD: number;
  interpretation: string;
} {
  const mean1 = calculateMean(sample1);
  const mean2 = calculateMean(sample2);
  const sd1 = calculateStandardDeviation(sample1);
  const sd2 = calculateStandardDeviation(sample2);
  
  // Pooled standard deviation
  const pooledSD = Math.sqrt(
    ((sample1.length - 1) * sd1 * sd1 + (sample2.length - 1) * sd2 * sd2) /
    (sample1.length + sample2.length - 2)
  );
  
  const cohensD = Math.abs(mean1 - mean2) / pooledSD;
  
  // Interpret Cohen's d
  let interpretation = '';
  if (cohensD < 0.2) interpretation = 'negligible effect';
  else if (cohensD < 0.5) interpretation = 'small effect';
  else if (cohensD < 0.8) interpretation = 'medium effect';
  else interpretation = 'large effect';
  
  return { cohensD, interpretation };
}
