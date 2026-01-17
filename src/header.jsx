function Header() {
  return (
    <nav className="app-header">
      <div className="left">
       <a href="/"> <img src="/apple-touch-icon.png" alt="YourCalc logo" /> </a>

        <div className="title-wrap">
          <span className="title">YourCalc</span>
          <span className="tagline">Your Voice Your Calculator</span>
        </div>
      </div>

      <div className="right">
        <a href="/help" className="nav-link">Help</a>
        <a href="/support" className="nav-link">Support</a>
      </div>
    </nav>
  );
}

export default Header;
