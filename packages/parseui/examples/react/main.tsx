// The npm entry, exactly as `import { load } from "parseui"` — pointed at the
// local CDN build instead of cdn.parseui.com.
import { load } from "../../dist/npm/parseui.js";
load({ src: new URL("../../dist/cdn/parseui.min.js", import.meta.url).href });
import type {} from "../../src/jsx";
import { useState } from "react";
import { createRoot } from "react-dom/client";

// React-owned controls live outside <parse-ui> (React onClick doesn't fire
// inside a shadow root yet — see README); everything React renders *inside*
// <parse-ui> must stay in sync as state changes.
function App() {
  const [items, setItems] = useState(["Alpha", "Beta", "Gamma"]);
  const [showBanner, setShowBanner] = useState(true);
  const [count, setCount] = useState(0);
  const [saving, setSaving] = useState(false);

  return (
    <>
      <div id="controls">
        <button id="add" onClick={() => setItems((xs) => [...xs, `Item ${xs.length + 1}`])}>Add</button>
        <button id="remove-first" onClick={() => setItems((xs) => xs.slice(1))}>Remove first</button>
        <button id="reverse" onClick={() => setItems((xs) => [...xs].reverse())}>Reverse</button>
        <button id="toggle" onClick={() => setShowBanner((v) => !v)}>Toggle banner</button>
        <button id="inc" onClick={() => setCount((c) => c + 1)}>+1</button>
        <button id="saving" onClick={() => setSaving((v) => !v)}>Toggle saving</button>
      </div>

      <parse-ui id="app">
        <h2>Count: {count}</h2>
        {showBanner && <p id="banner">Banner is visible</p>}
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button view="primary" {...(saving ? { loading: "" } : {})}>
          {saving ? "Saving…" : "Save"}
        </button>
        {/* Checks whether React's onClick reaches an element inside the shadow root. */}
        <button
          id="inside-react-click"
          onClick={() => {
            (window as unknown as { insideClicks: number }).insideClicks =
              ((window as unknown as { insideClicks?: number }).insideClicks ?? 0) + 1;
          }}
        >
          React onClick inside
        </button>
      </parse-ui>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
