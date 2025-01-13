import { GrowthMeasurement, Intervention } from '../types/interventions';

// ANOVA calculation
export function calculateANOVA(groups: number[][]): {
  fValue: number;
  pValue: number;
  significant: boolean;
} {
  // Calculate group means
  const groupMeans = groups.map(group => 
    group.reduce((sum, val) => sum + val, 0) / group.length
  );

  // Calculate grand mean
  const allValues = groups.flat();
  const grandMean = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;

  // Calculate SSB (Sum of Squares Between groups)
  const ssb = groups.reduce((sum, group, i) => 
    sum + group.length * Math.pow(groupMeans[i] - grandMean, 2), 0
  );

  // Calculate SSW (Sum of Squares Within groups)
  const ssw = groups.reduce((sum, group, i) => 
    sum + group.reduce((groupSum, val) => 
      groupSum + Math.pow(val - groupMeans[i], 2), 0
    ), 0
  );

  // Calculate degrees of freedom
  const dfb = groups.length - 1;
  const dfw = allValues.length - groups.length;

  // Calculate Mean Squares
  const msb = ssb / dfb;
  const msw = ssw / dfw;

  // Calculate F-value
  const fValue = msb / msw;

  // Calculate p-value using F-distribution approximation
  const pValue = 1 - fDistribution(fValue, dfb, dfw);

  return {
    fValue,
    pValue,
    significant: pValue < 0.05
  };
}

// F-distribution approximation
function fDistribution(f: number, df1: number, df2: number): number {
  const x = df1 * f / (df1 * f + df2);
  return betaIncomplete(df1/2, df2/2, x);
}

// Incomplete beta function approximation
function betaIncomplete(a: number, b: number, x: number): number {
  const maxIterations = 100;
  const epsilon = 1e-8;
  let sum = 0;
  let term = x ** a * (1 - x) ** b;
  
  for (let i = 0; i < maxIterations; i++) {
    sum += term;
    term *= (a + i) * x / (a + b + i);
    if (Math.abs(term) < epsilon) break;
  }
  
  return sum;
}

// Repeated Measures ANOVA
export function repeatedMeasuresANOVA(measurements: number[][]): {
  fValue: number;
  pValue: number;
  significant: boolean;
  effectSize: number;
} {
  const n = measurements.length; // number of subjects
  const k = measurements[0].length; // number of measurements per subject

  // Calculate means
  const subjectMeans = measurements.map(subject =>
    subject.reduce((sum, val) => sum + val, 0) / k
  );
  const timePointMeans = Array(k).fill(0);
  for (let i = 0; i < k; i++) {
    timePointMeans[i] = measurements.reduce((sum, subject) => sum + subject[i], 0) / n;
  }
  const grandMean = subjectMeans.reduce((sum, val) => sum + val, 0) / n;

  // Calculate Sum of Squares
  let ssSubjects = 0;
  let ssTime = 0;
  let ssError = 0;

  for (let i = 0; i < n; i++) {
    ssSubjects += k * (subjectMeans[i] - grandMean) ** 2;
    for (let j = 0; j < k; j++) {
      ssTime += (timePointMeans[j] - grandMean) ** 2;
      ssError += (measurements[i][j] - subjectMeans[i] - timePointMeans[j] + grandMean) ** 2;
    }
  }

  // Degrees of freedom
  const dfSubjects = n - 1;
  const dfTime = k - 1;
  const dfError = (n - 1) * (k - 1);

  // Mean squares
  const msTime = ssTime / dfTime;
  const msError = ssError / dfError;

  // F-value
  const fValue = msTime / msError;

  // P-value
  const pValue = 1 - fDistribution(fValue, dfTime, dfError);

  // Effect size (partial eta squared)
  const effectSize = ssTime / (ssTime + ssError);

  return {
    fValue,
    pValue,
    significant: pValue < 0.05,
    effectSize
  };
}

