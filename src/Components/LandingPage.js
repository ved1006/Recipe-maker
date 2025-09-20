// src/components/LandingPage.js
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useNavigate } from "react-router-dom"; // ✅ add navigation

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Background GSAP animation (infinite gradient shift)
    gsap.to("body", {
      background:
        "linear-gradient(135deg, #ff7eb3, #ff758c, #ffb199, #ffcc70, #ff8177)",
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div
      style={{
        minHeight: "200vh", // ✅ extended to allow scrolling
        fontFamily: "'Poppins', sans-serif",
        overflowX: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      {/* ================= HERO SECTION ================= */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          padding: "0 20px",
          position: "relative",
        }}
      >
        {/* Sliding Title */}
        <motion.h1
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            fontSize: "4rem",
            fontWeight: "900",
            textShadow: "0 10px 25px rgba(0,0,0,0.5)",
          }}
        >
          🚀 Welcome to <span style={{ color: "#ffe259" }}>Cooksy</span>
        </motion.h1>

        {/* Staggered subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.2 }}
          style={{
            fontSize: "1.5rem",
            marginTop: "1.5rem",
            maxWidth: "700px",
            lineHeight: "1.6",
          }}
        >
          Your AI-powered recipe companion — discover, plan, and scale meals like
          never before.
        </motion.p>

        {/* Animated Buttons */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1, ease: "backOut" }}
          style={{ display: "flex", gap: "20px", marginTop: "2rem" }}
        >
          <motion.button
            whileHover={{
              scale: 1.15,
              backgroundColor: "#ffe259",
              color: "#333",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.25rem",
              fontWeight: "700",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              background: "#ff4b5c",
              color: "white",
              boxShadow: "0px 15px 25px rgba(0,0,0,0.3)",
            }}
            onClick={() => navigate("/signup")} // ✅ redirect
          >
            Get Started
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.15,
              backgroundColor: "#ff4b5c",
              color: "#fff",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.25rem",
              fontWeight: "700",
              borderRadius: "50px",
              border: "2px solid white",
              cursor: "pointer",
              background: "transparent",
              color: "white",
            }}
            onClick={() => navigate("/signup")} // ✅ redirect
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Floating scroll hint */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.8, y: [0, -15, 0] }}
          transition={{
            delay: 3,
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            bottom: "50px",
            fontSize: "2rem",
            color: "#fff",
          }}
        >
          ↓ Scroll to Explore
        </motion.div>
      </div>

      {/* ================= ABOUT SECTION ================= */}
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        style={{
          minHeight: "100vh",
          background: "white",
          color: "#333",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 2rem",
        }}
      >
        <h2
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "1.5rem",
            background: "linear-gradient(90deg, #ff4b5c, #ffcc70)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Why Cooksy?
        </h2>
        <p
          style={{
            fontSize: "1.25rem",
            maxWidth: "800px",
            lineHeight: "1.8",
            marginBottom: "2rem",
          }}
        >
          Cooksy isn’t just another recipe app — it’s your{" "}
          <b>personal AI-powered sous chef</b>. Scale recipes instantly, plan
          your weekly meals, and let AI recommend the best dishes for your
          lifestyle.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginTop: "2rem",
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          {[
            {
              title: "🔍 Smart Search",
              desc: "Find recipes tailored to your taste & ingredients you already have.",
            },
            {
              title: "📅 Meal Planning",
              desc: "Organize meals for the whole week with just a few clicks.",
            },
            {
              title: "🤖 AI Assistant",
              desc: "Ask Cooksy AI for ideas, cooking tips, and personalized suggestions.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.3 }}
              viewport={{ once: true }}
              style={{
                background: "#f9fafb",
                padding: "2rem",
                borderRadius: "1rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: "1rem", lineHeight: "1.6" }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
