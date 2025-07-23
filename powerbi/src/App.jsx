import TopNavbar from "./components/TopNavbar";
import TopRibbon from "./components/TopRibbon";
import RightNavbar from "./components/RightNavbar";
import DataSourceOptions from "./components/DataSourceOptions";
import RecommendedSection from "./components/RecommendedSection";
import WorkspaceCanvas from "./components/WorkspaceCanvas";

import { DataProvider } from "../../src/contexts/DataContext";
import { VisualizationProvider } from "../../src/contexts/VisualizationContext";
import { UIProvider, useUI } from "../../src/contexts/UIContext";
import { FilterProvider } from "../../src/contexts/FilterContext";

import "./App.css";

// Main App component that wraps everything with context providers
function App() {
  return (
    <DataProvider>
      <VisualizationProvider>
        <FilterProvider>
          <UIProvider>
            <AppContent />
          </UIProvider>
        </FilterProvider>
      </VisualizationProvider>
    </DataProvider>
  );
}

// AppContent component that uses the context values
function AppContent() {
  const { activeView, setActiveView } = useUI();
  
  // Map the old showCanvas state to the new activeView state
  const showCanvas = activeView === 'canvas';
  
  const handleSelectSource = (name) => {
    if (name === "Blank report") {
      setActiveView('canvas');
    }
  };

  return (
    <>
      <TopNavbar />

      {/* Show TopRibbon only when Blank Report is active */}
      {showCanvas && <TopRibbon />}

      <div className="flex">
        {/* Show RightNavbar only if canvas is not shown */}
        {!showCanvas && (
          <div>
            <RightNavbar />
          </div>
        )}

        <div className="pt-10 pl-8">
          {!showCanvas ? (
            <>
              <DataSourceOptions onSelectSource={handleSelectSource} />
              <RecommendedSection />
            </>
          ) : (
            <WorkspaceCanvas />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
