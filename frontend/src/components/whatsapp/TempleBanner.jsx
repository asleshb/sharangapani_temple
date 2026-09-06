import React from "react";
import "./TempleBanner.css";

/**
 * TempleBanner - A reusable, traditional Hindu temple-style banner component.
 * Utilizes the official temple photograph (/whatsapp/temple-banner.jpg)
 * enriched with subtle devotional floating particles, ambient light glow,
 * traditional decorative borders, and elegant serif typography.
 */
const TempleBanner = ({
  title = "BHAJALAKARIYA TEMPLE",
  subtitle = "|| ॐ श्री सर्वसिद्धि प्रदायक नमः ||",
  tagline = "Sacred Sanctuary of Faith, Tradition & Devotion",
  imageSrc = "/whatsapp/temple-banner.jpg",
  showParticles = true,
  showFlameGlow = true,
  className = "",
  style = {}
}) => {
  return (
    <div className={`temple-whatsapp-banner ${className}`} style={style}>
      {/* Background Image Container with Soft Ambient Pan/Zoom */}
      <div className="banner-bg-wrapper">
        <img
          src={imageSrc}
          alt="Bhajalakariya Temple"
          className="banner-bg-image"
        />
        {/* Deep Maroon & Warm Vignette Overlays for Depth and Contrast */}
        <div className="banner-gradient-top" />
        <div className="banner-gradient-bottom" />
        <div className="banner-vignette-overlay" />
        <div className="banner-light-sheen" />
      </div>

      {/* Floating Golden Devotional Particles Layer */}
      {showParticles && (
        <div className="banner-particles-layer" aria-hidden="true">
          <span className="particle particle-1" />
          <span className="particle particle-2" />
          <span className="particle particle-3" />
          <span className="particle particle-4" />
          <span className="particle particle-5" />
          <span className="particle particle-6" />
          <span className="particle particle-7" />
          <span className="particle particle-8" />
          <span className="particle particle-9" />
          <span className="particle particle-10" />
        </div>
      )}

      {/* Traditional Frame & Corner Decorative Accents */}
      <div className="banner-frame-container" aria-hidden="true">
        <div className="banner-border-outer" />
        <div className="banner-border-inner" />
        <div className="corner-ornament top-left">✦</div>
        <div className="corner-ornament top-right">✦</div>
        <div className="corner-ornament bottom-left">✦</div>
        <div className="corner-ornament bottom-right">✦</div>
      </div>

      {/* Banner Content Container */}
      <div className="banner-content">
        <header className="banner-header">
          {/* Devotional Mantra Subtitle */}
          {subtitle && (
            <div className="devotional-badge">
              <span className="badge-flank-line left" />
              <span className="devotional-subtitle">{subtitle}</span>
              <span className="badge-flank-line right" />
            </div>
          )}

          {/* Main Temple Header */}
          <h1 className="banner-title">
            <span className="title-text">{title}</span>
          </h1>

          {/* Decorative Divider */}
          <div className="banner-motif-divider">
            <span className="divider-line" />
            <span className="motif-symbol">🛕</span>
            <span className="divider-line" />
          </div>

          {/* Tagline */}
          {tagline && <p className="banner-tagline">{tagline}</p>}
        </header>

        {/* Ambient Diya / Soft Flame Light Glow Layer */}
        {showFlameGlow && (
          <div className="diya-glow-container" aria-hidden="true">
            <div className="diya-glow left-glow" />
            <div className="diya-glow center-glow" />
            <div className="diya-glow right-glow" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TempleBanner;
