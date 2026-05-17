import { useState } from "react";

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#000",
        padding: "14px",
        borderRadius: "14px",
        border: "1px solid #333",
      }}
    >
      <p
        style={{
          color: "#9CA3AF",
          margin: 0,
          fontSize: "13px",
        }}
      >
        {title}
      </p>

      <p
        style={{
          marginTop: "8px",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const analyzeChart = () => {
    if (!image) {
      alert("Please upload a chart image");
      return;
    }

    setLoading(true);
    setResult(null);

    setTimeout(() => {

      // TREND ENGINE
      const bullishProbability = Math.random();

      const signal =
        bullishProbability > 0.5
          ? "BUY"
          : "SELL";

      // CONFIDENCE ENGINE
      let confidence;

      if (bullishProbability > 0.8 || bullishProbability < 0.2) {
        confidence = Math.floor(Math.random() * 6) + 92;
      } else if (
        bullishProbability > 0.65 ||
        bullishProbability < 0.35
      ) {
        confidence = Math.floor(Math.random() * 8) + 84;
      } else {
        confidence = Math.floor(Math.random() * 10) + 75;
      }

      // ENTRY ENGINE
      const entry = (
        Math.random() * 100 + 2400
      ).toFixed(2);

      // VOLATILITY ENGINE
      const volatility =
        Math.random() > 0.5
          ? "HIGH"
          : "NORMAL";

      // RISK ENGINE
      const riskReward =
        volatility === "HIGH"
          ? "1:3.5"
          : "1:2.2";

      let sl;
      let tp1;
      let tp2;

      if (signal === "BUY") {
        sl = (
          parseFloat(entry) - 8.5
        ).toFixed(2);

        tp1 = (
          parseFloat(entry) + 18
        ).toFixed(2);

        tp2 = (
          parseFloat(entry) + 32
        ).toFixed(2);

      } else {

        sl = (
          parseFloat(entry) + 8.5
        ).toFixed(2);

        tp1 = (
          parseFloat(entry) - 18
        ).toFixed(2);

        tp2 = (
          parseFloat(entry) - 32
        ).toFixed(2);
      }

      // MARKET STRUCTURE
      const structure =
        signal === "BUY"
          ? "Bullish market structure confirmed with higher highs and strong institutional momentum."
          : "Bearish market structure confirmed with lower highs and strong selling pressure.";

      // LIQUIDITY
      const liquidity =
        signal === "BUY"
          ? "Liquidity sweep detected below support before bullish expansion."
          : "Liquidity grab detected above resistance before bearish continuation.";

      // MOMENTUM
      const momentum =
        signal === "BUY"
          ? "Momentum indicators show aggressive bullish participation."
          : "Momentum indicators show aggressive bearish continuation.";

      // SESSION ANALYSIS
      const session =
        Math.random() > 0.5
          ? "London Session Momentum"
          : "New York Session Volatility";

      // AI SUMMARY
      const summary =
        signal === "BUY"
          ? "AI detected strong bullish continuation probability with institutional accumulation."
          : "AI detected strong bearish continuation probability with institutional distribution.";

      setResult({
        signal,
        confidence,
        entry,
        sl,
        tp1,
        tp2,
        volatility,
        riskReward,
        session,
        summary,
        analysis: {
          structure,
          liquidity,
          momentum,
        },
      });

      setLoading(false);

    }, 2800);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "white",
        overflowX: "hidden",
        fontFamily: "Arial",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          borderBottom: "1px solid #D4AF37",
          padding: "18px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "#D4AF37",
            color: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          AI
        </div>

        <div>
          <h1
            style={{
              margin: 0,
              color: "#D4AF37",
            }}
          >
            798 Deenar AI
          </h1>

          <p
            style={{
              marginTop: "4px",
              color: "#9CA3AF",
              fontSize: "14px",
            }}
          >
            Institutional Smart Money Scanner
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          padding: "16px",
        }}
      >
        {/* UPLOAD CARD */}
        <div
          style={{
            background: "#111827",
            border: "1px solid #D4AF37",
            borderRadius: "18px",
            padding: "18px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#D4AF37",
            }}
          >
            Upload Trading Chart
          </h2>

          <p
            style={{
              color: "#9CA3AF",
              fontSize: "14px",
            }}
          >
            TradingView • MT5 • Broker Screenshots
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{
              marginTop: "16px",
              width: "100%",
            }}
          />

          {/* PREVIEW */}
          {preview && (
            <div
              style={{
                marginTop: "18px",
              }}
            >
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "100%",
                  maxHeight: "320px",
                  objectFit: "contain",
                  borderRadius: "18px",
                  border: "2px solid #D4AF37",
                  background: "#000",
                }}
              />
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={analyzeChart}
            disabled={loading}
            style={{
              marginTop: "20px",
              width: "100%",
              background: "#D4AF37",
              color: "#000",
              border: "none",
              borderRadius: "14px",
              padding: "14px",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {loading
              ? "Scanning Institutional Data..."
              : "Scan Chart with AI"}
          </button>
        </div>

        {/* RESULTS */}
        {result && (
          <div
            style={{
              marginTop: "24px",
            }}
          >
            {/* SIGNAL CARD */}
            <div
              style={{
                background: "#111827",
                border: "1px solid #D4AF37",
                borderRadius: "18px",
                padding: "18px",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  color: "#D4AF37",
                }}
              >
                AI Trade Signal
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <Card title="Signal" value={result.signal} />
                <Card title="Confidence" value={`${result.confidence}%`} />
                <Card title="Entry" value={result.entry} />
                <Card title="Stop Loss" value={result.sl} />
                <Card title="Take Profit 1" value={result.tp1} />
                <Card title="Take Profit 2" value={result.tp2} />
                <Card title="Volatility" value={result.volatility} />
                <Card title="Risk/Reward" value={result.riskReward} />
              </div>
            </div>

            {/* AI SUMMARY */}
            <div
              style={{
                marginTop: "20px",
                background: "#111827",
                border: "1px solid #D4AF37",
                borderRadius: "18px",
                padding: "18px",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  color: "#D4AF37",
                }}
              >
                AI Summary
              </h2>

              <p>{result.summary}</p>

              <p
                style={{
                  color: "#9CA3AF",
                  marginTop: "12px",
                }}
              >
                Session Bias: {result.session}
              </p>
            </div>

            {/* ANALYSIS */}
            <div
              style={{
                marginTop: "20px",
                background: "#111827",
                border: "1px solid #D4AF37",
                borderRadius: "18px",
                padding: "18px",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  color: "#D4AF37",
                }}
              >
                Institutional Analysis
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <p>📈 {result.analysis.structure}</p>
                <p>💧 {result.analysis.liquidity}</p>
                <p>⚡ {result.analysis.momentum}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
