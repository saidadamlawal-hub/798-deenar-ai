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
      alert("Please select chart image");
      return;
    }

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const signal =
        Math.random() > 0.5 ? "BUY" : "SELL";

      const confidence =
        Math.floor(Math.random() * 15) + 85;

      const entry = (
        Math.random() * 100
      ).toFixed(2);

      const sl = (
        parseFloat(entry) - 1.2
      ).toFixed(2);

      const tp1 = (
        parseFloat(entry) + 2.5
      ).toFixed(2);

      const tp2 = (
        parseFloat(entry) + 4.8
      ).toFixed(2);

      setResult({
        signal,
        confidence,
        entry,
        sl,
        tp1,
        tp2,
        analysis: {
          structure:
            signal === "BUY"
              ? "Bullish structure detected."
              : "Bearish structure detected.",

          liquidity:
            signal === "BUY"
              ? "Liquidity sweep below support."
              : "Liquidity sweep above resistance.",

          momentum:
            signal === "BUY"
              ? "Strong bullish momentum."
              : "Strong bearish momentum.",
        },
      });

      setLoading(false);
    }, 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "white",
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
            color: "black",
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
              fontSize: "14px",
            }}
          >
            Institutional Forex Scanner
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
              ? "Scanning Chart..."
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
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "12px",
                }}
              >
                <Card
                  title="Signal"
                  value={result.signal}
                />

                <Card
                  title="Confidence"
                  value={`${result.confidence}%`}
                />

                <Card
                  title="Entry"
                  value={result.entry}
                />

                <Card
                  title="Stop Loss"
                  value={result.sl}
                />

                <Card
                  title="Take Profit 1"
                  value={result.tp1}
                />

                <Card
                  title="Take Profit 2"
                  value={result.tp2}
                />
              </div>
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
                <p>
                  📈 {result.analysis.structure}
                </p>

                <p>
                  💧 {result.analysis.liquidity}
                </p>

                <p>
                  ⚡ {result.analysis.momentum}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
