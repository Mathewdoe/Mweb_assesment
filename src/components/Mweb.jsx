import { useEffect, useState } from "react";
import { Container, Form, Row, Col, Card } from "react-bootstrap";
import logos from '../logo/logo.json';

const priceRanges = [
  { min: 0, max: 699, label: "R0 - R699" },
  { min: 700, max: 999, label: "R700 - R999" },
  { min: 1000, max: 10000, label: "R1000+" },
];

const BASE_URL = "https://apigw.mweb.co.za/prod/baas/proxy";

function Mweb() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState();
  const [products, setProducts] = useState([]);
  
  const [filterPriceRange, setFilterPriceRange] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${BASE_URL}/marketing/campaigns/fibre?channels=120&visibility=public`
      )
        .then((res) => res.json())
        .then((data) => {
          setCampaigns(data.campaigns);
          setSelectedCampaign(data.campaigns[0]);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedCampaign) {
      return;
    }
    setProviders([]);
    setProducts([]);
    fetch(
      `${BASE_URL}/marketing/products/promos/${selectedCampaign.promocodes.join(
        ","
      )}?sellable_online=true`
    )
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item) => {
          item.products.forEach((product) => {
            setProducts((state) => [...state, product]);
            setProviders((state) => {
              if (state.includes(product.subcategory)) {
                return state;
              }
              return [...state, product.subcategory];
            });
          });
        });
      });
  }, [selectedCampaign]);

  return (
    <Container className="p-4">
      {selectedCampaign && products ? (
        <>
          <Row>
            <h2 className="text-center">Fiber products</h2>
            <p className="text-center">
              Select a Fiber infrastructure provider below, browse the{" "}
            </p>
            {logos.map((logo) => (
              <Col
                key={logo.name}
                onClick={() =>
                  setSelectedProviders((state) => {
                    if (state.includes(logo.name)) {
                      return state.filter(({ name }) => name === logo.name);
                    }
                    return [...state, logo.name];
                  })
                }
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  style={{
                    maxWidth: "60px",
                    maxHeight: "60px",
                    opacity: selectedProviders.includes(logo.name) ? 1 : 0.5,
                  }}
                />
              </Col>
            ))}
          </Row>
          <Form.Select
            aria-label="Select Campaign"
            onChange={(e) => setSelectedCampaign(campaigns[e.target.value])}
          >
            {campaigns.map((campaign, i) => (
              <option key={i} value={i}>
                {campaign.name}
              </option>
            ))}
          </Form.Select>
          <PriceRange setFilterPriceRange={setFilterPriceRange} />
          <Row xs={1} md={2} className="g-4">
            {filterProducts(filterPriceRange, selectedProviders, products).map(
              (product) => (
                <ProductCard
                  key={product.productName}
                  product={product}
                  selectedCampaign={selectedCampaign}
                />
              )
            )}
          </Row>
        </>
      ) : (
        <h1>Loading</h1>
      )}
    </Container>
  );
}

function PriceRange({ setFilterPriceRange }) {
  return (
    <div className="mb-3">
      {priceRanges.map((priceRange, index) => (
        <Form.Check
          inline
          label={priceRange.label}
          key={index}
          type="checkbox"
          onChange={() => {
            setFilterPriceRange((state) => {
              if (state.includes(priceRange)) {
                return state.filter(({ label }) => label !== priceRange.label);
              }
              return [...state, priceRange];
            });
          }}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, selectedCampaign }) {
  return (
    <Col>
      <Card
        style={{
          boxShadow:
            "0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)",
        }}
      >
        <Card.Body>
          <h5>
            {product.friendlyName === ""
              ? `${formatLineSpeed(
                  product.parameters.find((p) => p.name === "downloadSpeed")
                    .value
                )} ${product.productName}`
              : product.friendlyName}
          </h5>
          <Col>
            {product.parameters.find((p) => p.name === "isThrottled")
              ? product.parameters.find((p) => p.name === "isThrottled").value
              : ""}
            <br />
            {selectedCampaign.name}
            <h4>R{product.productRate}pm</h4>
          </Col>
          <Col>
            {/* <Row> */}
            <Col>
              Download{" "}
              {formatLineSpeed(
                product.parameters.find((p) => p.name === "downloadSpeed").value
              )}
            </Col>
            <Col>
              Upload{" "}
              {formatLineSpeed(
                product.parameters.find((p) => p.name === "uploadSpeed").value
              )}
            </Col>
            <img src={getLogo(product.subcategory)} alt={product.subcategory} />
          </Col>
        </Card.Body>
      </Card>
    </Col>
  );
}

function formatLineSpeed(speed) {
  const mb = 1024;
  const speedInMBPS = parseInt(speed.split(" KBPS")[0]) / mb;

  return `${speedInMBPS}Mbps`;
}

function filterProducts(priceRange, selectedProviders, products) {
  let arr = [];
  if (priceRange.length > 0) {
    priceRange.forEach((range) =>
      products.forEach((p) => {
        if (p.productRate > range.min && p.productRate <= range.max) {
          arr.push(p);
        }
      })
    );
  } else {
    arr = products;
  }
  if (selectedProviders && selectedProviders.length > 0) {
    arr = arr.filter(({ subcategory }) =>
      selectedProviders.includes(subcategory)
    );
  }

  arr.sort((a, b) => a.productRate - b.productRate);
  return arr;
}

function getLogo(logoName) {
  let logo = logos.find(({ name }) => name === logoName);
  return logo ? logo.url : "";
}

export default Mweb;
