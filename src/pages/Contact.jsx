// src/pages/Contact.jsx

import React from 'react';
import TopBody from '../components/TopBody';
import "../styles/Contact.css";
import SupportEmailImg1 from "../assets/images/sup-1.svg";
import SupportEmailImg2 from "../assets/images/sup-2.svg";
import SupportEmailImg3 from "../assets/images/sup-3.svg";

function Contact() {
  return (
    <>
      <TopBody visibility="true" name="Contact Us" />
      <ContactBody/>
    </>
  );
}

function ContactBody() {
  return (
    <>
      <section className="contact-us grid">
        <div className="contact-info">
          <div>
            <h1 className="fs-poppins text-red fs-200">Contact Us</h1>
            <h3 className="fs-poppins text-black fs-400">Get In Touch</h3>
            <p className="fs-montserrat fs-100">
              When, while lovely valley teems with vapour around me and meridian the upper impenetrable.
            </p>
          </div>
          <form id="message" action="#" className="contact-form grid" noValidate>
            <div className="login_div">
              <input
                id="email"
                type="email"
                className="bg-gray text-black fs-poppins"
                placeholder="Your Email"
              />
              <div className="login-error">
                <svg className="login-error-icon" width="12px" height="12px" aria-hidden="true">
                  <use href="#warning" />
                </svg>
                <span id="email-error" aria-live="assertive"></span>
              </div>
            </div>
            <div className="login_div">
              <textarea
                id="content"
                className="bg-gray text-black fs-poppins"
                rows="10"
                placeholder="Your Message Here"
              ></textarea>
              <div className="login-error">
                <svg className="login-error-icon" width="12px" height="12px" aria-hidden="true">
                  <use href="#warning" />
                </svg>
                <span id="content-error" aria-live="assertive"></span>
              </div>
            </div>
            <div className="contact-btn">
              <button type="submit" className="large-btn bg-red text-white fs-poppins">
                Submit
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="map">
            <h4 className="fs-poppins fs-200 text-red">Google Maps API Key Is Missing</h4>
            <p className="fs-montserrat fs-100">
              In order to use Google Maps on your website, you have to create an API key and insert it in the customizer "Google Maps API Key" field.
            </p>
          </div>
        </div>
      </section>

      <section className="support-container grid">
        <div className="support-info grid">
          <div className="support-img grid">
            <img src={SupportEmailImg1} alt="Support Email" />
          </div>
          <div>
            <p className="fs-100 fs-poppins">
              <span className="fs-200 fs-poppins bold-700">Email</span>Info@yourdomain.com
            </p>
            <p className="fs-poppins fs-100">info@samplemail.com</p>
          </div>
        </div>

        <div className="support-info grid">
          <div className="support-img grid">
            <img src={SupportEmailImg2} alt="Support Phone" />
          </div>
          <div>
            <p className="fs-100 fs-poppins">
              <span className="fs-200 fs-poppins bold-700">Phone</span>+99 (0) 101 0000 888
            </p>
            <p className="fs-poppins fs-100">info@samplemail.com</p>
          </div>
        </div>

        <div className="support-info grid">
          <div className="support-img grid">
            <img src={SupportEmailImg3} alt="Support Address" />
          </div>
          <div>
            <p className="fs-100 fs-poppins">
              <span className="fs-200 fs-poppins bold-700">Address</span>Patricia C 4401 Waldeck
            </p>
            <p className="fs-poppins fs-100">Street Grapevine Nashville 1x76051</p>
          </div>
        </div>
      </section>
    </>
  );
}


export default Contact;
