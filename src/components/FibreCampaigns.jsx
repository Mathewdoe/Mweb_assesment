import { useState, useEffect } from "react";
import PriceRanges from "./PriceRanges";


function FibreCampaigns() {


    const [data, setData] = useState([]);
    const [pick,setPick] = useState();

    const handleChange = (event) => {
        setPick(event.target.value);
      };


    useEffect(() => {
        const fetchLocation = async () => {
          await fetch(
            "https://apigw.mweb.co.za/prod/baas/proxy/marketing/campaigns/fibre?channels=120&visibility=public"
          )
            .then((res) => res.json())
            .then((data) => {
              setData(data);
              console.log(data);
            });
        };
        fetchLocation();
      }, []);

  return (
    <div>
      <label for="cars">Choose Provider:</label>
      <select id="cars" name="cars">
        {data && data.campaigns && data.campaigns.map((element) => (
          <option value={element.name} onClick = {handleChange} >{element.name}</option>
        ))}
      </select>
     
      you picked: {pick}
     <PriceRanges />
    </div>
  );
}

export default FibreCampaigns;
