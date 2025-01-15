# Feeding India - Child Growth Monitor

A modern web application for monitoring and analyzing children's growth patterns using WHO standards. Built with Next.js, React, Supabase, and TailwindCSS.

## Features

- **Dashboard**: Real-time overview of growth metrics and trends
- **Program Management**: Track multiple health programs and interventions
- **Growth Analysis**:
  - Population Analysis
  - Growth Trends
  - Intervention Impact
- **Data Visualization**:
  - WHO Standard Growth Charts
  - Height-for-Age Analysis
  - Weight-for-Age Analysis
- **Data Management**:
  - Individual Child Records
  - Batch Upload Functionality
  - Data Entry Forms
- **Documentation**: Comprehensive guides on WHO standards and metrics

## Growth Assessment Methods

### Height/Length Measurement

#### For Children Under 2 Years
- **Recumbent Length**: Measured lying down
- Required Equipment: Length board with fixed headpiece and movable footpiece
- Precision: Measurements recorded to nearest 0.1 cm
- Two people required for accurate measurement

#### For Children 2 Years and Older
- **Standing Height**: Measured standing upright
- Required Equipment: Stadiometer or height board
- Precision: Measurements recorded to nearest 0.1 cm
- Child should stand with:
  - Heels together
  - Shoulders level
  - Head in Frankfurt plane position

### Weight Measurement

- **Equipment**: Electronic scale with 0.1 kg precision
- **Procedure**: 
  - Zero scale before each measurement
  - Child wearing light clothing only
  - Record to nearest 0.1 kg

### Growth Standards Reference

We use the WHO Child Growth Standards (0-5 years) and WHO Growth Reference (5-19 years):

#### Key Indicators
- Length/height-for-age
- Weight-for-age
- Weight-for-length/height
- Body mass index (BMI)-for-age

#### Z-Score Classifications
- Above 3: Severely high
- Above 2: High
- 0: Median
- Below -2: Low
- Below -3: Severely low

## Technical Implementation

### Growth Chart Calculations

```typescript
interface GrowthData {
  age: number;        // Age in months
  measurement: number; // Height or weight
  zscore: number;     // Standard deviation from median
}

// Z-score calculation
const calculateZScore = (measurement: number, median: number, sd: number): number => {
  return (measurement - median) / sd;
};

// Growth velocity calculation (cm/month)
const calculateGrowthVelocity = (
  currentHeight: number,
  previousHeight: number,
  monthsDifference: number
): number => {
  return (currentHeight - previousHeight) / monthsDifference;
};
```

### WHO Data Integration

We use the following WHO growth chart data:
- `who-growth-standards.json`: Contains median and SD values for different ages
- Growth charts are generated using `react-chartjs-2`
- Data is interpolated for precise age-based calculations

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/satishskid/skidfi.git
cd skidfi
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Next.js pages and API routes
├── styles/           # Global styles and Tailwind config
├── utils/            # Helper functions and utilities
└── data/            # Data models and mock data
```

## Technologies Used

- **Frontend**: Next.js, React, TailwindCSS
- **Charts**: Chart.js
- **State Management**: React Hooks
- **Forms**: React Hook Form
- **Data Visualization**: Chart.js, WHO Growth Standards
- **Development**: TypeScript, ESLint, Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- World Health Organization for growth standards data
- React and Next.js communities
- All contributors and maintainers
