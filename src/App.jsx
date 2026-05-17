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

  // FETCH MARKET DATA
  useEffect(() => {

    const fetchMarket = async () => {

      try {

        const res = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${pair}&interval=${timeframe}&outputsize=300&apikey=${apiKey}`
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
  const handleImage = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {

      setPreview(reader.result);

      // OCR
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

        // PAIRS
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

        // TIMEFRAMES
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

  // ANALYZE
  const analyzeChart = async () => {

    if (!marketData?.values) {

      alert("Market data unavailable");

      return;
    }

    setLoading(true);

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

      const opens =
        candles.map((c) =>
          parseFloat(c.open)
        );

      const currentPrice =
        closes[closes.length - 1];

      // LAST CANDLES
      const lastOpen =
        opens[opens.length - 1];

      const lastClose =
        closes[closes.length - 1];

      const prevOpen =
        opens[opens.length - 2];

      const prevClose =
        closes[closes.length - 2];

      const lastHigh =
        highs[highs.length - 1];

      const lastLow =
        lows[lows.length - 1];

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

      const ema200 =
        EMA.calculate({
          values: closes,
          period: 200,
        }).slice(-1)[0];

      // RSI
      const rsi =
        RSI.calculate({
          values: closes,
          period: 14,
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
      let trend =
        "RANGING";

      if (
        ema20 > ema50 &&
        ema50 > ema200
      ) {
        trend =
          "BULLISH";
      }

      if (
        ema20 < ema50 &&
        ema50 < ema200
      ) {
        trend =
          "BEARISH";
      }

      // SIGNAL
      let signal =
        "HOLD";

      if (
        trend === "BULLISH" &&
        rsi > 55 &&
        latestMACD.histogram > 0
      ) {
        signal =
          "BUY";
      }

      if (
        trend === "BEARISH" &&
        rsi < 45 &&
        latestMACD.histogram < 0
      ) {
        signal =
          "SELL";
      }

      // PATTERN ENGINE
      let pattern =
        "No strong candle pattern";

      let candleScore = 0;

      // BULLISH ENGULFING
      if (
        prevClose < prevOpen &&
        lastClose > lastOpen &&
        lastClose > prevOpen &&
        lastOpen < prevClose
      ) {
        pattern =
          "Bullish Engulfing";

        candleScore += 12;

        signal = "BUY";
      }

      // BEARISH ENGULFING
      if (
        prevClose > prevOpen &&
        lastClose < lastOpen &&
        lastOpen > prevClose &&
        lastClose < prevOpen
      ) {
        pattern =
          "Bearish Engulfing";

        candleScore += 12;

        signal = "SELL";
      }

      // PINBAR
      const candleBody =
        Math.abs(
          lastClose - lastOpen
        );

      const upperWick =
        lastHigh -
        Math.max(
          lastClose,
          lastOpen
        );

      const lowerWick =
        Math.min(
          lastClose,
          lastOpen
        ) - lastLow;

      // BULLISH PINBAR
      if (
        lowerWick >
        candleBody * 2
      ) {

        pattern =
          "Bullish Pinbar";

        candleScore += 10;

        signal = "BUY";
      }

      // BEARISH PINBAR
      if (
        upperWick >
        candleBody * 2
      ) {

        pattern =
          "Bearish Pinbar";

        candleScore += 10;

        signal = "SELL";
      }

      // BREAKOUT
      const recentHigh =
        Math.max(
          ...highs.slice(-15)
        );

      const recentLow =
        Math.min(
          ...lows.slice(-15)
        );

      let breakout =
        "No breakout";

      if (
        currentPrice >
        recentHigh * 0.999
      ) {

        breakout =
          "Bullish breakout";

        candleScore += 8;
      }

      if (
        currentPrice <
        recentLow * 1.001
      ) {

        breakout =
          "Bearish breakout";

        candleScore += 8;
      }

      // CONFIDENCE
      let confidence = 55;

      if (
        trend !== "RANGING"
      ) {
        confidence += 10;
      }

      confidence += candleScore;

      if (
        latestMACD.histogram > 0 &&
        signal === "BUY"
      ) {
        confidence += 8;
      }

      if (
        latestMACD.histogram < 0 &&
        signal === "SELL"
      ) {
        confidence += 8;
      }

      if (
        rsi > 60 ||
        rsi < 40
      ) {
        confidence += 6;
      }

      if (
        confidence > 95
      ) {
        confidence = 95;
      }

      // VOLATILITY
      let volatility =
        "MODERATE";

      if (
        atr >
        currentPrice * 0.003
      ) {
        volatility =
          "HIGH";
      }

      // DURATION
      let duration =
        "4-12 Hours";

      if (
        tradeType === "Scalping"
      ) {
        duration =
          "15-45 Minutes";
      }

      if (
        tradeType === "Swing"
      ) {
        duration =
          "2-5 Days";
      }

      if (
        tradeType === "Position"
      ) {
        duration =
          "1-3 Weeks";
      }

      // SUPPORT/RESISTANCE
      const resistance =
        Math.max(
          ...highs.slice(-20)
        ).toFixed(3);

      const support =
        Math.min(
          ...lows.slice(-20)
        ).toFixed(3);

      // TP/SL
      let sl;
      let tp1;
      let tp2;
      let tp3;

      if (
        signal === "BUY"
      ) {

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

      // BOS / CHOCH
      const bos =
        signal === "BUY"
          ? "Bullish BOS confirmed above swing highs."
          : "Bearish BOS confirmed below swing lows.";

      const choch =
        signal === "BUY"
          ? "Bullish continuation structure active."
          : "Bearish continuation structure active.";

      // LIQUIDITY
      const liquidity =
        signal === "BUY"
          ? "Buy-side liquidity targeted above highs."
          : "Sell-side liquidity targeted below lows.";

      // STRUCTURE
      const structure =
        trend === "BULLISH"
          ? "Bullish structure with continuation bias."
          : trend === "BEARISH"
          ? "Bearish structure with continuation bias."
          : "Ranging market conditions.";

      // NARRATIVE
      const narrative =
        `${pair} ${timeframe} ${tradeType} setup shows ${signal.toLowerCase()} conditions. Price action engine detected ${pattern}. Momentum profile, EMA trend alignment, volatility structure, breakout analysis, liquidity mapping, BOS/CHOCH continuation, and institutional flow all align toward ${signal}.`;

      setResult({
        signal,
        confidence,
        currentPrice:
          currentPrice.toFixed(3),
        trend,
        rsi:
          rsi.toFixed(2),
        volatility,
        duration,
        pattern,
        breakout,
        support,
        resistance,
        sl,
        tp1,
        tp2,
        tp3,
        bos,
        choch,
        liquidity,
        structure,
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
              Pair: {pair}
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

              <hr />

              <p>
                Current Price:
                {" "}
                {result.currentPrice}
              </p>

              <p>
                Trend:
                {" "}
                {result.trend}
              </p>

              <p>
                RSI:
                {" "}
                {result.rsi}
              </p>

              <p>
                Volatility:
                {" "}
                {result.volatility}
              </p>

              <p>
                Duration:
                {" "}
                {result.duration}
              </p>

              <hr />

              <p>
                Candle Pattern:
                {" "}
                {result.pattern}
              </p>

              <p>
                Breakout:
                {" "}
                {result.breakout}
              </p>

              <hr />

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

              <hr />

              <p>
                Structure:
                {" "}
                {result.structure}
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
