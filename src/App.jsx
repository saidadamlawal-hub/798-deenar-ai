import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

export default function App() {

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [pair, setPair] = useState("AUTO");
  const [timeframe, setTimeframe] = useState("AUTO");
  const [tradeStyle, setTradeStyle] = useState("INTRADAY");

  const [backtestMode, setBacktestMode] = useState(false);

  const [useDeterministic, setUseDeterministic] = useState(false);

  const [useLivePrice, setUseLivePrice] = useState(false);

  const [result, setResult] = useState(null);

  async function handleImage(e) {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  }

  async function scanChart() {

    if (!preview) {
      alert("Upload chart image first");
      return;
    }

    setLoading(true);
    setResult(null);

    try {

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const prompt = `
You are an elite institutional trading AI.

Analyze this forex or gold trading chart professionally.

Rules:
- Think like smart money / institutional trader
- Use SMC concepts
- Detect:
  trend
  momentum
  liquidity
  BOS
  CHOCH
  volatility
  manipulation
  premium/discount

Settings:
PAIR: ${pair}
TIMEFRAME: ${timeframe}
TRADE STYLE: ${tradeStyle}

BACKTEST MODE:
${backtestMode ? "ON" : "OFF"}

DETERMINISTIC ENGINE:
${useDeterministic ? "ON" : "OFF"}

LIVE PRICE ENGINE:
${useLivePrice ? "ON" : "OFF"}

Return STRICT JSON only.

Format:

{
  "pair": "",
  "timeframe": "",
  "signal": "",
  "confidence": 0,
  "entry": "",
  "stopLoss": "",
  "tp1": "",
  "tp2": "",
  "tp3": "",
  "riskReward": "",
  "volatility": "",
  "setupQuality": "",
  "analysis": {
    "trend": "",
    "structure": "",
    "liquidity": "",
    "momentum": "",
    "volatility": "",
    "execution": ""
  },
  "smc": {
    "marketStructure": "",
    "orderBlocks": "",
    "fvg": "",
    "liquidityZones": "",
    "bosChoch": "",
    "premiumDiscount": "",
    "manipulation": ""
  },
  "factors": {
    "trendStrength": 0,
    "momentum": 0,
    "liquidity": 0,
    "structure": 0,
    "volatility": 0
  }
}
`;

      const imageData = preview.split(",")[1];

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/png",
            data: imageData,
          },
        },
      ]);

      const response = await result.response;

      let text = response.text();

      text = text.replace(/```json/g, "");
      text = text.replace(/```/g, "");

      const parsed = JSON.parse(text);

      setResult(parsed);

    } catch (err) {

      console.log(err);

      alert("AI analysis failed");

    }

    setLoading(false);
  }

  function FactorBar({ label, value }) {

    return (
      <div style={{ marginBottom: 14 }}>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span>{label}</span>
          <span>{value}%</span>
        </div>

        <div
          style={{
            width: "100%",
            height: 10,
            background: "#222",
            borderRadius: 20,
          }}
        >
          <div
            style={{
              width: `${value}%`,
              height: "100%",
              background: "#D4AF37",
              borderRadius: 20,
            }}
          />
        </div>

      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050816",
        color: "white",
        padding: 16,
        fontFamily: "sans-serif",
      }}
    >

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >

        <h1
          style={{
            color: "#D4AF37",
            fontSize: 34,
            fontWeight: "bold",
          }}
        >
          798 Deenar AI
        </h1>

        <p style={{ color: "#999" }}>
          Institutional AI Trading Scanner
        </p>

        <div
          style={{
            background: "#111827",
            border: "1px solid #D4AF37",
            borderRadius: 20,
            padding: 20,
            marginTop: 20,
          }}
        >

          <h2>Scanner Settings</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 20,
            }}
          >

            <select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              style={selectStyle}
            >
              <option>AUTO</option>
              <option>XAUUSD</option>
              <option>EURUSD</option>
              <option>GBPUSD</option>
              <option>BTCUSD</option>
            </select>

            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              style={selectStyle}
            >
              <option>AUTO</option>
              <option>M1</option>
              <option>M5</option>
              <option>M15</option>
              <option>M30</option>
              <option>H1</option>
              <option>H4</option>
              <option>D1</option>
            </select>

            <select
              value={tradeStyle}
              onChange={(e) => setTradeStyle(e.target.value)}
              style={selectStyle}
            >
              <option>SCALPING</option>
              <option>INTRADAY</option>
              <option>SWING</option>
              <option>POSITION</option>
              <option>AUTO</option>
            </select>

          </div>

          <div style={{ marginTop: 20 }}>

            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={backtestMode}
                onChange={() =>
                  setBacktestMode(!backtestMode)
                }
              />
              Backtest Mode
            </label>

            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={useDeterministic}
                onChange={() =>
                  setUseDeterministic(!useDeterministic)
                }
              />
              Deterministic Engine
            </label>

            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={useLivePrice}
                onChange={() =>
                  setUseLivePrice(!useLivePrice)
                }
              />
              Live Price Engine
            </label>

          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{
              marginTop: 20,
              width: "100%",
            }}
          />

          {preview && (
            <img
              src={preview}
              alt=""
              style={{
                width: "100%",
                maxHeight: 400,
                objectFit: "contain",
                marginTop: 20,
                borderRadius: 20,
                border: "1px solid #D4AF37",
              }}
            />
          )}

          <button
            onClick={scanChart}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 20,
              background: "#D4AF37",
              color: "black",
              border: "none",
              padding: 16,
              borderRadius: 20,
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            {loading ? "Analyzing..." : "Scan Chart"}
          </button>

        </div>

        {result && (

          <div
            style={{
              marginTop: 24,
              background: "#111827",
              borderRadius: 20,
              border: "1px solid #D4AF37",
              padding: 20,
            }}
          >

            <h2
              style={{
                color: "#D4AF37",
                marginBottom: 20,
              }}
            >
              AI Trade Signal
            </h2>

            <div style={gridStyle}>

              <Card title="PAIR" value={result.pair} />
              <Card title="TIMEFRAME" value={result.timeframe} />
              <Card title="SIGNAL" value={result.signal} />
              <Card title="CONFIDENCE" value={`${result.confidence}%`} />
              <Card title="ENTRY" value={result.entry} />
              <Card title="STOP LOSS" value={result.stopLoss} />
              <Card title="TP1" value={result.tp1} />
              <Card title="TP2" value={result.tp2} />
              <Card title="TP3" value={result.tp3} />
              <Card title="R:R" value={result.riskReward} />
              <Card title="VOLATILITY" value={result.volatility} />
              <Card title="QUALITY" value={result.setupQuality} />

            </div>

            <div style={sectionStyle}>

              <h3 style={titleStyle}>
                Analyst Narrative
              </h3>

              <p>📈 {result.analysis?.trend}</p>
              <p>🏗 {result.analysis?.structure}</p>
              <p>💧 {result.analysis?.liquidity}</p>
              <p>⚡ {result.analysis?.momentum}</p>
              <p>🌪 {result.analysis?.volatility}</p>
              <p>🎯 {result.analysis?.execution}</p>

            </div>

            <div style={sectionStyle}>

              <h3 style={titleStyle}>
                Smart Money Concepts
              </h3>

              <p>🏛 {result.smc?.marketStructure}</p>
              <p>📦 {result.smc?.orderBlocks}</p>
              <p>🌀 {result.smc?.fvg}</p>
              <p>💰 {result.smc?.liquidityZones}</p>
              <p>🔄 {result.smc?.bosChoch}</p>
              <p>⚖️ {result.smc?.premiumDiscount}</p>
              <p>🎭 {result.smc?.manipulation}</p>

            </div>

            <div style={sectionStyle}>

              <h3 style={titleStyle}>
                Confidence Factors
              </h3>

              <FactorBar
                label="Trend Strength"
                value={result.factors?.trendStrength || 0}
              />

              <FactorBar
                label="Momentum"
                value={result.factors?.momentum || 0}
              />

              <FactorBar
                label="Liquidity"
                value={result.factors?.liquidity || 0}
              />

              <FactorBar
                label="Structure"
                value={result.factors?.structure || 0}
              />

              <FactorBar
                label="Volatility"
                value={result.factors?.volatility || 0}
              />

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

function Card({ title, value }) {

  return (
    <div
      style={{
        background: "#050816",
        border: "1px solid #D4AF37",
        borderRadius: 16,
        padding: 14,
      }}
    >

      <div
        style={{
          color: "#888",
          fontSize: 12,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 8,
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        {value}
      </div>

    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};

const sectionStyle = {
  marginTop: 30,
};

const titleStyle = {
  color: "#D4AF37",
  marginBottom: 16,
};

const selectStyle = {
  background: "#050816",
  color: "white",
  border: "1px solid #D4AF37",
  borderRadius: 12,
  padding: 12,
};

const toggleStyle = {
  display: "block",
  marginBottom: 12,
};
