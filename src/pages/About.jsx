// src/pages/About.jsx

import React from "react";
import TopBody from "../components/TopBody";
import "../styles/About.css";
import AboutImage from "../assets/images/about-us.png";
import { useNavigate } from "react-router-dom";

function About() {
  return (
    <>
      <TopBody visibility="true" name="About" />
      <AboutContent />
    </>
  );
}

function AboutContent() {
  const navigate = useNavigate();
  const navigation = () => {
    navigate("/library");
  };

  return (
    <section className="about-section grid">
      <div className="aboutImg">
        <img src={AboutImage} alt="About Us" />
      </div>
      <div className="about-info">
        <h3 className="fs-poppins fs-200 text-red">
          Welcome To Digital Library
        </h3>
        <h1 className="fs-montserrat fs-500 text-black">Who We Are?</h1>
        <p className="fs-montserrat fs-100">
          Welcome to our online library, where the world of books is just a
          click away! We are committed to providing you with a vast and diverse
          collection of books, offering knowledge, inspiration, and an
          unforgettable reading experience. Whether you're a fiction lover, a
          student, or a curious mind, our library is designed to meet your
          needs.
        </p>
        <p className="fs-montserrat fs-100">
          Enjoy the convenience of borrowing books online with the option to
          have them delivered to your doorstep or pick them up at one of our
          partner libraries. Discover new releases, timeless classics, and books
          tailored to your interests, all in one place.
        </p>
        <div className="about-btn">
          <button
            className="large-btn bg-red text-white fs-poppins"
            onClick={navigation}
          >
            Borrow Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default About;
