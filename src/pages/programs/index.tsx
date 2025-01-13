import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { Program } from '../../types';

// Mock data - replace with API call
const mockPrograms: Program[] = [
  {
    id: 'prog1',
    name: 'Rural Health Initiative 2025',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    organization: 'HealthCare NGO',
    description: 'Comprehensive health and nutrition program for rural children',
    status: 'Active',
    location: 'Rural District A',
    targetBeneficiaries: 1000,
    currentBeneficiaries: 750
  },
  {
    id: 'prog2',
    name: 'Urban Nutrition Program',
    startDate: '2025-03-01',
    endDate: '2026-02-28',
    organization: 'City Health Department',
    description: 'Nutrition intervention for urban slum children',
    status: 'Planned',
    location: 'City B Slum Areas',
    targetBeneficiaries: 500,
    currentBeneficiaries: 0
  }
];

const ProgramsPage = () => {
  const router = useRouter();
  const [showNewProgramForm, setShowNewProgramForm] = useState(false);
  const [newProgram, setNewProgram] = useState<Partial<Program>>({
    status: 'Planned'
  });

  const handleProgramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add API call to save program
    console.log('New program:', newProgram);
    setShowNewProgramForm(false);
    setNewProgram({ status: 'Planned' });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Programs</h1>
          <button
            onClick={() => setShowNewProgramForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Create New Program
          </button>
        </div>

        {showNewProgramForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6">New Program</h2>
            <form onSubmit={handleProgramSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Program Name</label>
                  <input
                    type="text"
                    value={newProgram.name || ''}
                    onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Organization</label>
                  <input
                    type="text"
                    value={newProgram.organization || ''}
                    onChange={(e) => setNewProgram({...newProgram, organization: e.target.value})}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newProgram.startDate || ''}
                    onChange={(e) => setNewProgram({...newProgram, startDate: e.target.value})}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={newProgram.endDate || ''}
                    onChange={(e) => setNewProgram({...newProgram, endDate: e.target.value})}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={newProgram.location || ''}
                    onChange={(e) => setNewProgram({...newProgram, location: e.target.value})}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Target Beneficiaries</label>
                  <input
                    type="number"
                    value={newProgram.targetBeneficiaries || ''}
                    onChange={(e) => setNewProgram({...newProgram, targetBeneficiaries: parseInt(e.target.value)})}
                    className="w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newProgram.description || ''}
                  onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowNewProgramForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Create Program
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => router.push(`/programs/${program.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{program.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  program.status === 'Active' ? 'bg-green-100 text-green-800' :
                  program.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {program.status}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{program.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Organization</p>
                  <p className="font-medium">{program.organization}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">{program.location}</p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium">
                    {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Beneficiaries</p>
                  <p className="font-medium">
                    {program.currentBeneficiaries} / {program.targetBeneficiaries}
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 rounded-lg p-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(program.currentBeneficiaries / program.targetBeneficiaries) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Progress: {((program.currentBeneficiaries / program.targetBeneficiaries) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProgramsPage;
