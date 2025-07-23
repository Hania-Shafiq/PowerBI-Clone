import { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [activeView, setActiveView] = useState('home'); // 'home', 'canvas', 'data'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanels, setActivePanels] = useState({
    dataFields: true,
    visualizations: true,
    filters: true,
    properties: false
  });
  
  // Toggle a panel
  const togglePanel = (panelName) => {
    setActivePanels(prev => ({
      ...prev,
      [panelName]: !prev[panelName]
    }));
  };
  
  // Open a panel
  const openPanel = (panelName) => {
    setActivePanels(prev => ({
      ...prev,
      [panelName]: true
    }));
  };
  
  // Close a panel
  const closePanel = (panelName) => {
    setActivePanels(prev => ({
      ...prev,
      [panelName]: false
    }));
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  return (
    <UIContext.Provider value={{
      activeView,
      setActiveView,
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      activePanels,
      togglePanel,
      openPanel,
      closePanel
    }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);