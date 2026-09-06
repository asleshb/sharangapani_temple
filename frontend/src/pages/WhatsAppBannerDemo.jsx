import React, { useState } from "react";
import TempleBanner from "../components/whatsapp/TempleBanner";

function WhatsAppBannerDemo() {
  const [animated, setAnimated] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState("|| ॐ श्री सर्वसिद्धि प्रदायक नमः ||");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#120000",
        color: "#fef8e7",
        padding: "40px 20px",
        fontFamily: "'Playfair Display', serif",
        boxSizing: "border-box"
      }}
    >
      {/* Top Header Controls & Info */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 30px auto",
          textAlign: "center"
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: "0.85rem",
            letterSpacing: "2px",
            color: "#c59b27",
            textTransform: "uppercase",
            marginBottom: "8px"
          }}
        >
          🛕 OFFICIAL TEMPLE WHATSAPP BANNER SYSTEM
        </div>

        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "2.2rem",
            color: "#fef8e7",
            marginBottom: "12px"
          }}
        >
          Live Animated Temple Banner
        </h1>

        <p
          style={{
            fontSize: "1.05rem",
            color: "#d4af37",
            maxWidth: "700px",
            margin: "0 auto 24px auto",
            lineHeight: "1.5"
          }}
        >
          Demonstrating the reusable <code>&lt;TempleBanner /&gt;</code> component
          rendering <code>/whatsapp/temple-banner.jpg</code> with homepage-style floating golden particles and ambient light glows.
        </p>

        {/* Interactive Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            background: "rgba(43, 11, 14, 0.8)",
            padding: "16px 24px",
            borderRadius: "30px",
            border: "1px solid rgba(212, 175, 55, 0.4)",
            width: "fit-content",
            margin: "0 auto"
          }}
        >
          <button
            onClick={() => setAnimated(!animated)}
            style={{
              background: animated
                ? "linear-gradient(135deg, #c59b27 0%, #b8860b 100%)"
                : "#2b0b0e",
              color: animated ? "#120000" : "#fef8e7",
              border: "1px solid #c59b27",
              padding: "10px 20px",
              borderRadius: "20px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            {animated ? "✨ Live Animation ON" : "⏸️ Static Poster Mode (Reduced Motion)"}
          </button>

          <span style={{ color: "rgba(254, 248, 231, 0.5)" }}>|</span>

          <span style={{ fontSize: "0.95rem", color: "#fef8e7" }}>
            Asset: <code>/whatsapp/temple-banner.jpg</code>
          </span>
        </div>
      </div>

      {/* Main Banner Preview Container */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <TempleBanner
          title="BHAJALAKARIYA TEMPLE"
          subtitle={currentSubtitle}
          tagline="Sacred Sanctuary of Faith, Tradition & Devotion"
          imageSrc="/whatsapp/temple-banner.jpg"
          showParticles={animated}
          showFlameGlow={animated}
          className={!animated ? "static-mode" : ""}
        />
      </div>

      {/* Footer Info */}
      <div
        style={{
          maxWidth: "800px",
          margin: "40px auto 0 auto",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "rgba(254, 248, 231, 0.6)",
          lineHeight: "1.6"
        }}
      >
        <p>
          ✅ <strong>Authentic Image:</strong> Using the user's uploaded temple photograph (no AI-generated images).<br />
          ✅ <strong>Separation of Concerns:</strong> The JPG file is static, while the homepage-style floating light particles and pan/zoom effects run in React/CSS.<br />
          ✅ <strong>Accessibility:</strong> Automatically honors <code>prefers-reduced-motion</code>.
        </p>
      </div>
    </div>
  );
}

export default WhatsAppBannerDemo;
