import FormControlLabel from "@mui/material/FormControlLabel";
// import FormControl from "@mui/material/FormControl";
// import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
// import CheckboxLabels from "./FibreProviders";
// import FibreCampaign from "./FibreCampaing";
import { useState, useEffect } from "react";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

function FibreProviders() {
  const [data, setData] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchLocation = async () => {
      await fetch(
        "https://apigw.mweb.co.za/prod/baas/proxy/marketing/products/promos/FTTH-MITCHELLS-PREPAID-AMBER,VUMA-REACH-RECURRING,VUMA-REACH-28DAY-SERVICE,VUMA-REACH-28DAY-SERVICE-40MBPS?sellable_online=true"
      )
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          console.log(data);
        });
    };
    fetchLocation();
  }, []);
  useEffect(() => {
    let products = [];
    data.forEach((thedata) =>
      thedata.products.forEach((realdata) => products.push(realdata))
    );
    setProviders(newData(products));
    console.log(newData(products));
  }, [data]);

  function newData(array) {
    console.log(array)
    return Array.from(new Set(array));
  }

  return (
    <>
      <div className="FibreProviders">
        <h3>Fibre Providers</h3>
        {data &&
          data.map((thedata) =>
            thedata.products.map((realdata) =>
              (
                <FormControlLabel
                  control={<Checkbox />}
                  label={realdata.subcategory}
                  value={realdata.subcategory}
                />
              ) 
            )
          )}

        <p>Select the fibre providers for which products should be displayed</p>
      </div>
    </>
  );
}

export default FibreProviders;
