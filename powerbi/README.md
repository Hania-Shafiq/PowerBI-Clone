# Power BI Clone

A comprehensive Power BI clone built with React, featuring data loading, visualization, filtering, and dashboard capabilities.

## Features

- **Data Loading**
  - Excel file import
  - SQL database connectivity
  - Sample data for testing

- **Data Visualization**
  - Bar charts
  - Line charts
  - Pie charts
  - Data tables
  - KPI cards

- **Interactive Features**
  - Filtering
  - Cross-filtering
  - Drill-down
  - Date range selection

- **Dashboard Layout**
  - Drag and drop interface
  - Resizable visualizations
  - Dashboard saving/loading
  - Export/import capabilities

## Project Structure

```
powerbi/
├── docs/                    # Documentation
│   ├── architecture-plan.md
│   ├── implementation-plan.md
│   ├── implementation-roadmap.md
│   ├── sample-data.md
│   ├── sql-connectivity.md
│   ├── visualization-components.md
│   ├── filtering-interaction.md
│   └── dashboard-layout.md
├── public/                  # Public assets
├── src/                     # Source code
│   ├── contexts/            # React contexts for state management
│   ├── components/          # React components
│   │   ├── data/            # Data-related components
│   │   ├── visualizations/  # Visualization components
│   │   ├── filters/         # Filtering components
│   │   └── dashboard/       # Dashboard components
│   ├── utils/               # Utility functions
│   ├── assets/              # Assets (images, icons, etc.)
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Entry point
└── sample-data/             # Sample data files for testing
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd powerbi
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Implementation Guide

This project is designed to be implemented in phases. Follow these steps to implement the Power BI clone:

1. **Set up the project structure**
   - Review the documentation in the `docs/` directory
   - Set up the basic project structure

2. **Install required libraries**
   ```bash
   npm install xlsx papaparse sql.js recharts react-grid-layout lodash date-fns lucide-react
   ```

3. **Implement state management**
   - Create the context providers as described in `docs/implementation-plan.md`

4. **Implement data loading**
   - Start with Excel file loading
   - Add SQL database connectivity

5. **Add visualization components**
   - Implement basic charts (bar, line, pie)
   - Add data tables and KPI cards

6. **Implement filtering and interaction**
   - Add global and visualization-specific filters
   - Implement cross-filtering and drill-down

7. **Create dashboard layout**
   - Implement drag and drop functionality
   - Add dashboard saving/loading

8. **Polish and finalize**
   - Add final touches
   - Optimize performance

For detailed implementation instructions, refer to the documentation in the `docs/` directory.

## Documentation

- [Architecture Plan](docs/architecture-plan.md): High-level architecture of the application
- [Implementation Plan](docs/implementation-plan.md): Detailed implementation steps
- [Implementation Roadmap](docs/implementation-roadmap.md): Timeline and strategy for implementation
- [Sample Data](docs/sample-data.md): Sample data structure for testing
- [SQL Connectivity](docs/sql-connectivity.md): Implementation details for SQL database connectivity
- [Visualization Components](docs/visualization-components.md): Implementation details for visualization components
- [Filtering and Interaction](docs/filtering-interaction.md): Implementation details for filtering and interaction capabilities
- [Dashboard Layout](docs/dashboard-layout.md): Implementation details for dashboard layout system

## Technologies Used

- **React**: UI library
- **Vite**: Build tool
- **TailwindCSS**: Styling
- **xlsx**: Excel file parsing
- **sql.js**: SQL database support
- **recharts**: Chart visualization
- **react-grid-layout**: Dashboard layout
- **lodash**: Utility functions
- **date-fns**: Date manipulation
- **lucide-react**: Icons

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Microsoft Power BI
- Built with React and modern web technologies