// Calculate growth rate acceleration
export function calculateGrowthAcceleration(
  measurements: GrowthMeasurement[],
  type: 'height' | 'weight'
): number {
  if (measurements.length < 3) return 0;

  const velocities: number[] = [];
  for (let i = 1; i < measurements.length; i++) {
    const timeDiff = (new Date(measurements[i].date).getTime() - 
                     new Date(measurements[i-1].date).getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    const valueDiff = type === 'height' 
      ? measurements[i].height - measurements[i-1].height
      : measurements[i].weight - measurements[i-1].weight;
    velocities.push(valueDiff / timeDiff);
  }

  // Calculate acceleration (change in velocity per month)
  let totalAcceleration = 0;
  for (let i = 1; i < velocities.length; i++) {
    totalAcceleration += velocities[i] - velocities[i-1];
  }

  return totalAcceleration / (velocities.length - 1);
}

// Calculate catch-up growth index
export function calculateCatchUpIndex(
  measurements: GrowthMeasurement[],
  whoStandards: any,
  type: 'height' | 'weight'
): number {
  if (measurements.length < 2) return 0;

  const initialZ = calculateZScore(measurements[0], whoStandards, type);
  const finalZ = calculateZScore(measurements[measurements.length - 1], whoStandards, type);
  const monthsDiff = (new Date(measurements[measurements.length - 1].date).getTime() -
                     new Date(measurements[0].date).getTime()) / (1000 * 60 * 60 * 24 * 30.44);

  return (finalZ - initialZ) / monthsDiff;
}

// Helper function for z-score calculation
function calculateZScore(measurement: GrowthMeasurement, whoStandards: any, type: 'height' | 'weight'): number {
  // Implementation depends on WHO standards data structure
  // This is a placeholder
  return 0;
}

// Calculate seasonal effects
export function calculateSeasonalEffects(
  measurements: GrowthMeasurement[],
  type: 'height' | 'weight'
): {
  springGrowth: number;
  summerGrowth: number;
  fallGrowth: number;
  winterGrowth: number;
} {
  const seasonalGrowth = {
    spring: [] as number[],
    summer: [] as number[],
    fall: [] as number[],
    winter: [] as number[]
  };

  for (let i = 1; i < measurements.length; i++) {
    const date1 = new Date(measurements[i-1].date);
    const date2 = new Date(measurements[i].date);
    const month = date1.getMonth();
    const growth = type === 'height'
      ? measurements[i].height - measurements[i-1].height
      : measurements[i].weight - measurements[i-1].weight;
    
    if (month >= 2 && month <= 4) seasonalGrowth.spring.push(growth);
    else if (month >= 5 && month <= 7) seasonalGrowth.summer.push(growth);
    else if (month >= 8 && month <= 10) seasonalGrowth.fall.push(growth);
    else seasonalGrowth.winter.push(growth);
  }

  return {
    springGrowth: calculateMean(seasonalGrowth.spring),
    summerGrowth: calculateMean(seasonalGrowth.summer),
    fallGrowth: calculateMean(seasonalGrowth.fall),
    winterGrowth: calculateMean(seasonalGrowth.winter)
  };
}

function calculateMean(values: number[]): number {
  return values.length > 0
    ? values.reduce((sum, val) => sum + val, 0) / values.length
    : 0;
}

// Calculate intervention timing effectiveness
export function analyzeInterventionTiming(
  interventions: Intervention[],
  measurements: GrowthMeasurement[],
  type: 'height' | 'weight'
): {
  optimalAge: number;
  optimalSeason: 'spring' | 'summer' | 'fall' | 'winter';
  effectivenessByAge: { age: number; effectiveness: number }[];
  effectivenessBySeason: { season: string; effectiveness: number }[];
} {
  // Implementation of intervention timing analysis
  // This would analyze when interventions are most effective
  // based on age and season
  
  // Placeholder return
  return {
    optimalAge: 24, // months
    optimalSeason: 'spring',
    effectivenessByAge: [],
    effectivenessBySeason: []
  };
}
