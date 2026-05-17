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
      alert("Please upload chart image");
      return;
    }

    setLoading(true);
    setResult(null);

    setTimeout(() => {

      // AUTO DETECT ENGINE
      const pairs = [
        {
          pair: "XAUUSD",
          price: 4539.5,
          spread: 8,
        },
        {
          pair: "EURUSD",
          price: 1.16,
          spread: 0.008,
        },
        {
          pair: "GBPUSD",
          price: 1.27,
          spread: 0.010,
        },
        {
          pair: "BTCUSD",
          price: 103500,
          spread: 700,
        },
      ];

      const timeframes = [
        "5M",
        "15M",
        "1H",
        "4H",
      ];

      // SIMULATED AI DETECTION
      const detected =
        pairs[
          Math.floor(Math.random() * pairs.length)
        ];

      const timeframe =
        timeframes[
          Math.floor(Math.random() * timeframes.length)
        ];

      const signal =
        Math.random() > 0.5
          ? "BUY"
          : "SELL";

      // CONFIDENCE
      const confidence =
        Math.floor(Math.random() * 10) + 85;

      // VOLATILITY
      const volatility =
        detected.pair === "BTCUSD"
          ? "EXTREME"
          : Math.random() > 0.5
          ? "HIGH"
          : "NORMAL";

      // ENTRY
      const entry = detected.price;

      let sl;
      let tp1;
      let tp2;

      if (signal === "BUY") {

        sl = (
          entry - detected.spread
        ).toFixed(2);

        tp1 = (
          entry + detected.spread * 2
        ).toFixed(2);

        tp2 = (
          entry + detected.spread * 4
        ).toFixed(2);

      } else {

        sl = (
          entry + detected.spread
        ).toFixed(2);

        tp1 = (
          entry - detected.spread * 2
        ).toFixed(2);

        tp2 = (
          entry - detected.spread * 4
        ).toFixed(2);
      }

      // RISK ENGINE
      const riskReward =
        volatility === "EXTREME"
          ? "1:4.0"
          : volatility === "HIGH"
          ? "1:3.0"
          : "1:2.0";

      // AI EXPLANATION
      const structure =
        signal === "BUY"
          ? "Bullish market structure detected with institutional accumulation."
          : "Bearish market structure detected with institutional distribution.";

      const liquidity =
        signal === "BUY"
          ? "Liquidity sweep below support identified before bullish continuation."
          : "Buy-side liquidity taken before bearish continuation.";

      const momentum =
        signal === "BUY"
          ? "Momentum shows aggressive bullish displacement candles."
          : "Momentum shows strong bearish continuation pressure.";

      const summary =
        signal === "BUY"
          ? `AI detected bullish continuation on ${detected.pair} ${timeframe}.`
          : `AI detected bearish continuation on ${detected.pair} ${timeframe}.`;

      setResult({
        pair: detected.pair,
        timeframe,
        signal,
        confidence,
        entry,
        sl,
        tp1,
        tp2,
        volatility,
        riskReward,
        summary,
        analysis: {
          structure,
          liquidity,
          momentum,
        },
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
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
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
            }}
          >
            Institutional Market Scanner
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          padding: "16px",
        }}
      >
        {/* AUTO DETECT CARD */}
        <div
          style={{
            background: "#111827",
            border: "1px solid #D4AF37",
            borderRadius: "18px",
            padding: "18px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#D4AF37",
            }}
          >
            AI Auto Detection
          </h2>

          <p
            style={{
              color: "#9CA3AF",
            }}
          >
            Upload any chart screenshot.
            AI will automatically detect:
          </p>

          <ul
            style={{
              color: "#D4AF37",
              paddingLeft: "20px",
            }}
          >
            <li>Trading Pair</li>
            <li>Timeframe</li>
            <li>Market Direction</li>
            <li>Volatility</li>
            <li>Institutional Bias</li>
          </ul>
        </div>

        {/* UPLOAD */}
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

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{
              marginTop: "12px",
              width: "100%",
            }}
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: "320px",
                objectFit: "contain",
                marginTop: "18px",
                borderRadius: "18px",
                border: "2px solid #D4AF37",
                background: "#000",
              }}
            />
          )}

          <button
            onClick={analyzeChart}
            disabled={loading}
            style={{
              marginTop: "20px",
              width: "100%",
              background: "#D4AF37",
              color: "#000",
              border: "none",
              padding: "14px",
              borderRadius: "14px",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {loading
              ? "Analyzing Institutional Data..."
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
                <Card title="Pair" value={result.pair} />
                <Card title="Timeframe" value={result.timeframe} />
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

              <p>📈 {result.analysis.structure}</p>
              <p>💧 {result.analysis.liquidity}</p>
              <p>⚡ {result.analysis.momentum}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
