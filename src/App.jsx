
import React from "react"
import './App.css'
import Currentlocation from "./component/Currentlocation"
import Weeklyforecast from "./component/Weeklyforecast";
function App() {
  
 
    return (
      <>
      <div>
      <div className="w-[65%] h-[90vh] m-auto mt-10 bg-black bg-opacity-73 lg:mb-1 mb-[600px] ">
          <Currentlocation />
        </div>
        <div className="text-white">
<Weeklyforecast />
        </div>
      </div>
       
        
      </>
    );
  }
  
  export default App;