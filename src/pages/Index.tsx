import { useState } from "react";
import AgentSidebar from "@/components/AgentSidebar";
import BottleneckWorkspace from "@/components/BottleneckWorkspace";
import ScarcityScorecard from "@/components/ScarcityScorecard";

const Index = () => {
  const [activeTool, setActiveTool] = useState("scanner");

  const sampleScores = {
    scarcity_severity: 5,
    supply_response_speed: 4,
    time_to_add_capacity: 5,
    capital_intensity: 4,
    regulatory_friction: 3,
    demand_growth: 5,
    pricing_power: 4,
    barriers_to_entry: 4,
    market_crowding: 2,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AgentSidebar activeToolId={activeTool} onToolSelect={setActiveTool} />
      <BottleneckWorkspace />
      <ScarcityScorecard scores={sampleScores} theme="AI Infrastructure Power" />
    </div>
  );
};

export default Index;
