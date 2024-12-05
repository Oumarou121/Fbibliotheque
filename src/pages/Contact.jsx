import React, { useState } from "react";
import TopBody from "../components/TopBody";
import "../styles/Contact.css";
import SupportEmailImg1 from "../assets/images/sup-1.svg";
import SupportEmailImg2 from "../assets/images/sup-2.svg";
import SupportEmailImg3 from "../assets/images/sup-3.svg";
import { sendClientMessage } from "../Api";
import MapComponent from "../components/GoogleMap.jsx";

function Contact() {
  return (
    <>
      <TopBody visibility="true" name="Contact Us" />
      <ContactBody />
    </>
  );
}

function ContactBody() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const send = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !message) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    try {
      const messageData = {
        expediteur: email,
        message: message,
      };
      await sendClientMessage(messageData);
      setSuccessMessage("Your message has been sent successfully!");
      setEmail("");
      setMessage("");
    } catch (error) {
      //console.error("Error sending message:", error);
      setErrorMessage(
        "An error occurred while sending the message. Please try again."
      );
    }
  };

  return (
    <>
      <section className="contact-us grid">
        <div className="contact-info">
          <div>
            {/* <h1 className="fs-poppins text-red fs-200">Contact Us</h1> */}
            <h3 className="fs-poppins text-black fs-400">Get In Touch</h3>
            <p className="fs-montserrat fs-100">
              Have questions or feedback? Fill out the form below to get in
              touch with us.
            </p>
          </div>
          <form onSubmit={send} className="contact-form grid">
            <div className="login_div">
              <input
                type="email"
                className="bg-gray text-black fs-poppins"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
              />
            </div>
            <div className="login_div">
              <textarea
                className="bg-gray text-black fs-poppins"
                rows="10"
                placeholder="Your Message Here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="error-message fs-poppins text-red">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="success-message fs-poppins text-green">
                {successMessage}
              </div>
            )}

            <div className="contact-btn">
              <button
                type="submit"
                className="large-btn bg-red text-white fs-poppins"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="map">
            <h4 className="fs-poppins fs-200 text-black">Our Location</h4>
            <MapComponent />
          </div>
        </div>
      </section>

      <section className="support-container grid">
        <SupportCard
          img={SupportEmailImg1}
          title="Email"
          details1="oumaroumamodou123@gmail.com"
          details2="arafathassane@gmail.com"
        />
        <SupportCard
          img={SupportEmailImg2}
          title="Phone"
          details1="+216 56 193 506"
          details2="+216 56 193 999"
        />
        <SupportCard
          img={SupportEmailImg3}
          title="Address"
          details1="Monastir Cité C2 5000"
          details2="Mosque Aloumrane 1x76051"
        />
      </section>
    </>
  );
}

function SupportCard({ img, title, details1, details2 }) {
  return (
    <div className="support-info grid">
      <div className="support-img grid">
        <img src={img} alt={title} />
      </div>
      <div>
        <p className="fs-100 fs-poppins">
          <span className="fs-200 fs-poppins bold-700">{title}</span> {details1}
        </p>
        <p className="fs-poppins fs-100">{details2}</p>
      </div>
    </div>
  );
}

export default Contact;
