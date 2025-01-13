import React from 'react';
import {
  tTest,
  calculateEffectSize,
  calculateGrowthVelocity,
  calculateWHOZScore,
  calculatePercentile,
} from '../../utils/statistics';
import { Intervention, GrowthMeasurement } from '../../types/interventions';

interface InterventionStatisticsProps {
  intervention: Intervention;
  measurements: GrowthMeasurement[];
  whoStandards: any; // Replace with proper WHO standards type
}

export default function InterventionStatistics({
  intervention,
  measurements,
  whoStandards,
}: InterventionStatisticsProps) {
  const startDate = new Date(intervention.startDate);
  const endDate = new Date(intervention.endDate);

  // Split measurements into periods
  const preMeasurements = measurements.filter(m => new Date(m.date) < startDate);
  const duringMeasurements = measurements.filter(
    m => {
      const date = new Date(m.date);
      return date >= startDate && date <= endDate;
    }
  );
  const postMeasurements = measurements.filter(m => new Date(m.date) > endDate);

  // Calculate growth velocities
  const heightVelocities = {
    pre: calculateGrowthVelocity(preMeasurements, 'height'),
    during: calculateGrowthVelocity(duringMeasurements, 'height'),
    post: calculateGrowthVelocity(postMeasurements, 'height'),
  };

  const weightVelocities = {
    pre: calculateGrowthVelocity(preMeasurements, 'weight'),
    during: calculateGrowthVelocity(duringMeasurements, 'weight'),
    post: calculateGrowthVelocity(postMeasurements, 'weight'),
  };

  // Perform statistical tests
  const heightPreDuring = tTest(
    preMeasurements.map(m => m.height),
    duringMeasurements.map(m => m.height)
  );

  const weightPreDuring = tTest(
    preMeasurements.map(m => m.weight),
    duringMeasurements.map(m => m.weight)
  );

  // Calculate effect sizes
  const heightEffectSize = calculateEffectSize(
    preMeasurements.map(m => m.height),
    duringMeasurements.map(m => m.height)
  );

  const weightEffectSize = calculateEffectSize(
    preMeasurements.map(m => m.weight),
    duringMeasurements.map(m => m.weight)
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h3 className="text-xl font-semibold">Statistical Analysis</h3>
      
      {/* Growth Velocities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Height Growth Velocity (cm/month)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Pre</p>
              <p className="font-medium">{heightVelocities.pre.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">During</p>
              <p className="font-medium">{heightVelocities.during.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Post</p>
              <p className="font-medium">{heightVelocities.post.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Weight Growth Velocity (kg/month)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Pre</p>
              <p className="font-medium">{weightVelocities.pre.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">During</p>
              <p className="font-medium">{weightVelocities.during.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Post</p>
              <p className="font-medium">{weightVelocities.post.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistical Tests */}
      <div className="space-y-4">
        <h4 className="font-medium">Statistical Significance (Pre vs. During)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Height</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>t-value: {heightPreDuring.tValue.toFixed(2)}</p>
              <p>p-value: {heightPreDuring.pValue.toFixed(4)}</p>
              <p className={heightPreDuring.significant ? 'text-green-600' : 'text-gray-600'}>
                {heightPreDuring.significant ? 'Statistically Significant' : 'Not Significant'}
              </p>
              <p>Effect Size: {heightEffectSize.cohensD.toFixed(2)} ({heightEffectSize.interpretation})</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Weight</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>t-value: {weightPreDuring.tValue.toFixed(2)}</p>
              <p>p-value: {weightPreDuring.pValue.toFixed(4)}</p>
              <p className={weightPreDuring.significant ? 'text-green-600' : 'text-gray-600'}>
                {weightPreDuring.significant ? 'Statistically Significant' : 'Not Significant'}
              </p>
              <p>Effect Size: {weightEffectSize.cohensD.toFixed(2)} ({weightEffectSize.interpretation})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Significance */}
      <div className="space-y-4">
        <h4 className="font-medium">Clinical Significance</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium mb-2">Height Velocity Change</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>
                {((heightVelocities.during - heightVelocities.pre) / heightVelocities.pre * 100).toFixed(1)}% change
                from pre-intervention
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {heightVelocities.during > heightVelocities.pre
                  ? 'Improved growth rate'
                  : 'Decreased growth rate'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Weight Velocity Change</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>
                {((weightVelocities.during - weightVelocities.pre) / weightVelocities.pre * 100).toFixed(1)}% change
                from pre-intervention
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {weightVelocities.during > weightVelocities.pre
                  ? 'Improved growth rate'
                  : 'Decreased growth rate'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
