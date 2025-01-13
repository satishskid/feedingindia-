import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useRouter } from 'next/router';
import * as XLSX from 'xlsx';

const BatchUploadPage = () => {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'validating' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadStatus('validating');
    
    try {
      const data = await readExcelFile(file);
      validateData(data);
      setPreviewData(data.slice(0, 5)); // Preview first 5 rows
      setUploadStatus('idle');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Invalid file format');
      setUploadStatus('error');
    }
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Failed to parse Excel file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  };

  const validateData = (data: any[]) => {
    const requiredColumns = [
      'Child ID', 'Name', 'Birth Date', 'Gender',
      'Measurement Date', 'Height (cm)', 'Weight (kg)'
    ];

    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));

    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile || uploadStatus === 'uploading') return;

    setUploadStatus('uploading');
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadStatus('success');
      // Redirect to program page after successful upload
      setTimeout(() => router.push('/programs'), 1500);
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Failed to upload data');
    }
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Child ID', 'Name', 'Birth Date', 'Gender', 'Measurement Date', 'Height (cm)', 'Weight (kg)', 'Notes'],
      ['CH001', 'John Doe', '2020-01-15', 'boy', '2025-01-13', '95.5', '15.2', 'Sample data'],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Children Data');
    
    // Save the template
    XLSX.writeFile(wb, 'children-data-template.xlsx');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Batch Upload Children Data</h1>

        {/* Template Download Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Download Template</h2>
          <p className="text-gray-600 mb-4">
            Use our Excel template to ensure your data is formatted correctly. The template includes:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Required columns with correct formatting</li>
            <li>Sample data for reference</li>
            <li>Data validation rules</li>
          </ul>
          <button
            onClick={downloadTemplate}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Download Excel Template
          </button>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Upload Data</h2>
          
          <div className="mb-6">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:bg-blue-100 transition-colors w-full"
            >
              <div className="text-4xl mb-2">📄</div>
              <p className="text-blue-600 font-medium">Click to select Excel file</p>
              <p className="text-sm text-gray-500">or drag and drop</p>
            </label>
          </div>

          {uploadStatus === 'error' && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
              {errorMessage}
            </div>
          )}

          {previewData && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">Preview (First 5 rows)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(previewData[0]).map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value: any, i) => (
                          <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {uploadedFile && (
            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                disabled={uploadStatus === 'uploading'}
                className={`px-4 py-2 rounded-lg text-white ${
                  uploadStatus === 'uploading'
                    ? 'bg-gray-400'
                    : uploadStatus === 'success'
                    ? 'bg-green-500'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {uploadStatus === 'uploading'
                  ? 'Uploading...'
                  : uploadStatus === 'success'
                  ? 'Success!'
                  : 'Upload Data'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BatchUploadPage;
