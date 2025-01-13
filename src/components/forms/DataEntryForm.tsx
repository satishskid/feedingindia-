import React, { useState } from 'react';
import { useChildData } from '@/hooks/useChildData';

interface FormData {
  age: number;
  height: number;
  weight: number;
  gender: 'boy' | 'girl';
}

const initialFormData: FormData = {
  age: 0,
  height: 0,
  weight: 0,
  gender: 'boy',
};

const DataEntryForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { addChildData, isLoading } = useChildData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addChildData({
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error adding child data:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gender' ? value : Number(value),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Age (months)
        </label>
        <input
          type="number"
          name="age"
          id="age"
          min="0"
          max="60"
          required
          value={formData.age}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Height (cm)
        </label>
        <input
          type="number"
          name="height"
          id="height"
          step="0.1"
          required
          value={formData.height}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Weight (kg)
        </label>
        <input
          type="number"
          name="weight"
          id="weight"
          step="0.1"
          required
          value={formData.weight}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Gender
        </label>
        <select
          name="gender"
          id="gender"
          required
          value={formData.gender}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="boy">Boy</option>
          <option value="girl">Girl</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Data'}
      </button>
    </form>
  );
};

export default DataEntryForm;
