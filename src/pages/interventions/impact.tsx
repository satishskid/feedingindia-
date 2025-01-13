import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import InterventionImpactChart from '../../components/interventions/InterventionImpactChart';
import InterventionManager from '../../components/interventions/InterventionManager';
import { Intervention, GrowthMeasurement } from '../../types/interventions';

// Mock data - replace with actual data from your database
const mockInterventions: Intervention[] = [
  {
    id: '1',
    type: 'nutrition',
    startDate: '2024-01-01',
    endDate: '2024-03-01',
    description: 'High protein diet supplementation',
    status: 'ongoing',
    notes: 'Providing additional 20g protein daily',
  },
  {
    id: '2',
    type: 'deworming',
    startDate: '2023-12-01',
    endDate: '2023-12-15',
    description: 'Standard deworming treatment',
    status: 'completed',
    notes: 'Completed full course',
  },
];

const mockMeasurements: GrowthMeasurement[] = [
  { date: '2023-11-01', age: 24, height: 85, weight: 11.5 },
  { date: '2023-12-01', age: 25, height: 86, weight: 11.8 },
  { date: '2023-12-15', age: 25.5, height: 86.5, weight: 12.0 },
  { date: '2024-01-01', age: 26, height: 87, weight: 12.2 },
  { date: '2024-01-15', age: 26.5, height: 88, weight: 12.5 },
  { date: '2024-02-01', age: 27, height: 89, weight: 12.8 },
];

export default function InterventionImpactAnalysis() {
  const [interventions, setInterventions] = useState<Intervention[]>(mockInterventions);
  const [measurements, setMeasurements] = useState<GrowthMeasurement[]>(mockMeasurements);

  const calculateGrowthVelocity = (
    measurements: GrowthMeasurement[],
    type: 'height' | 'weight'
  ) => {
    if (measurements.length < 2) return 0;

    const firstMeasurement = measurements[0];
    const lastMeasurement = measurements[measurements.length - 1];
    const monthsDiff =
      (new Date(lastMeasurement.date).getTime() -
        new Date(firstMeasurement.date).getTime()) /
      (1000 * 60 * 60 * 24 * 30.44); // Average month length

    const valueDiff =
      type === 'height'
        ? lastMeasurement.height - firstMeasurement.height
        : lastMeasurement.weight - firstMeasurement.weight;

    return monthsDiff > 0 ? valueDiff / monthsDiff : 0;
  };

  const handleAddIntervention = (newIntervention: Omit<Intervention, 'id'>) => {
    const intervention: Intervention = {
      ...newIntervention,
      id: (interventions.length + 1).toString(),
    };
    setInterventions([...interventions, intervention]);
  };

  const handleUpdateIntervention = (updatedIntervention: Intervention) => {
    setInterventions(
      interventions.map((i) =>
        i.id === updatedIntervention.id ? updatedIntervention : i
      )
    );
  };

  const handleDeleteIntervention = (id: string) => {
    setInterventions(interventions.filter((i) => i.id !== id));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Intervention Impact Analysis</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <InterventionImpactChart
            measurements={measurements}
            interventions={interventions}
            type="height"
          />
          <InterventionImpactChart
            measurements={measurements}
            interventions={interventions}
            type="weight"
          />
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Growth Velocity Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interventions.map((intervention) => {
                const startDate = new Date(intervention.startDate);
                const endDate = new Date(intervention.endDate);

                const preMeasurements = measurements.filter(
                  (m) => new Date(m.date) < startDate
                );
                const duringMeasurements = measurements.filter(
                  (m) => {
                    const date = new Date(m.date);
                    return date >= startDate && date <= endDate;
                  }
                );
                const postMeasurements = measurements.filter(
                  (m) => new Date(m.date) > endDate
                );

                return (
                  <div
                    key={intervention.id}
                    className="bg-gray-50 p-4 rounded-lg space-y-4"
                  >
                    <h3 className="font-medium">
                      {intervention.type.charAt(0).toUpperCase() +
                        intervention.type.slice(1)}{' '}
                      Impact
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Height Velocity (cm/month)</p>
                        <div className="space-y-1">
                          <p>
                            Pre:{' '}
                            {calculateGrowthVelocity(preMeasurements, 'height').toFixed(2)}
                          </p>
                          <p>
                            During:{' '}
                            {calculateGrowthVelocity(duringMeasurements, 'height').toFixed(
                              2
                            )}
                          </p>
                          <p>
                            Post:{' '}
                            {calculateGrowthVelocity(postMeasurements, 'height').toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Weight Velocity (kg/month)</p>
                        <div className="space-y-1">
                          <p>
                            Pre:{' '}
                            {calculateGrowthVelocity(preMeasurements, 'weight').toFixed(2)}
                          </p>
                          <p>
                            During:{' '}
                            {calculateGrowthVelocity(duringMeasurements, 'weight').toFixed(
                              2
                            )}
                          </p>
                          <p>
                            Post:{' '}
                            {calculateGrowthVelocity(postMeasurements, 'weight').toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <InterventionManager
            interventions={interventions}
            onAddIntervention={handleAddIntervention}
            onUpdateIntervention={handleUpdateIntervention}
            onDeleteIntervention={handleDeleteIntervention}
          />
        </div>
      </div>
    </Layout>
  );
}
