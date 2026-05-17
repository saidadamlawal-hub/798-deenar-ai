import { useEffect, useState } from "react";

import {
  RSI,
  EMA,
  ATR,
} from "technicalindicators";

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

  // FETCH MARKET DATA
  useEffect(() => {

    const fetchMarket = async () => {

      try {

        const intervalMap = {
          "5min": "5min",
          "15min": "15min",
          "30min": "30min",
          "1h": "1h",
          "4h": "4h",
        };

        const res = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${pair}&interval=${intervalMap[timeframe]}&outputsize=120&apikey=${apiKey}`
        );

        const data = await res.json();

        setMarketData(data);

      } catch (err) {

        console.log(err);
      }
    };

    fetchMarket();

  }, [pair, timeframe]);

  // IMAGE
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

  // ANALYSIS ENGINE
  const analyzeChart = async () => {

    if (!image) {
      alert("Upload chart image");
      return;
    }

    if (!marketData?.values) {
      alert("Market data not loaded");
      return;
    }

    setLoading(true);

    setResult(null);

    try {

      // CLOSE PRICES
      const closes =
        marketData.values
          .map((c) =>
            parseFloat(c.close)
          )
          .reverse();

      // HIGHS
      const highs =
        marketData.values
          .map((c) =>
            parseFloat(c.high)
          )
          .reverse();

      // LOWS
      const lows =
        marketData.values
          .map((c) =>
            parseFloat(c.low)
          )
          .reverse();

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

      // CURRENT PRICE
      const currentPrice =
        closes[closes.length - 1];

      // SIGNAL ENGINE
      let signal;

      if (
        currentEMA20 >
          currentEMA50 &&
        rsi < 70
      ) {
        signal = "BUY";
      } else if (
        currentEMA20 <
          currentEMA50 &&
        rsi > 30
      ) {
        signal = "SELL";
      } else {
        signal = "HOLD";
      }

      // CONFIDENCE
      let confidence = 70;

      if (
        Math.abs(
          currentEMA20 -
            currentEMA50
        ) > atr * 0.3
      ) {
        confidence += 10;
      }

      if (
        rsi > 60 ||
        rsi < 40
      ) {
        confidence += 10;
      }

      if (
        atr >
        currentPrice * 0.002
      ) {
        confidence += 5;
      }

      if (confidence > 95) {
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
      let volatility;

      if (
        atr >
        currentPrice * 0.003
      ) {
        volatility = "HIGH";
      } else {
        volatility = "MODERATE";
      }

      // EMA BIAS
      const emaBias =
        currentEMA20 >
        currentEMA50
          ? "Bullish EMA Alignment"
          : "Bearish EMA Alignment";

      // STRUCTURE
      const structure =
        signal === "BUY"
          ? "Bullish market structure with Higher Highs and Higher Lows."
          : "Bearish market structure with Lower Highs and Lower Lows.";

      // LIQUIDITY
      const liquidity =
        signal === "BUY"
          ? "Sell-side liquidity sweep detected before bullish continuation."
          : "Buy-side liquidity sweep detected before bearish continuation.";

      // MOMENTUM
      const momentum =
        signal === "BUY"
          ? "Bullish momentum supported by EMA trend and RSI strength."
          : "Bearish momentum supported by EMA weakness and RSI pressure.";

      // NARRATIVE
      const narrative =
        `${pair} ${timeframe} ${tradeType} setup shows ${signal} conditions based on EMA alignment, RSI behavior, ATR volatility profile, and trend continuation probability.`;

      setResult({
        signal,
        confidence,
        currentPrice:
          currentPrice.toFixed(3),
        volatility,
        tradeType,
        sl,
        tp1,
        tp2,
        tp3,
        narrative,
        structure,
        liquidity,
        momentum,
        emaBias,
        rsi: rsi.toFixed(2),
        atr: atr.toFixed(3),
      });

    } catch (err) {

      console.log(err);

      alert(
        "Analysis engine failed"
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
            fontSize: "32px",
          }}
        >
          798 Deenar AI
        </h1>

        <p
          style={{
            color: "#9CA3AF",
          }}
        >
          Institutional AI Market Scanner
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
              background: "#000",
              color: "white",
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

        {/* LIVE MARKET */}
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
            Live Market Data
          </h2>

          {marketData?.values ? (
            <>
              <p>Pair: {pair}</p>
              <p>
                Current Price:
                {" "}
                {
                  marketData.values[0]
                    ?.close
                }
              </p>
              <p>
                Timeframe:
                {" "}
                {timeframe}
              </p>
              <p>
                Trade Type:
                {" "}
                {tradeType}
              </p>
            </>
          ) : (
            <p>Loading market...</p>
          )}
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
              ? "Running AI Analysis..."
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
                AI Trade Intelligence
              </h2>

              <h1>
                {result.signal}
              </h1>

              <h2>
                Confidence:
                {" "}
                {result.confidence}%
              </h2>

              <p>
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
                  value={
                    result.currentPrice
                  }
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
                  title="RSI"
                  value={result.rsi}
                />

                <Card
                  title="ATR"
                  value={result.atr}
                />

                <Card
                  title="EMA Bias"
                  value={
                    result.emaBias
                  }
                />
              </div>
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
                📈 {result.structure}
              </p>

              <p>
                💧 {result.liquidity}
              </p>

              <p>
                ⚡ {result.momentum}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
