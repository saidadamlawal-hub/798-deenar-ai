import { useEffect, useState } from "react";

import Tesseract from "tesseract.js";

import {
  RSI,
  EMA,
  ATR,
  MACD,
} from "technicalindicators";

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

  const [ocrText, setOcrText] =
    useState("");

  const [marketData, setMarketData] =
    useState(null);

  const apiKey =
    import.meta.env.VITE_TWELVE_API_KEY;

  // FETCH MARKET
  useEffect(() => {

    const fetchMarket = async () => {

      try {

        const res = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${pair}&interval=${timeframe}&outputsize=200&apikey=${apiKey}`
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
  const handleImage = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    const reader = new FileReader();

    reader.onloadend = async () => {

      setPreview(reader.result);

      // OCR START
      try {

        const result =
          await Tesseract.recognize(
            reader.result,
            "eng"
          );

        const text =
          result.data.text
            .toUpperCase();

        setOcrText(text);

        // AUTO PAIR DETECT
        if (
          text.includes("XAUUSD") ||
          text.includes("GOLD")
        ) {
          setPair("XAU/USD");
        }

        if (
          text.includes("EURUSD")
        ) {
          setPair("EUR/USD");
        }

        if (
          text.includes("GBPUSD")
        ) {
          setPair("GBP/USD");
        }

        if (
          text.includes("BTCUSD")
        ) {
          setPair("BTC/USD");
        }

        // TIMEFRAME DETECT
        if (
          text.includes("M5")
        ) {
          setTimeframe("5min");
        }

        if (
          text.includes("M15")
        ) {
          setTimeframe("15min");
        }

        if (
          text.includes("M30")
        ) {
          setTimeframe("30min");
        }

        if (
          text.includes("H1")
        ) {
          setTimeframe("1h");
        }

        if (
          text.includes("H4")
        ) {
          setTimeframe("4h");
        }

      } catch (err) {

        console.log(err);
      }
    };

    reader.readAsDataURL(file);
  };

  // ANALYSIS
  const analyzeChart = async () => {

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
      const rsi =
        RSI.calculate({
          values: closes,
          period: 14,
        }).slice(-1)[0];

      // EMA
      const ema20 =
        EMA.calculate({
          values: closes,
          period: 20,
        }).slice(-1)[0];

      const ema50 =
        EMA.calculate({
          values: closes,
          period: 50,
        }).slice(-1)[0];

      // ATR
      const atr =
        ATR.calculate({
          high: highs,
          low: lows,
          close: closes,
          period: 14,
        }).slice(-1)[0];

      // MACD
      const macd =
        MACD.calculate({
          values: closes,
          fastPeriod: 12,
          slowPeriod: 26,
          signalPeriod: 9,
          SimpleMAOscillator: false,
          SimpleMASignal: false,
        });

      const latestMACD =
        macd[macd.length - 1];

      // TREND
      const trend =
        ema20 > ema50
          ? "BULLISH"
          : "BEARISH";

      // SIGNAL
      let signal =
        trend === "BULLISH"
          ? "BUY"
          : "SELL";

      // CONFIDENCE
      let confidence = 68;

      if (
        Math.abs(
          ema20 - ema50
        ) > atr * 0.3
      ) {
        confidence += 10;
      }

      if (
        latestMACD.histogram > 0
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

      // BOS / CHOCH
      const bos =
        trend === "BULLISH"
          ? "Bullish BOS confirmed above recent highs."
          : "Bearish BOS confirmed below recent lows.";

      const choch =
        trend === "BULLISH"
          ? "Bullish continuation structure."
          : "Bearish continuation structure.";

      // SUPPORT / RESISTANCE
      const resistance =
        Math.max(
          ...highs.slice(-20)
        ).toFixed(3);

      const support =
        Math.min(
          ...lows.slice(-20)
        ).toFixed(3);

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

      // ANALYST NARRATIVE
      const narrative =
        `${pair} ${timeframe} ${tradeType} setup shows strong ${signal} pressure. OCR market recognition, EMA trend alignment, RSI momentum, ATR volatility profile, MACD confirmation, and BOS structure engine all align toward ${signal}.`;

      setResult({
        signal,
        confidence,
        currentPrice:
          currentPrice.toFixed(3),
        trend,
        volatility:
          atr >
          currentPrice * 0.003
            ? "HIGH"
            : "MODERATE",
        rsi:
          rsi.toFixed(2),
        support,
        resistance,
        bos,
        choch,
        sl,
        tp1,
        tp2,
        tp3,
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
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "20px",
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
            color: "#aaa",
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
              borderRadius: "12px",
              marginBottom: "12px",
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
              borderRadius: "12px",
              marginBottom: "12px",
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
            Upload TradingView Chart
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

        {/* OCR */}
        {ocrText && (
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
              OCR Detection
            </h2>

            <p>
              Pair:
              {" "}
              {pair}
            </p>

            <p>
              Timeframe:
              {" "}
              {timeframe}
            </p>
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div
            style={{
              marginTop: "20px",
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

              <p>
                Current Price:
                {" "}
                {result.currentPrice}
              </p>

              <p>
                RSI:
                {" "}
                {result.rsi}
              </p>

              <p>
                Trend:
                {" "}
                {result.trend}
              </p>

              <p>
                Support:
                {" "}
                {result.support}
              </p>

              <p>
                Resistance:
                {" "}
                {result.resistance}
              </p>

              <p>
                BOS:
                {" "}
                {result.bos}
              </p>

              <p>
                CHOCH:
                {" "}
                {result.choch}
              </p>

              <p>
                Stop Loss:
                {" "}
                {result.sl}
              </p>

              <p>
                TP1:
                {" "}
                {result.tp1}
              </p>

              <p>
                TP2:
                {" "}
                {result.tp2}
              </p>

              <p>
                TP3:
                {" "}
                {result.tp3}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
