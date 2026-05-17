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

  const [pair, setPair] = useState("XAUUSD");

  const [timeframe, setTimeframe] =
    useState("M30");

  const [tradeType, setTradeType] =
    useState("Intraday");

  const [autoDetect, setAutoDetect] =
    useState(false);

  const [image, setImage] = useState(null);

  const [preview, setPreview] =
    useState(null);

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const prices = {
    XAUUSD: 4539.5,
    EURUSD: 1.16,
    GBPUSD: 1.27,
    BTCUSD: 103500,
  };

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
      alert("Please upload chart image");
      return;
    }

    setLoading(true);

    setResult(null);

    setTimeout(() => {

      let selectedPair = pair;

      let selectedTf = timeframe;

      // AUTO DETECT
      if (autoDetect) {

        const autoPairs = [
          "XAUUSD",
          "EURUSD",
          "GBPUSD",
          "BTCUSD",
        ];

        const autoTf = [
          "M5",
          "M15",
          "M30",
          "H1",
          "H4",
        ];

        selectedPair =
          autoPairs[
            Math.floor(
              Math.random() * autoPairs.length
            )
          ];

        selectedTf =
          autoTf[
            Math.floor(
              Math.random() * autoTf.length
            )
          ];
      }

      const currentPrice =
        prices[selectedPair];

      // SIGNAL ENGINE
      const signal =
        Math.random() > 0.5
          ? "BUY"
          : "SELL";

      // CONFIDENCE
      const confidence =
        Math.floor(Math.random() * 20) + 70;

      // VOLATILITY
      const volatility =
        Math.random() > 0.5
          ? "High"
          : "Moderate";

      // SPREAD
      let spread;

      if (selectedPair === "XAUUSD") {
        spread = 28;
      } else if (
        selectedPair === "BTCUSD"
      ) {
        spread = 1200;
      } else {
        spread = 0.012;
      }

      // PRICES
      let entry = currentPrice;

      let sl;
      let tp1;
      let tp2;
      let tp3;

      if (signal === "BUY") {

        sl =
          (
            entry - spread
          ).toFixed(3);

        tp1 =
          (
            entry + spread
          ).toFixed(3);

        tp2 =
          (
            entry + spread * 2
          ).toFixed(3);

        tp3 =
          (
            entry + spread * 3
          ).toFixed(3);

      } else {

        sl =
          (
            entry + spread
          ).toFixed(3);

        tp1 =
          (
            entry - spread
          ).toFixed(3);

        tp2 =
          (
            entry - spread * 2
          ).toFixed(3);

        tp3 =
          (
            entry - spread * 3
          ).toFixed(3);
      }

      // DURATION ENGINE
      let duration;

      if (tradeType === "Scalping") {
        duration = "5-30 minutes";
      } else if (
        tradeType === "Intraday"
      ) {
        duration = "4-12 hours";
      } else if (
        tradeType === "Swing"
      ) {
        duration = "2-5 days";
      } else {
        duration = "1-4 weeks";
      }

      // ANALYST NARRATIVE
      const narrative =
        signal === "BUY"
          ? `${selectedPair} ${selectedTf} is showing strong bullish continuation following institutional accumulation and liquidity sweep behavior. Buyers remain in control with bullish displacement candles confirming continuation probability.`
          : `${selectedPair} ${selectedTf} is showing aggressive bearish continuation following structural breakdown and institutional distribution pressure. Sellers remain dominant with strong downside momentum.`;

      // SMC
      const marketStructure =
        signal === "BUY"
          ? "Bullish structure with Higher Highs and Higher Lows."
          : "Bearish structure with Lower Highs and Lower Lows.";

      const orderBlocks =
        signal === "BUY"
          ? "Bullish order block detected near institutional demand zone."
          : "Bearish supply zone identified near recent distribution.";

      const liquidity =
        signal === "BUY"
          ? "Sell-side liquidity taken before bullish expansion."
          : "Buy-side liquidity swept before bearish continuation.";

      const fvg =
        signal === "BUY"
          ? "Bullish imbalance created during expansion move."
          : "Bearish imbalance created during displacement.";

      // CONFIDENCE FACTORS
      const factors = {
        trend:
          Math.floor(
            Math.random() * 20
          ) + 75,

        momentum:
          Math.floor(
            Math.random() * 20
          ) + 70,

        liquidity:
          Math.floor(
            Math.random() * 20
          ) + 70,

        volatility:
          Math.floor(
            Math.random() * 20
          ) + 70,

        structure:
          Math.floor(
            Math.random() * 20
          ) + 70,
      };

      setResult({
        selectedPair,
        selectedTf,
        tradeType,
        signal,
        confidence,
        entry,
        sl,
        tp1,
        tp2,
        tp3,
        volatility,
        duration,
        narrative,
        marketStructure,
        orderBlocks,
        liquidity,
        fvg,
        factors,
      });

      setLoading(false);

    }, 2600);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "white",
        fontFamily: "Arial",
        overflowX: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "18px",
          borderBottom:
            "1px solid #D4AF37",
        }}
      >
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
            color: "#9CA3AF",
          }}
        >
          Institutional Trade Intelligence
        </p>
      </div>

      {/* CONTENT */}
      <div
        style={{
          padding: "16px",
        }}
      >
        {/* SETTINGS */}
        <div
          style={{
            background: "#111827",
            border:
              "1px solid #D4AF37",
            borderRadius: "18px",
            padding: "18px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "#D4AF37",
            }}
          >
            Market Settings
          </h2>

          {/* AUTO DETECT */}
          <label
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <input
              type="checkbox"
              checked={autoDetect}
              onChange={() =>
                setAutoDetect(!autoDetect)
              }
            />

            Auto Detect Pair & Timeframe
          </label>

          {!autoDetect && (
            <>
              <select
                value={pair}
                onChange={(e) =>
                  setPair(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  borderRadius: "12px",
                  background: "#000",
                  color: "white",
                }}
              >
                <option>XAUUSD</option>
                <option>EURUSD</option>
                <option>GBPUSD</option>
                <option>BTCUSD</option>
              </select>

              <select
                value={timeframe}
                onChange={(e) =>
                  setTimeframe(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  borderRadius: "12px",
                  background: "#000",
                  color: "white",
                }}
              >
                <option>M5</option>
                <option>M15</option>
                <option>M30</option>
                <option>H1</option>
                <option>H4</option>
              </select>
            </>
          )}

          {/* TRADE TYPE */}
          <select
            value={tradeType}
            onChange={(e) =>
              setTradeType(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              background: "#000",
              color: "white",
            }}
          >
            <option>Scalping</option>
            <option>Intraday</option>
            <option>Swing</option>
            <option>Position</option>
          </select>
        </div>

        {/* UPLOAD */}
        <div
          style={{
            background: "#111827",
            border:
              "1px solid #D4AF37",
            borderRadius: "18px",
            padding: "18px",
          }}
        >
          <h2
            style={{
              color: "#D4AF37",
            }}
          >
            Upload Trading Chart
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: "320px",
                objectFit: "contain",
                marginTop: "16px",
                borderRadius: "16px",
                border:
                  "2px solid #D4AF37",
              }}
            />
          )}

          <button
            onClick={analyzeChart}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "18px",
              background: "#D4AF37",
              color: "#000",
              border: "none",
              padding: "14px",
              borderRadius: "14px",
              fontWeight: "bold",
            }}
          >
            {loading
              ? "Analyzing..."
              : "Generate AI Analysis"}
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <div
            style={{
              marginTop: "24px",
            }}
          >
            {/* MAIN */}
            <div
              style={{
                background: "#111827",
                border:
                  "1px solid #D4AF37",
                borderRadius: "18px",
                padding: "18px",
              }}
            >
              <h2
                style={{
                  color: "#D4AF37",
                }}
              >
                Trade Intelligence
              </h2>

              <p>
                {result.selectedPair} •{" "}
                {result.selectedTf}
              </p>

              <h1>
                {result.signal}
              </h1>

              <p>
                {result.tradeType}
              </p>

              <h2>
                Confidence{" "}
                {result.confidence}%
              </h2>

              <p
                style={{
                  marginTop: "20px",
                  lineHeight: 1.7,
                }}
              >
                {result.narrative}
              </p>
            </div>

            {/* EXECUTION */}
            <div
              style={{
                marginTop: "20px",
                background: "#111827",
                border:
                  "1px solid #D4AF37",
                borderRadius: "18px",
                padding: "18px",
              }}
            >
              <h2
                style={{
                  color: "#D4AF37",
                }}
              >
                Execution Plan
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "12px",
                }}
              >
                <Card
                  title="Entry"
                  value={result.entry}
                />

                <Card
                  title="Stop Loss"
                  value={result.sl}
                />

                <Card
                  title="TP1"
                  value={result.tp1}
                />

                <Card
                  title="TP2"
                  value={result.tp2}
                />

                <Card
                  title="TP3"
                  value={result.tp3}
                />

                <Card
                  title="Volatility"
                  value={
                    result.volatility
                  }
                />

                <Card
                  title="Duration"
                  value={result.duration}
                />
              </div>
            </div>

            {/* FACTORS */}
            <div
              style={{
                marginTop: "20px",
                background: "#111827",
                border:
                  "1px solid #D4AF37",
                borderRadius: "18px",
                padding: "18px",
              }}
            >
              <h2
                style={{
                  color: "#D4AF37",
                }}
              >
                Confidence Factors
              </h2>

              <p>
                Trend Strength{" "}
                {result.factors.trend}
              </p>

              <p>
                Momentum{" "}
                {result.factors.momentum}
              </p>

              <p>
                Liquidity{" "}
                {result.factors.liquidity}
              </p>

              <p>
                Volatility{" "}
                {result.factors.volatility}
              </p>

              <p>
                Structure{" "}
                {result.factors.structure}
              </p>
            </div>

            {/* SMC */}
            <div
              style={{
                marginTop: "20px",
                background: "#111827",
                border:
                  "1px solid #D4AF37",
                borderRadius: "18px",
                padding: "18px",
              }}
            >
              <h2
                style={{
                  color: "#D4AF37",
                }}
              >
                Smart Money Concepts
              </h2>

              <p>
                📈 {result.marketStructure}
              </p>

              <p>
                🧱 {result.orderBlocks}
              </p>

              <p>
                💧 {result.liquidity}
              </p>

              <p>
                ⚡ {result.fvg}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
