function Help() {
  return (
    <div className="legal-page">
     <h1>Help</h1>

<p>
  YourCalc is a modern calculator that supports mouse, keyboard, and voice
  input. It behaves like a standard Windows calculator and runs entirely in your
  browser.
</p>

<h2>Ways to Use YourCalc</h2>
<p>You can calculate using mouse, keyboard, or voice input.</p>

<h2>Voice Input</h2>
<p>
  Click the microphone button and speak your calculation naturally. Once
  speech is detected, the calculator stops listening and calculates the
  result immediately.
</p>

<ul>
  <li>“10 plus 5”</li>
  <li>“25 guna 4”</li>
  <li>“100 bhagya 5”</li>
  <li>“3 point 5 into 4”</li>
</ul>

<p>
  <strong>Note:</strong> Voice input works best on desktop and laptop browsers.
  On mobile devices, speech recognition is controlled by the browser and may not
  always detect math words or operators accurately. For mobile users, touch
  input is usually faster and more reliable.
</p>

<h2>Supported Math Words</h2>
<p><strong>Addition:</strong> plus, add, jod, jodna</p>
<p><strong>Subtraction:</strong> minus, ghata</p>
<p><strong>Multiplication:</strong> multiply, into, guna</p>
<p><strong>Division:</strong> divide, bhag, bhaga, bhagya</p>

<h2>Keyboard Shortcuts</h2>
<ul>
  <li>Enter — Calculate</li>
  <li>Backspace — Delete</li>
  <li>Escape & Delete — Clear</li>
  <li>Ctrl + M (⌘ + M on Mac) — Mic On/Off</li>
  <li>Escape — Mic Off</li>
</ul>

<h2>Calculator Behavior</h2>
<p>
  YourCalc supports chained operations, repeated equals, and percentage
  behavior similar to the Windows calculator.
</p>

<h2>Microphone & Privacy</h2>
<p>
  The microphone is used only when enabled by you. When stopped, the
  calculator stops listening immediately.
</p>

<p>
  Some browsers may briefly show a microphone indicator after stopping.
</p>

<p>
  For more information, see our <a href="/privacy">Privacy Policy</a> and{" "}
  <a href="/terms">Terms of Service</a>.
</p>

    </div>
  );
}

export default Help;
