// src/pages/About.jsx

import React from "react";
import TopBody from "../components/TopBody";
import "../styles/About.css";
import AboutImage from "../assets/images/about-us.png";

function About() {
  return (
    <>
      <TopBody visibility="true" name="About" />
      <AboutContent />
    </>
  );
}

function AboutContent() {
  return (
    <section className="about-section grid">
      <div>
        <img src={AboutImage} alt="" />
      </div>
      <div className="about-info">
        <h3 className="fs-poppins fs-200 text-red">
          Welcome To Digital Libary
        </h3>
        <h1 className="fs-montserrat fs-500 text-black">Who We Are?</h1>
        <p className="fs-montserrat fs-100">
          When, while the lovely valley teems with vapour around me, and the
          meridian sun strikes the upper surface of the impenetrable foliage of
          my trees, and but a few stray, <br />
          <br />
          gleams steal into the inner sanctuary, I throw myself down among the
          tall grass by the trickling stream; and, as I lie close to the earth,
          a thousand unknown plants are noticed by me . when I hear the buzz of
          the little world among the stalks, and grow familiar with the
          countless indescribable forms of the insects and flies, then I feel
          the presence.
        </p>

        <div className="about-btn">
          <button className="large-btn bg-red text-white fs-poppins">
            Emprunt Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default About;
