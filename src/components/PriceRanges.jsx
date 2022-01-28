
import { useState } from "react";

const label = { inputProps: { "aria-label": "Checkbox demo" } };


function PriceRanges() {

  const priceRange = ["R0 - R699" ,"R700 - R999","R1000+"]

  const [pick,setPick]= useState()

  const handleChange = (event) => {
    setPick(event.target.value);
  };

  return (
    <>
 <div>
      <label for="cars">deal type:</label>
      <select id="cars" name="cars">
        {priceRange.map((element) => (
          <option value={element} onClick = {handleChange} >{element}</option>
        ))}
      </select>
      price picked: {pick}
    </div>
          

    </>
  );
}

export default PriceRanges;
