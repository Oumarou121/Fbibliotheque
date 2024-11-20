// src/components/Footer.jsx

import React from "react";
import '../styles/Footer.css';

function Footer() {
  return (
    <>
      <section className="footer grid">
        <div className="footer-logo grid">
          {/* Utilisez le chemin absolu pour le logo */}
          <img src="/logo.png" style={{ width: '50px', height: '50px' }} alt="Logo" />
          <p className="fs-montserrat fs-100">
            There are many variations passages of Lorem Ipsum available, but the majority have
          </p>
          <div className="social-media flex">
            <i className="uil uil-facebook"></i>
            <i className="uil uil-instagram"></i>
            <i className="uil uil-twitter"></i>
            <i className="uil uil-linkedin"></i>
          </div>
        </div>

        <div className="footer-menu grid">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a className="fs-100 fs-montserrat text-black" href="/index.html">
                Home
              </a>
            </li>
            <li>
              <a className="fs-100 fs-montserrat text-black" href="/shop.html">
              Library
              </a>
            </li>
            <li>
              <a className="fs-100 fs-montserrat text-black" href="/about.html">
              Abonnement
              </a>
            </li>
            <li>
              <a className="fs-100 fs-montserrat text-black" href="/blog.html">
                About
              </a>
            </li>
            <li>
              <a className="fs-100 fs-montserrat text-black" href="/contactus.html">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        <div className="contact grid">
          <h3 className="fs-poppins fs-200 bold-800">Contact</h3>
          <p className="fs-montserrat">
            +99 (0) 101 0000 888 Patricie C. Amedee 4401 Waldeck Street Grapevine Nashville, Tx 76051
          </p>
        </div>

        <div className="emails grid">
          <h3 className="fs-poppins fs-200 bold-800">Subscribe To Our Email</h3>
          <p className="updates fs-poppins fs-300 bold-800">For Latest News & Updates</p>

          <div className="inputField flex bg-gray">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="fs-montserrat bg-gray"
            />
            <button className="bg-red text-white fs-poppins fs-50">Subscribe</button>
          </div>
        </div>
      </section>

      <section className="copyRight">
        <p className="c-font fs-montserrat fs-100">@ 2022 Store. All rights reserved</p>
        <p className="fs-montserrat fs-100 text-align p-top">Privacy Policy | Terms & Conditions</p>
      </section>
    </>
  );
}

export default Footer;
