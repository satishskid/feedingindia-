import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Intervention, GrowthMeasurement } from '../types/interventions';
import { calculateGrowthVelocity, calculateEffectSize, tTest } from './statistics';
import { calculateSeasonalEffects, calculateCatchUpIndex } from './advancedStatistics';

interface ExportOptions {
  format: 'pdf' | 'csv' | 'excel';
  includeCharts?: boolean;
  includeStatistics?: boolean;
  includeRawData?: boolean;
}

export async function exportReport(
  intervention: Intervention,
  measurements: GrowthMeasurement[],
  whoStandards: any,
  options: ExportOptions
): Promise<Blob | string> {
  switch (options.format) {
    case 'pdf':
      return exportPDF(intervention, measurements, whoStandards, options);
    case 'csv':
      return exportCSV(intervention, measurements, whoStandards, options);
    case 'excel':
      return exportExcel(intervention, measurements, whoStandards, options);
    default:
      throw new Error('Unsupported export format');
  }
}

async function exportPDF(
  intervention: Intervention,
  measurements: GrowthMeasurement[],
  whoStandards: any,
  options: ExportOptions
): Promise<Blob> {
  const doc = new jsPDF();
  let yPos = 20;

  // Title
  doc.setFontSize(20);
  doc.text('Intervention Impact Report', 20, yPos);
  yPos += 15;

  // Intervention Details
  doc.setFontSize(14);
  doc.text('Intervention Details', 20, yPos);
  yPos += 10;
  doc.setFontSize(12);
  doc.text(`Type: ${intervention.type}`, 30, yPos);
  yPos += 7;
  doc.text(`Period: ${intervention.startDate} to ${intervention.endDate}`, 30, yPos);
  yPos += 7;
  doc.text(`Status: ${intervention.status}`, 30, yPos);
  yPos += 7;
  doc.text('Description:', 30, yPos);
  yPos += 7;
  const descriptionLines = doc.splitTextToSize(intervention.description, 150);
  doc.text(descriptionLines, 40, yPos);
  yPos += descriptionLines.length * 7 + 10;

  if (options.includeStatistics) {
    // Statistical Analysis
    doc.setFontSize(14);
    doc.text('Statistical Analysis', 20, yPos);
    yPos += 10;
    doc.setFontSize(12);

    // Growth Velocity
    const heightVelocity = calculateGrowthVelocity(measurements, 'height');
    const weightVelocity = calculateGrowthVelocity(measurements, 'weight');
    doc.text(`Height Velocity: ${heightVelocity.toFixed(2)} cm/month`, 30, yPos);
    yPos += 7;
    doc.text(`Weight Velocity: ${weightVelocity.toFixed(2)} kg/month`, 30, yPos);
    yPos += 10;

    // Statistical Tests
    const heightStats = tTest(
      measurements.slice(0, Math.floor(measurements.length / 2)).map(m => m.height),
      measurements.slice(Math.floor(measurements.length / 2)).map(m => m.height)
    );
    const weightStats = tTest(
      measurements.slice(0, Math.floor(measurements.length / 2)).map(m => m.weight),
      measurements.slice(Math.floor(measurements.length / 2)).map(m => m.weight)
    );

    doc.text('Statistical Significance:', 30, yPos);
    yPos += 7;
    doc.text(`Height: p=${heightStats.pValue.toFixed(4)} (${heightStats.significant ? 'Significant' : 'Not Significant'})`, 40, yPos);
    yPos += 7;
    doc.text(`Weight: p=${weightStats.pValue.toFixed(4)} (${weightStats.significant ? 'Significant' : 'Not Significant'})`, 40, yPos);
    yPos += 10;

    // Seasonal Effects
    const seasonalEffects = calculateSeasonalEffects(measurements, 'height');
    doc.text('Seasonal Growth Patterns:', 30, yPos);
    yPos += 7;
    doc.text(`Spring: ${seasonalEffects.springGrowth.toFixed(2)}`, 40, yPos);
    yPos += 7;
    doc.text(`Summer: ${seasonalEffects.summerGrowth.toFixed(2)}`, 40, yPos);
    yPos += 7;
    doc.text(`Fall: ${seasonalEffects.fallGrowth.toFixed(2)}`, 40, yPos);
    yPos += 7;
    doc.text(`Winter: ${seasonalEffects.winterGrowth.toFixed(2)}`, 40, yPos);
    yPos += 10;
  }

  if (options.includeRawData) {
    // Raw Data Table
    doc.addPage();
    (doc as any).autoTable({
      head: [['Date', 'Age (months)', 'Height (cm)', 'Weight (kg)']],
      body: measurements.map(m => [
        m.date,
        m.age.toString(),
        m.height.toString(),
        m.weight.toString()
      ]),
      startY: 20,
      margin: { top: 20 },
    });
  }

  return doc.output('blob');
}

function exportCSV(
  intervention: Intervention,
  measurements: GrowthMeasurement[],
  whoStandards: any,
  options: ExportOptions
): string {
  let csv = 'Intervention Impact Report\n\n';

  // Intervention Details
  csv += 'Intervention Details\n';
  csv += `Type,${intervention.type}\n`;
  csv += `Start Date,${intervention.startDate}\n`;
  csv += `End Date,${intervention.endDate}\n`;
  csv += `Status,${intervention.status}\n`;
  csv += `Description,${intervention.description}\n\n`;

  if (options.includeStatistics) {
    // Statistical Analysis
    csv += 'Statistical Analysis\n';
    const heightVelocity = calculateGrowthVelocity(measurements, 'height');
    const weightVelocity = calculateGrowthVelocity(measurements, 'weight');
    csv += `Height Velocity (cm/month),${heightVelocity.toFixed(2)}\n`;
    csv += `Weight Velocity (kg/month),${weightVelocity.toFixed(2)}\n\n`;

    // Seasonal Effects
    const seasonalEffects = calculateSeasonalEffects(measurements, 'height');
    csv += 'Seasonal Growth Patterns\n';
    csv += `Spring,${seasonalEffects.springGrowth.toFixed(2)}\n`;
    csv += `Summer,${seasonalEffects.summerGrowth.toFixed(2)}\n`;
    csv += `Fall,${seasonalEffects.fallGrowth.toFixed(2)}\n`;
    csv += `Winter,${seasonalEffects.winterGrowth.toFixed(2)}\n\n`;
  }

  if (options.includeRawData) {
    // Raw Data
    csv += 'Raw Measurements\n';
    csv += 'Date,Age (months),Height (cm),Weight (kg)\n';
    measurements.forEach(m => {
      csv += `${m.date},${m.age},${m.height},${m.weight}\n`;
    });
  }

  return csv;
}

async function exportExcel(
  intervention: Intervention,
  measurements: GrowthMeasurement[],
  whoStandards: any,
  options: ExportOptions
): Promise<Blob> {
  // This would use a library like xlsx to create Excel files
  // For now, we'll return the CSV as a blob
  const csv = exportCSV(intervention, measurements, whoStandards, options);
  return new Blob([csv], { type: 'text/csv' });
}

// Helper function to generate charts as images
async function generateChartImage(
  chartData: any,
  width: number,
  height: number
): Promise<string> {
  // This would use Chart.js to render charts to canvas and convert to base64
  // Implementation depends on the charting library being used
  return '';
}
