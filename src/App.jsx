
import React from "react"
import './App.css'
import Currentlocation from "./component/Currentlocation"
import Weeklyforecast from "./component/Weeklyforecast";
function App() {
  
 
    return (
      <>
      <div className="Main_container">
      <div className="container">
          <Currentlocation />
        </div>
        <div className="data">
<Weeklyforecast />
        </div>
      </div>
       
        
      </>
    );
  }
  
  export default App;