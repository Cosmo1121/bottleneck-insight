import { useState } from "react";
import AgentSidebar from "@/components/AgentSidebar";
import BottleneckWorkspace from "@/components/BottleneckWorkspace";
import HeatmapWorkspace from "@/components/HeatmapWorkspace";
import MapperWorkspace from "@/components/MapperWorkspace";
import PortfolioWorkspace from "@/components/PortfolioWorkspace";
import MonitorWorkspace from "@/components/MonitorWorkspace";
import ScarcityScorecard from "@/components/ScarcityScorecard";

const Index = () => {
  const [activeTool, setActiveTool] = useState("scanner");
  const [scores, setScores] = useState({
    scarcity_severity: 5,
    supply_response_speed: 4,
    time_to_add_capacity: 5,
    capital_intensity: 4,
    regulatory_friction: 3,
    demand_growth: 5,
    pricing_power: 4,
    barriers_to_entry: 4,
    market_crowding: 2,
  });

  const renderWorkspace = () => {
    switch (activeTool) {
      case "scanner":
        return <BottleneckWorkspace />;
      case "heatmap":
        return <HeatmapWorkspace scores={scores} onScoresChange={setScores} />;
      case "mapper":
        return <MapperWorkspace />;
      case "portfolio":
        return <PortfolioWorkspace />;
      case "monitor":
        return <MonitorWorkspace />;
      default:
        return <BottleneckWorkspace />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AgentSidebar activeToolId={activeTool} onToolSelect={setActiveTool} />
      {renderWorkspace()}
      <ScarcityScorecard scores={scores} theme="AI Infrastructure Power" />
    </div>
  );
};

export default Index;
