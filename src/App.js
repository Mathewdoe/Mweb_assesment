import React from "react";
import "./App.css";
import FibreCampaign from "./components/FibreCampaigns";
import FibreProviders from "./components/FibreProviders";
import PriceRanges from "./components/PriceRanges";
import BasicSelect from "./components/FibreCampaigns";
import DropdownExampleClearable from "./components/FibreCampaigns";
import MwebPage from "./components/FibreCampaigns";

function App() {
  return (
    <div className="App">

      <FibreCampaign /> 
      <FibreProviders /> 
      {/* <PriceRanges />  */}
      {/* <DropdownExampleClearable/> */}
        
      
      
    </div>
  );
}

export default App;
