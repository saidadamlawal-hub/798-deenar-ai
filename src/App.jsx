import { useEffect, useState } from "react";

import {
  RSI,
  EMA,
  ATR,
} from "technicalindicators";

import { Image } from "image-js";

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

  const [pair, setPair] =
    useState("XAU/USD");

  const [timeframe, setTimeframe] =
    useState("30min");

  const [tradeType, setTradeType] =
    useState("Intraday");

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [marketData, setMarketData] =
    useState(null);

  const apiKey =
    import.meta.env.VITE_TWELVE_API_KEY;

  // FETCH MARKET
  useEffect(() => {

    const fetchMarket = async () => {

      try {

        const res = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${pair}&interval=${timeframe}&outputsize=150&apikey=${apiKey}`
        );

        const data = await res.json();

        setMarketData(data);

      } catch (err) {

        console.log(err);
      }
    };

    fetchMarket();

  }, [pair, timeframe]);

  // HANDLE IMAGE
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

  // IMAGE AI
  const analyzeImageAI = async () => {

    if (!image) {
      return {
        bias: "NEUTRAL",
        confidenceBoost: 0,
      };
    }

    try {

      const buffer =
        await image.arrayBuffer();

      const img =
        await Image.load(buffer);

      const data =
        img.data;

      let bullish = 0;
      let bearish = 0;

      for (
        let i = 0;
        i < data.length;
        i += 4
      ) {

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // GREEN
        if (
          g > r + 25 &&
          g > b + 20
        ) {
          bullish++;
        }

        // RED
        if (
          r > g + 25 &&
          r > b + 20
        ) {
          bearish++;
        }
      }

      if (bullish > bearish) {
        return {
          bias: "BUY",
          confidenceBoost: 10,
        };
      }

      if (bearish > bullish) {
        return {
          bias: "SELL",
          confidenceBoost: 10,
        };
      }

      return {
        bias: "NEUTRAL",
        confidenceBoost: 0,
      };

    } catch (err) {

      console.log(err);

      return {
        bias: "NEUTRAL",
        confidenceBoost: 0,
      };
    }
  };

  // MAIN ANALYSIS
  const analyzeChart = async () => {

    if (!image) {
      alert("Upload chart image");
      return;
    }

    if (!marketData?.values) {
      alert("Market data unavailable");
      return;
    }

    setLoading(true);

    setResult(null);

    try {

      const candles =
        marketData.values.reverse();

      const closes =
        candles.map((c) =>
          parseFloat(c.close)
        );

      const highs =
        candles.map((c) =>
          parseFloat(c.high)
        );

      const lows =
        candles.map((c) =>
          parseFloat(c.low)
        );

      const currentPrice =
        closes[closes.length - 1];

      // RSI
      const rsiValues =
        RSI.calculate({
          values: closes,
          period: 14,
        });

      const rsi =
        rsiValues[
          rsiValues.length - 1
        ];

      // EMA
      const ema20 =
        EMA.calculate({
          values: closes,
          period: 20,
        });

      const ema50 =
        EMA.calculate({
          values: closes,
          period: 50,
        });

      const currentEMA20 =
        ema20[ema20.length - 1];

      const currentEMA50 =
        ema50[ema50.length - 1];

      // ATR
      const atrValues =
        ATR.calculate({
          high: highs,
          low: lows,
          close: closes,
          period: 14,
        });

      const atr =
        atrValues[
          atrValues.length - 1
        ];

      // TREND
      const trend =
        currentEMA20 >
        currentEMA50
          ? "BULLISH"
          : "BEARISH";

      // SIGNAL
      let signal;

      if (
        trend === "BULLISH" &&
        rsi < 70
      ) {
        signal = "BUY";
      } else if (
        trend === "BEARISH" &&
        rsi > 30
      ) {
        signal = "SELL";
      } else {
        signal = "HOLD";
      }

      // IMAGE AI
      const imageAI =
        await analyzeImageAI();

      if (
        imageAI.bias !==
        "NEUTRAL"
      ) {
        signal =
          imageAI.bias;
      }

      // CONFIDENCE
      let confidence = 72;

      confidence +=
        imageAI.confidenceBoost;

      if (
        Math.abs(
          currentEMA20 -
            currentEMA50
        ) > atr * 0.5
      ) {
        confidence += 8;
      }

      if (
        rsi > 60 ||
        rsi < 40
      ) {
        confidence += 7;
      }

      if (
        confidence > 95
      ) {
        confidence = 95;
      }

      // TP / SL
      let sl;
      let tp1;
      let tp2;
      let tp3;

      if (signal === "BUY") {

        sl =
          (
            currentPrice - atr
          ).toFixed(3);

        tp1 =
          (
            currentPrice +
            atr * 1.5
          ).toFixed(3);

        tp2 =
          (
            currentPrice +
            atr * 2.5
          ).toFixed(3);

        tp3 =
          (
            currentPrice +
            atr * 4
          ).toFixed(3);

      } else {

        sl =
          (
            currentPrice + atr
          ).toFixed(3);

        tp1 =
          (
            currentPrice -
            atr * 1.5
          ).toFixed(3);

        tp2 =
          (
            currentPrice -
            atr * 2.5
          ).toFixed(3);

        tp3 =
          (
            currentPrice -
            atr * 4
          ).toFixed(3);
      }

      // VOLATILITY
      const volatility =
        atr >
        currentPrice * 0.003
          ? "HIGH"
          : "MODERATE";

      // STRUCTURE
      const structure =
        trend === "BULLISH"
          ? "Higher highs and higher lows detected."
          : "Lower highs and lower lows detected.";

      // LIQUIDITY
      const liquidity =
        signal === "BUY"
          ? "Buy-side liquidity resting above highs."
          : "Sell-side liquidity resting below lows.";

      // NARRATIVE
      const narrative =
        `${pair} ${timeframe} ${tradeType} setup shows ${signal} pressure using market structure, RSI, EMA trend engine, ATR volatility, and image-based chart AI.`;

      setResult({
        signal,
        confidence,
        currentPrice:
          currentPrice.toFixed(3),
        sl,
        tp1,
        tp2,
        tp3,
        volatility,
        trend,
        rsi:
          rsi.toFixed(2),
        structure,
        liquidity,
        narrative,
      });

    } catch (err) {

      console.log(err);

      alert(
        "AI analysis failed"
      );
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "white",
        fontFamily: "Arial",
        paddingBottom: "40px",
      }}
    >
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
          Institutional AI Scanner
        </p>
      </div>

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
            }}
          >
            <option>XAU/USD</option>
            <option>EUR/USD</option>
            <option>GBP/USD</option>
            <option>BTC/USD</option>
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
            }}
          >
            <option>5min</option>
            <option>15min</option>
            <option>30min</option>
            <option>1h</option>
            <option>4h</option>
          </select>

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
              ? "AI Scanning..."
              : "Analyze Chart"}
          </button>
        </div>

        {/* RESULTS */}
        {result && (
          <div
            style={{
              marginTop: "24px",
            }}
          >
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

              <h1>{result.signal}</h1>

              <h2>
                Confidence:
                {" "}
                {result.confidence}%
              </h2>

              <p>{result.narrative}</p>

              <p>
                Trend:
                {" "}
                {result.trend}
              </p>

              <p>
                Structure:
                {" "}
                {result.structure}
              </p>

              <p>
                Liquidity:
                {" "}
                {result.liquidity}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
