import * as XLSX from 'xlsx';

export interface WHOStandard {
  age: number;
  SD4neg: number;
  SD3neg: number;
  SD2neg: number;
  SD1neg: number;
  SD0: number;
  SD1: number;
  SD2: number;
  SD3: number;
  SD4: number;
}

export interface WHOData {
  heightBoys: WHOStandard[];
  heightGirls: WHOStandard[];
  weightBoys: WHOStandard[];
  weightGirls: WHOStandard[];
}

export async function loadWHOData(): Promise<WHOData> {
  const loadExcel = async (file: string) => {
    const response = await fetch(`/who-standards/${file}`);
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    return jsonData.map((row: any) => ({
      age: row.Month,
      SD4neg: row.SD4neg,
      SD3neg: row.SD3neg,
      SD2neg: row.SD2neg,
      SD1neg: row.SD1neg,
      SD0: row.SD0,
      SD1: row.SD1,
      SD2: row.SD2,
      SD3: row.SD3,
      SD4: row.SD4,
    }));
  };

  const [heightBoys, heightGirls, weightBoys, weightGirls] = await Promise.all([
    loadExcel('HFA_Boys.xlsx'),
    loadExcel('HFA_Girls.xlsx'),
    loadExcel('WFA_Boys.xlsx'),
    loadExcel('WFA_Girls.xlsx'),
  ]);

  return {
    heightBoys,
    heightGirls,
    weightBoys,
    weightGirls,
  };
}

export function calculateZScore(
  measurement: number,
  age: number,
  gender: 'boy' | 'girl',
  type: 'height' | 'weight'
): number {
  const standards = type === 'height'
    ? (gender === 'boy' ? heightBoys : heightGirls)
    : (gender === 'boy' ? weightBoys : weightGirls);

  const ageStandard = standards.find(s => s.age === Math.floor(age));
  if (!ageStandard) return 0;

  const median = ageStandard.SD0;
  const sd = (ageStandard.SD1 - ageStandard.SD0) / 1;

  return (measurement - median) / sd;
}

// Static data for initial load
let heightBoys: WHOStandard[] = [];
let heightGirls: WHOStandard[] = [];
let weightBoys: WHOStandard[] = [];
let weightGirls: WHOStandard[] = [];
