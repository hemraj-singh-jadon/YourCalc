function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-left">
        <span>© 2026 YourCalc. All rights reserved.</span>
      </div>

      <div className="footer-center">
        <a href="/fb.html" target="_blank"  aria-label="Facebook">
          <i className="fa-brands fa-square-facebook"></i>
        </a>
        <a href="/insta.html" target="_blank" aria-label="Instagram">
          <i className="fa-brands fa-square-instagram"></i>
        </a>
        <a href="/twitter.html" target="_blank" aria-label="Twitter">
          <i className="fa-brands fa-square-twitter"></i>
        </a>
      </div>

      <div className="footer-right">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms of service</a>
      </div>
    </footer>
  );
}

export default Footer;
