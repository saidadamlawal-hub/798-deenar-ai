import { useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // HANDLE IMAGE
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    // MOBILE SAFE IMAGE PREVIEW
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // UPLOAD
  const uploadImage = async () => {
    if (!image) {
      alert("Please select chart image");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", image);

    try {

      const controller = new AbortController();

      // STOP FREEZE AFTER 20 SECONDS
      const timeout = setTimeout(() => {
        controller.abort();
      }, 20000);

      const res = await fetch("http://localhost:8000/analyze-chart", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();

      setResult(data);

    } catch (error) {

      console.log(error);

      alert(
        "Backend not responding.\nMake sure Flask server is running."
      );

    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <div className="border-b border-yellow-500 px-4 py-4 bg-zinc-950">

        <div className="flex items-center gap-3">

          {/* AI ICON */}
          <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-xl shadow-lg">
            AI
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">
              798 Deenar AI
            </h1>

            <p className="text-gray-400 text-sm">
              Institutional Forex Scanner
            </p>
          </div>

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="p-4">

        {/* UPLOAD CARD */}
        <div className="bg-zinc-950 border border-yellow-500 rounded-2xl p-5 shadow-2xl">

          <h2 className="text-lg md:text-xl font-bold text-yellow-400">
            Upload Trading Chart
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            TradingView • MT5 • Forex Broker Screenshots
          </p>

          {/* FILE INPUT */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="mt-5 w-full text-sm"
          />

          {/* IMAGE PREVIEW */}
          {preview && (
            <div className="mt-5">

              <img
                src={preview}
                alt="chart"
                className="
                  w-full
                  max-h-72
                  object-contain
                  rounded-xl
                  border
                  border-yellow-500
                  bg-black
                "
              />

            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={uploadImage}
            disabled={loading}
            className="
              mt-5
              w-full
              bg-yellow-500
              text-black
              font-bold
              py-3
              rounded-xl
              active:scale-95
            "
          >
            {loading ? "Scanning Chart..." : "Scan Chart"}
          </button>

        </div>

        {/* RESULTS */}
        {result && (

          <div className="mt-6 space-y-4">

            {/* SIGNAL CARD */}
            <div className="bg-zinc-950 border border-green-500 rounded-2xl p-5">

              <h2 className="text-xl font-bold text-green-400">
                AI Trade Signal
              </h2>

              <div className="grid grid-cols-2 gap-3 mt-5">

                <div className="bg-black p-3 rounded-xl border border-yellow-500">
                  <p className="text-gray-400 text-sm">Signal</p>
                  <p className="text-xl font-bold text-yellow-400">
                    {result.signal}
                  </p>
                </div>

                <div className="bg-black p-3 rounded-xl border border-yellow-500">
                  <p className="text-gray-400 text-sm">Confidence</p>
                  <p className="text-xl font-bold text-green-400">
                    {result.confidence}%
                  </p>
                </div>

                <div className="bg-black p-3 rounded-xl border border-yellow-500">
                  <p className="text-gray-400 text-sm">Entry</p>
                  <p>{result.entry}</p>
                </div>

                <div className="bg-black p-3 rounded-xl border border-yellow-500">
                  <p className="text-gray-400 text-sm">Stop Loss</p>
                  <p>{result.sl}</p>
                </div>

                <div className="bg-black p-3 rounded-xl border border-yellow-500">
                  <p className="text-gray-400 text-sm">TP1</p>
                  <p>{result.tp1}</p>
                </div>

                <div className="bg-black p-3 rounded-xl border border-yellow-500">
                  <p className="text-gray-400 text-sm">TP2</p>
                  <p>{result.tp2}</p>
                </div>

              </div>

            </div>

            {/* ANALYSIS */}
            <div className="bg-zinc-950 border border-yellow-500 rounded-2xl p-5">

              <h2 className="text-yellow-400 text-lg font-bold">
                Institutional Analysis
              </h2>

              <div className="mt-4 space-y-3 text-gray-300 text-sm">

                <p>
                  📈 {result.analysis?.structure}
                </p>

                <p>
                  💧 {result.analysis?.liquidity}
                </p>

                <p>
                  ⚡ {result.analysis?.momentum}
                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}
