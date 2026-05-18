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
  const [tradeType, setTradeType] = useState("INTRADAY");

  const [useGemini, setUseGemini] = useState(true);
  const [useDeterministic, setUseDeterministic] = useState(false);
  const [useLivePrice, setUseLivePrice] = useState(false);
  const [backtestMode, setBacktestMode] = useState(false);

  const [result, setResult] = useState(null);

  async function analyzeChart() {

    if (!preview) {
      alert("Upload chart first");
      return;
    }

    setLoading(true);
    setResult(null);

    try {

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      const prompt = `
You are an elite institutional forex analyst.

Analyze this chart professionally.

Return STRICT JSON only.

{
  "pair": "",
  "timeframe": "",
  "signal": "BUY or SELL or HOLD",
  "confidence": 0,
  "entry": "",
  "sl": "",
  "tp1": "",
  "tp2": "",
  "tp3": "",
  "riskReward": "",
  "volatility": "",
  "trend": "",
  "structure": "",
  "liquidity": "",
  "momentum": "",
  "narrative": "",
  "bos": "",
  "choch": "",
  "fvg": "",
  "orderBlock": ""
}

Rules:

- Detect pair automatically if AUTO
- Detect timeframe automatically if AUTO
- Use Smart Money Concepts
- Use institutional analysis
- Use liquidity concepts
- Detect BOS and CHOCH
- Detect volatility
- Detect momentum
- Generate realistic targets
- Never hallucinate impossible prices
- Use current visible chart prices
- Trade type:
${tradeType}

Selected Pair:
${pair}

Selected Timeframe:
${timeframe}

Backtest Mode:
${backtestMode}
`;

      const imagePart = {
        inlineData: {
          data: preview.split(",")[1],
          mimeType: "image/png",
        },
      };

      const response = await model.generateContent([
        prompt,
        imagePart,
      ]);

      const text = response.response.text();

      const clean = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(clean);

      setResult(parsed);

    } catch (err) {

      console.log(err);

      alert("AI analysis failed");

    }

    setLoading(false);
  }

  function handleImage(e) {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  }

  return (
    <div
      style={{
        background: "#0b1020",
        minHeight: "100vh",
        color: "white",
        padding: 20,
        fontFamily: "sans-serif",
      }}
    >

      <h1
        style={{
          color: "#D4AF37",
          fontSize: 32,
          fontWeight: "bold",
        }}
      >
        798 Deenar AI
      </h1>

      <p style={{ color: "#aaa" }}>
        Institutional AI Market Scanner
      </p>

      <div
        style={{
          marginTop: 20,
          background: "#111827",
          border: "1px solid #D4AF37",
          borderRadius: 20,
          padding: 20,
        }}
      >

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
        />

        <div style={{ marginTop: 20 }}>

          <select
            value={pair}
            onChange={(e) => setPair(e.target.value)}
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
            style={{ marginLeft: 10 }}
          >
            <option>AUTO</option>
            <option>M1</option>
            <option>M5</option>
            <option>M15</option>
            <option>H1</option>
            <option>H4</option>
            <option>D1</option>
          </select>

          <select
            value={tradeType}
            onChange={(e) => setTradeType(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            <option>SCALPING</option>
            <option>INTRADAY</option>
            <option>SWING</option>
            <option>POSITION</option>
          </select>

        </div>

        <div style={{ marginTop: 20 }}>

          <label>
            <input
              type="checkbox"
              checked={useGemini}
              onChange={() => setUseGemini(!useGemini)}
            />
            Gemini Vision
          </label>

          <br />

          <label>
            <input
              type="checkbox"
              checked={useDeterministic}
              onChange={() =>
                setUseDeterministic(!useDeterministic)
              }
            />
            Deterministic Engine
          </label>

          <br />

          <label>
            <input
              type="checkbox"
              checked={useLivePrice}
              onChange={() =>
                setUseLivePrice(!useLivePrice)
              }
            />
            Live Price Engine
          </label>

          <br />

          <label>
            <input
              type="checkbox"
              checked={backtestMode}
              onChange={() =>
                setBacktestMode(!backtestMode)
              }
            />
            Backtest Mode
          </label>

        </div>

        {preview && (

          <img
            src={preview}
            alt=""
            style={{
              width: "100%",
              marginTop: 20,
              borderRadius: 20,
              maxHeight: 400,
              objectFit: "contain",
              border: "1px solid #D4AF37",
            }}
          />

        )}

        <button
          onClick={analyzeChart}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 20,
            background: "#D4AF37",
            color: "black",
            border: "none",
            padding: 16,
            borderRadius: 16,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {loading ? "Analyzing..." : "Scan Market"}
        </button>

      </div>

      {result && (

        <div
          style={{
            marginTop: 30,
            background: "#111827",
            padding: 20,
            borderRadius: 20,
            border: "1px solid #D4AF37",
          }}
        >

          <h2 style={{ color: "#D4AF37" }}>
            AI Trade Signal
          </h2>

          <p>PAIR: {result.pair}</p>
          <p>TIMEFRAME: {result.timeframe}</p>
          <p>SIGNAL: {result.signal}</p>
          <p>CONFIDENCE: {result.confidence}%</p>
          <p>ENTRY: {result.entry}</p>
          <p>STOP LOSS: {result.sl}</p>
          <p>TP1: {result.tp1}</p>
          <p>TP2: {result.tp2}</p>
          <p>TP3: {result.tp3}</p>
          <p>R:R: {result.riskReward}</p>
          <p>VOLATILITY: {result.volatility}</p>

          <hr />

          <h3>Institutional Analysis</h3>

          <p>{result.narrative}</p>

          <p>BOS: {result.bos}</p>
          <p>CHOCH: {result.choch}</p>
          <p>FVG: {result.fvg}</p>
          <p>ORDER BLOCK: {result.orderBlock}</p>

          <p>TREND: {result.trend}</p>
          <p>STRUCTURE: {result.structure}</p>
          <p>LIQUIDITY: {result.liquidity}</p>
          <p>MOMENTUM: {result.momentum}</p>

        </div>

      )}

    </div>
  );
}
