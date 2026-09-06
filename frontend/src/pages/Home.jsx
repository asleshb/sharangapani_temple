import "../App.css";

function Home() {
  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          <div className="om-symbol">ॐ</div>

          <div className="logo-text">
            <div className="temple-name-small">
              SHRI TEMPLE
            </div>
            <div className="temple-subtitle">
              TEMPLE
            </div>
          </div>
        </div>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#festivals">Festivals</a>
          <a href="#tradition">Tradition</a>
          <a href="#gallery">Gallery</a>
          <a href="#timings">Timings</a>
          <a href="#visit">Visit</a>
          <a href="#offerings">Offerings</a>
          <a href="#events">Events</a>
          <a href="/admin/login" className="admin-link-btn" style={{ marginLeft: '12px', padding: '6px 14px', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.5)', color: '#d4af37', textDecoration: 'none' }}>Admin Login</a>
        </div>

        <button className="menu-button">☰</button>
      </nav>

      {/* Hero */}
      <section className="hero">

        {/* Temple photograph */}
        <div className="hero-image"></div>

        {/* Red cinematic overlay */}
        <div className="hero-overlay"></div>

        {/* Moving stars */}
        <div className="stars"></div>

        {/* Glow */}
        <div className="hero-glow"></div>

        {/* Main content */}
        <div className="hero-content">

          <div className="hero-om">ॐ</div>

          <div className="small-heading">
            WELCOME TO
          </div>

          <h1>
            Sri Sharangapani
            <br />
            Mahavishnu Temple
          </h1>

          <div className="location">
            YOUR LOCATION
          </div>

          <div className="divider">
            <span>✦</span>
          </div>

          <p className="tagline">
            As you believe, so it becomes
          </p>

          <div className="buttons">
            <button className="primary-button">
              Plan Your Visit
            </button>

            <button className="secondary-button">
              About Temple
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll">
          <span>SCROLL TO EXPLORE</span>
          <div className="scroll-line"></div>
          <div className="arrow">↓</div>
        </div>

      </section>

      {/* ABOUT SECTION */}
      <section className="about-section" id="about">

        <div className="about-background"></div>

        <div className="about-container">

          <div className="about-heading">

            <span className="about-small-title">
              OUR HERITAGE
            </span>

            <div className="about-om">
              ॐ
            </div>

            <h2>
              About the Temple
            </h2>

            <div className="about-divider">
              <span>✦</span>
            </div>

          </div>

          <div className="about-content">

            <div className="about-text">

              <p className="about-intro">
                A Sacred Place of Faith, Tradition and Devotion
              </p>

              <p>
                Sri Sharangapani Mahavishnu Temple is a sacred
                place where devotion, tradition and spiritual heritage
                come together. For generations, devotees have gathered
                here to offer their prayers and experience the divine
                presence of Lord Mahavishnu.
              </p>

              <p>
                The temple stands as a symbol of faith and cultural
                heritage, preserving ancient traditions while continuing
                to welcome devotees and visitors from near and far.
              </p>

              <button className="about-button">
                Discover Our Story
              </button>

            </div>

            <div className="about-highlight">

              <div className="highlight-card">
                <span className="highlight-icon">ॐ</span>
                <h3>Faith</h3>
                <p>
                  A sacred space for prayer, devotion and spiritual
                  connection.
                </p>
              </div>

              <div className="highlight-card">
                <span className="highlight-icon">✦</span>
                <h3>Tradition</h3>
                <p>
                  Preserving the timeless customs and heritage of
                  generations.
                </p>
              </div>

              <div className="highlight-card">
                <span className="highlight-icon">♢</span>
                <h3>Community</h3>
                <p>
                  Bringing devotees together through festivals and
                  sacred celebrations.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;
