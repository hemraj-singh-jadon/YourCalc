import { useState, useEffect } from 'react'


function Support() {

  const TALLY_FORM_ID = import.meta.env.VITE_TALLY_FORM_ID;
  const [showIframe, setShowIframe] = useState(false);
  const [formLoaded, setFormLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowIframe(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="legal-page" >
      <h1>Support</h1>

      <p>
        Need help using YourCalc? Below are some common solutions and ways to get
        assistance.
      </p>

      <h2>Common Issues</h2>

      <h3>Voice input not working</h3>
      <ul>
        <li>Ensure microphone permission is allowed</li>
        <li>Speak clearly and avoid background noise</li>
        <li>Try again if speech is not detected</li>
      </ul>

      <h3>Voice input works differently on mobile devices</h3>
      <p>
        Voice input is optimized for desktop and laptop browsers. On mobile devices,
        speech recognition and voice processing are controlled by the browser and
        operating system.
      </p>
      <ul>
        <li>Some math words or operators may not be detected correctly</li>
        <li>Voice feedback may sound different or may not play at all</li>
        <li>This is a mobile browser limitation, not an issue with YourCalc</li>
      </ul>
      <p>
        For the best experience, we recommend using voice input on desktop and manual
        input on mobile devices.
      </p>

      <h3>Calculator not responding</h3>
      <ul>
        <li>Refresh the page</li>
        <li>Clear the calculator</li>
        <li>Try using keyboard or on-screen buttons</li>
      </ul>

      <h3>Microphone indicator stays on</h3>
      <p>
        Some browsers may briefly show a microphone indicator after stopping.
        This is normal browser behavior. YourCalc stops listening immediately
        when you turn the mic off.
      </p>

      <h2>What We Can Help With</h2>
      <ul>
        <li>Using voice input</li>
        <li>Supported math words</li>
        <li>Keyboard shortcuts</li>
        <li>Calculator behavior</li>
      </ul>

      <h2>What We Don’t Do</h2>
      <ul>
        <li>We do not store voice recordings</li>
        <li>We do not access your microphone without permission</li>
        <li>We do not track your calculations</li>
      </ul>

      <h2>Contact</h2>
      <p>
        Have feedback or found a bug? Use the form below to share your feedback
        directly.
      </p>

      <div className="tally-wrapper">
        {showIframe && (
          <iframe
            src={`https://tally.so/embed/${TALLY_FORM_ID}`}
            title="Feedback Form"
            loading="lazy"
            className="tally-iframe"
            onLoad={() => setFormLoaded(true)}
          ></iframe>
        )
        }

        {formLoaded && <div className="tally-cover" aria-hidden="true"></div>}

      </div>


      <p>
        Read our <a href="/privacy">Privacy Policy</a> and{" "}
        <a href="/terms">Terms of Service</a>.
      </p>
    </div>
  );
}

export default Support;
