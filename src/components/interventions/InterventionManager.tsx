import React, { useState } from 'react';
import { Intervention, InterventionType } from '../../types/interventions';

interface InterventionManagerProps {
  interventions: Intervention[];
  onAddIntervention: (intervention: Omit<Intervention, 'id'>) => void;
  onUpdateIntervention: (intervention: Intervention) => void;
  onDeleteIntervention: (id: string) => void;
}

const interventionTypes: { value: InterventionType; label: string }[] = [
  { value: 'nutrition', label: 'Nutrition Support' },
  { value: 'deworming', label: 'Deworming' },
  { value: 'vitamin_supplementation', label: 'Vitamin Supplementation' },
  { value: 'immunization', label: 'Immunization' },
  { value: 'dietary_counseling', label: 'Dietary Counseling' },
  { value: 'other', label: 'Other' },
];

export default function InterventionManager({
  interventions,
  onAddIntervention,
  onUpdateIntervention,
  onDeleteIntervention,
}: InterventionManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newIntervention, setNewIntervention] = useState<Omit<Intervention, 'id'>>({
    type: 'nutrition',
    startDate: '',
    endDate: '',
    description: '',
    status: 'ongoing',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddIntervention(newIntervention);
    setIsAdding(false);
    setNewIntervention({
      type: 'nutrition',
      startDate: '',
      endDate: '',
      description: '',
      status: 'ongoing',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Interventions</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Intervention
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={newIntervention.type}
              onChange={(e) =>
                setNewIntervention({
                  ...newIntervention,
                  type: e.target.value as InterventionType,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {interventionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={newIntervention.startDate}
                onChange={(e) =>
                  setNewIntervention({
                    ...newIntervention,
                    startDate: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={newIntervention.endDate}
                onChange={(e) =>
                  setNewIntervention({
                    ...newIntervention,
                    endDate: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newIntervention.description}
              onChange={(e) =>
                setNewIntervention({
                  ...newIntervention,
                  description: e.target.value,
                })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={newIntervention.status}
              onChange={(e) =>
                setNewIntervention({
                  ...newIntervention,
                  status: e.target.value as 'ongoing' | 'completed' | 'discontinued',
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={newIntervention.notes}
              onChange={(e) =>
                setNewIntervention({
                  ...newIntervention,
                  notes: e.target.value,
                })
              }
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Intervention
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {interventions.map((intervention) => (
          <div
            key={intervention.id}
            className="bg-white p-6 rounded-lg shadow space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">
                  {interventionTypes.find((t) => t.value === intervention.type)?.label}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(intervention.startDate).toLocaleDateString()} -{' '}
                  {new Date(intervention.endDate).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  intervention.status === 'ongoing'
                    ? 'bg-green-100 text-green-800'
                    : intervention.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {intervention.status.charAt(0).toUpperCase() + intervention.status.slice(1)}
              </span>
            </div>

            <p className="text-gray-700">{intervention.description}</p>
            {intervention.notes && (
              <p className="text-sm text-gray-500">{intervention.notes}</p>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => onDeleteIntervention(intervention.id)}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
