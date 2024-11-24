import React, { useEffect, useState } from "react";
import "../styles/Login.css";
import { registerClient, loginClient } from "../Api.js";
import { useLoader } from "../LoaderContext";
import { useNavigate } from "react-router-dom";

const LoginModal = () => {
  const { showLoader, hideLoader } = useLoader();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
  const [isPasswordVisible3, setIsPasswordVisible3] = useState(false);
  const [title, setTitle] = useState("Welcome Back");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const forgotPasswordHandler = () => {
    setIsForgotPassword(true);
    setIsRegister(false);
    setIsPassword(false);
    setIsLogin(false);
    setIsPasswordVisible1(false);
    setIsPasswordVisible2(false);
    setIsPasswordVisible3(false);
    setTitle("Reset Password");
  };

  const passwordHandler = ({ name, email }) => {
    setIsForgotPassword(false);
    setIsRegister(false);
    setIsLogin(false);
    setIsPassword(true);
    setIsPasswordVisible1(false);
    setIsPasswordVisible2(false);
    setIsPasswordVisible3(false);
    setEmail(email);
    setName(name);
  };

  const registerHandler = () => {
    setIsPassword(false);
    setIsForgotPassword(false);
    setIsRegister(true);
    setIsLogin(false);
    setIsPasswordVisible1(false);
    setIsPasswordVisible2(false);
    setIsPasswordVisible3(false);
    setTitle("Create an Account");
  };

  const loginHandler = () => {
    setIsLogin(true);
    setIsPassword(false);
    setIsForgotPassword(false);
    setIsRegister(false);
    setIsPasswordVisible1(false);
    setIsPasswordVisible2(false);
    setIsPasswordVisible3(false);
    setTitle("Welcome Back");
  };

  const togglePasswordVisibility = (index) => {
    if (index === 1) {
      setIsPasswordVisible1(!isPasswordVisible1);
    } else if (index === 2) {
      setIsPasswordVisible2(!isPasswordVisible2);
    } else if (index === 3) {
      setIsPasswordVisible3(!isPasswordVisible3);
    }
  };
  return (
    <div id="login-modal">
      <Icons />
      <div className="modal">
        <div className="top-form">
          <div className="close-modal" onClick={loginHandler}>
            &#10006;
          </div>
        </div>

        <div className="div-body">
          <h1 className="title">{title}</h1>

          {/* Login switch nav */}
          <div className="login__segmented">
            <button
              id="login-btn1"
              className={`login__segmented-btn`}
              onClick={loginHandler}
              aria-selected={isLogin}
            >
              Sign In
            </button>
            <button
              id="login-btn2"
              className={`login__segmented-btn login__segmented-btn1`}
              onClick={registerHandler}
              aria-selected1={isRegister || isPassword}
            >
              Sign Up
            </button>
            <div className="login__segmented-focus"></div>
          </div>

          {/* Login form */}
          {!isForgotPassword && isLogin && !isRegister && (
            <FLogin
              forgotPasswordHandler={forgotPasswordHandler}
              isPasswordVisible1={isPasswordVisible1}
              togglePasswordVisibility={togglePasswordVisibility}
              showLoader={showLoader}
              hideLoader={hideLoader}
              navigate={navigate}
            />
          )}

          {/* Forgot Password form */}
          {isForgotPassword && <FForgotPassword loginHandler={loginHandler} />}

          {/* Password form */}
          {isPassword && (
            <FRegister
              togglePasswordVisibility={togglePasswordVisibility}
              isPasswordVisible2={isPasswordVisible2}
              isPasswordVisible3={isPasswordVisible3}
              registerHandler={registerHandler}
              name={name}
              email={email}
              showLoader={showLoader}
              hideLoader={hideLoader}
              navigate={navigate}
            />
          )}

          {/* Register form */}
          {!isLogin && isRegister && (
            <FContinue passwordHandler={passwordHandler} />
          )}
        </div>
      </div>
    </div>
  );
};

function Icons() {
  return (
    <svg display="none">
      <symbol id="apple" viewBox="0 0 512 512">
        <path
          fill="currentColor"
          d="M248.644,123.476c-5.45-29.71,8.598-60.285,25.516-80.89c18.645-22.735,50.642-40.17,77.986-42.086c4.619,31.149-8.093,61.498-24.826,82.965C309.37,106.527,278.508,124.411,248.644,123.476z M409.034,231.131c8.461-23.606,25.223-44.845,51.227-59.175c-26.278-32.792-63.173-51.83-97.99-51.83c-46.065,0-65.542,21.947-97.538,21.947c-32.96,0-57.965-21.947-97.866-21.947c-39.127,0-80.776,23.848-107.19,64.577c-9.712,15.055-16.291,33.758-19.879,54.59c-9.956,58.439,4.916,134.557,49.279,202.144c21.57,32.796,50.321,69.737,87.881,70.059c33.459,0.327,42.951-21.392,88.246-21.616c45.362-0.258,53.959,21.841,87.372,21.522c37.571-0.317,67.906-41.199,89.476-73.991c15.359-23.532,21.167-35.418,33.11-62.023C414.435,352.487,389.459,285.571,409.034,231.131z"
        />
      </symbol>
      <symbol id="avatar" viewBox="0 0 32 32">
        <g fill="currentColor">
          <path d="M16,8a5,5,0,1,0,5,5A5,5,0,0,0,16,8Z" />
          <path d="M16,2A14,14,0,1,0,30,16,14.0158,14.0158,0,0,0,16,2Zm7.9925,22.9258A5.0016,5.0016,0,0,0,19,20H13a5.0016,5.0016,0,0,0-4.9925,4.9258,12,12,0,1,1,15.985,0Z" />
        </g>
      </symbol>
      <symbol id="check" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          fill="#27bc89"
          d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z"
        />
      </symbol>
      <symbol id="email" viewBox="0 0 20 20">
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="1" y="2" rx="4" ry="4" width="18" height="16" />
          <polyline points="5 7,10 11,15 7" />
        </g>
      </symbol>
      <symbol id="eye-off" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M6.30147 15.5771C4.77832 14.2684 3.6904 12.7726 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C14.1843 6 16.1261 7.07185 17.6986 8.42294C19.2218 9.73158 20.3097 11.2274 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18C9.81574 18 7.87402 16.9282 6.30147 15.5771ZM12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C2.00757 13.8624 3.23268 15.5772 4.99812 17.0941C6.75717 18.6054 9.14754 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C21.9925 10.1376 20.7674 8.42276 19.002 6.90595C17.2429 5.39462 14.8525 4 12 4ZM10 12C10 10.8954 10.8955 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8955 14 10 13.1046 10 12ZM12 8C9.7909 8 8.00004 9.79086 8.00004 12C8.00004 14.2091 9.7909 16 12 16C14.2092 16 16 14.2091 16 12C16 9.79086 14.2092 8 12 8Z"
        />
      </symbol>
      <symbol id="eye-on" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L14.032 8.55382C13.4365 8.20193 12.7418 8 12 8C9.79086 8 8 9.79086 8 12C8 12.7418 8.20193 13.4365 8.55382 14.032L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L9.96803 15.4462C10.5635 15.7981 11.2582 16 12 16C14.2091 16 16 14.2091 16 12C16 11.2582 15.7981 10.5635 15.4462 9.96803L19.7071 5.70711ZM12.518 10.0677C12.3528 10.0236 12.1792 10 12 10C10.8954 10 10 10.8954 10 12C10 12.1792 10.0236 12.3528 10.0677 12.518L12.518 10.0677ZM11.482 13.9323L13.9323 11.482C13.9764 11.6472 14 11.8208 14 12C14 13.1046 13.1046 14 12 14C11.8208 14 11.6472 13.9764 11.482 13.9323ZM15.7651 4.8207C14.6287 4.32049 13.3675 4 12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C1.92276 13.7326 2.86706 15.0637 4.21194 16.3739L5.62626 14.9596C4.4555 13.8229 3.61144 12.6531 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C12.7719 6 13.5135 6.13385 14.2193 6.36658L15.7651 4.8207ZM12 18C11.2282 18 10.4866 17.8661 9.78083 17.6334L8.23496 19.1793C9.37136 19.6795 10.6326 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C22.0773 10.2674 21.133 8.93627 19.7881 7.62611L18.3738 9.04043C19.5446 10.1771 20.3887 11.3469 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18Z"
        />
      </symbol>
      <symbol id="fb" viewBox="0 0 20 20">
        <path
          fill="#fff"
          d="M8.46 18h2.93v-7.3h2.45l.37-2.84h-2.82V6.04c0-.82.23-1.38 1.41-1.38h1.51V2.11c-.26-.03-1.15-.11-2.19-.11-2.18 0-3.66 1.33-3.66 3.76v2.1H6v2.84h2.46V18z"
        />
      </symbol>
      <symbol id="google" viewBox="0 0 16 16">
        <path
          fill="#4285F4"
          d="M14.9 8.161c0-.476-.039-.954-.121-1.422h-6.64v2.695h3.802a3.24 3.24 0 01-1.407 2.127v1.75h2.269c1.332-1.22 2.097-3.02 2.097-5.15z"
        />
        <path
          fill="#34A853"
          d="M8.14 15c1.898 0 3.499-.62 4.665-1.69l-2.268-1.749c-.631.427-1.446.669-2.395.669-1.836 0-3.393-1.232-3.952-2.888H1.85v1.803A7.044 7.044 0 008.14 15z"
        />
        <path
          fill="#FBBC04"
          d="M4.187 9.342a4.17 4.17 0 010-2.68V4.859H1.849a6.97 6.97 0 000 6.286l2.338-1.803z"
        />
        <path
          fill="#EA4335"
          d="M8.14 3.77a3.837 3.837 0 012.7 1.05l2.01-1.999a6.786 6.786 0 00-4.71-1.82 7.042 7.042 0 00-6.29 3.858L4.186 6.66c.556-1.658 2.116-2.89 3.952-2.89z"
        />
      </symbol>
      <symbol id="logo" viewBox="0 0 32 32">
        <polygon
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="16 4,2 28,30 28"
        />
      </symbol>
      <symbol id="warning" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,16a1,1,0,1,1,1-1A1,1,0,0,1,12,18Zm1-5a1,1,0,0,1-2,0V7a1,1,0,0,1,2,0Z"
        />
      </symbol>
    </svg>
  );
}

function FLogin({
  forgotPasswordHandler,
  isPasswordVisible1,
  togglePasswordVisibility,
  showLoader,
  hideLoader,
  navigate,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const maxLoginAttempts = 3;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Handler pour le formulaire de connexion
  const handleLogin = async (e) => {
    console.log("Hello");
    e.preventDefault();

    setEmailError(""); // Réinitialisation des erreurs
    setPasswordError(""); // Réinitialisation des erreurs

    // Vérification des tentatives de connexion
    if (loginAttempts >= maxLoginAttempts) {
      setPasswordError(
        "Trop de tentatives échouées. Veuillez réessayer plus tard."
      );
      return;
    }

    if (!email.trim() && !password.trim()) {
      setEmailError("Champ requis.");
      setPasswordError("Champ requis.");
    } else {
      if (!email.trim()) {
        setEmailError("Champ requis.");
      } else if (!emailPattern.test(email)) {
        setEmailError("Veuillez entrer une adresse email valide.");
      } else if (!password.trim()) {
        setPasswordError("Champ requis.");
      } else {
        // Logique de connexion ici
        showLoader();
        setEmail(email.trim());
        setPassword(password.trim());
        const loginData = { email: email, password: password };
        try {
          const token = await loginClient(loginData);
          localStorage.setItem("authToken", token);
          console.log("Connexion réussie, token:", token);
          navigate("/");
        } catch (err) {
          setPasswordError(err.message);
          setLoginAttempts((prev) => prev + 1);
        } finally {
          hideLoader();
        }
      }
    }
  };

  return (
    <form id="login" className="input-box" onSubmit={handleLogin}>
      {/* Email */}
      <div className="login_div">
        <input
          className="login-input"
          id="user-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          placeholder=" "
        />
        <label className="login-label" htmlFor="user-email">
          Email
        </label>
        <div className="login-error">
          <svg
            className="login-error-icon"
            width="12px"
            height="12px"
            aria-hidden="true"
          >
            <use href="#warning" />
          </svg>
          <span id="email-error" aria-live="assertive">
            {emailError}
          </span>
        </div>
      </div>

      {/* Password */}
      <div className="login_div">
        <a
          className="login__forgot text-white"
          href="#"
          id="forgot-password-btn"
          onClick={forgotPasswordHandler}
        >
          Forgot password?
        </a>
        <input
          className="login-input"
          id="user-password"
          type={isPasswordVisible1 ? "text" : "password"}
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          placeholder=" "
        />
        <label className="login-label" htmlFor="user-password">
          Password
        </label>
        <div className="login-error">
          <svg
            className="login-error-icon"
            width="12px"
            height="12px"
            aria-hidden="true"
          >
            <use href="#warning" />
          </svg>
          <span id="password-error" aria-live="assertive">
            {passwordError}
          </span>
        </div>
        <button
          className="login__eye"
          type="button"
          onClick={() => togglePasswordVisibility(1)}
          title="Show password"
        >
          <svg
            className={`login__eye-icon ${
              isPasswordVisible1 ? "show" : "hide"
            }`}
            width="24px"
            height="24px"
            data-icon="eye-on"
          >
            <use href="#eye-on" />
          </svg>
          <svg
            className={`login__eye-icon ${
              !isPasswordVisible1 ? "show" : "hide"
            }`}
            width="24px"
            height="24px"
            data-icon="eye-off"
          >
            <use href="#eye-off" />
          </svg>
        </button>
      </div>

      {/* Button */}
      <button className="login-btn" type="submit" data-action="continue">
        Sign In
      </button>

      {/* Social buttons */}
      <div className="login__or">Or Continue With</div>
      <div className="login__social">
        <button
          className="login__social-btn login__social-btn--google"
          type="button"
          title="Google"
        >
          <svg
            className="login__social-icon"
            width="16px"
            height="16px"
            aria-hidden="true"
          >
            <use href="#google" />
          </svg>
        </button>
        <button
          className="login__social-btn login__social-btn--apple"
          type="button"
          title="Apple"
        >
          <svg
            className="login__social-icon"
            width="16px"
            height="16px"
            aria-hidden="true"
          >
            <use href="#apple" />
          </svg>
        </button>
        <button
          className="login__social-btn login__social-btn--fb"
          type="button"
          title="Facebook"
        >
          <svg
            className="login__social-icon"
            width="16px"
            height="16px"
            aria-hidden="true"
          >
            <use href="#fb" />
          </svg>
        </button>
      </div>
    </form>
  );
}

function FForgotPassword({ loginHandler }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleForgotPassword = (e) => {
    e.preventDefault();

    setEmailError(""); // Réinitialiser l'erreur
    const emailInput = document.getElementById("fg-user-email");

    if (!emailInput.value.trim()) {
      setEmailError("Required");
      emailInput.classList.add("error");
    } else if (!emailPattern.test(emailInput.value)) {
      setEmailError("Veuillez entrer une adresse email valide.");
      emailInput.classList.add("error");
    } else {
      // Traitez ici la logique de réinitialisation du mot de passe
      console.log("Email:", emailInput.value);
    }
  };

  return (
    <form id="forgot-password" className="input-box">
      {/* Email */}
      <div className="login_div">
        <input
          className="login-input"
          id="fg-user-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          placeholder=" "
        />
        <label className="login-label" htmlFor="fg-user-email">
          Email
        </label>
        <div className="login-error">
          <svg
            className="login-error-icon"
            width="12px"
            height="12px"
            aria-hidden="true"
          >
            <use href="#warning" />
          </svg>
          <span id="fg-email-error" aria-live="assertive">
            {emailError}
          </span>
        </div>
      </div>

      {/* Bouton Send */}
      <button
        className="login-btn"
        type="button"
        onClick={handleForgotPassword}
      >
        Send
      </button>

      {/* Bouton Back */}
      <button
        className="login-btn login__btn--secondary"
        type="button"
        onClick={loginHandler}
      >
        Back
      </button>
    </form>
  );
}

function FContinue({ passwordHandler }) {
  const handleContinue = (e) => {
    e.preventDefault(); // Prevent the default form submission

    const nameInput = document.getElementById("user-name");
    const emailInput = document.getElementById("register-user-email");
    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("register-email-error");
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Clear previous errors
    nameError.textContent = "";
    emailError.textContent = "";
    nameInput.classList.remove("error");
    emailInput.classList.remove("error");

    // Validate the inputs
    if (!nameInput.value.trim() && !emailInput.value.trim()) {
      nameError.textContent = "Champ requis.";
      nameInput.classList.add("error");
      emailError.textContent = "Champ requis.";
      emailInput.classList.add("error");
    } else {
      if (nameInput.value.trim().length < 4) {
        nameError.textContent = "Le nom doit contenir au moins 4 lettres.";
        nameInput.classList.add("error");
      } else if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = "Veuillez entrer une adresse email valide.";
        emailInput.classList.add("error");
      } else {
        passwordHandler({
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
        }); // Proceed to the next step
      }
    }
  };

  return (
    <form id="register" className="input-box" onSubmit={handleContinue}>
      {/* Name */}
      <div className="login_div">
        <input
          className="login-input"
          id="user-name"
          type="text"
          name="name"
          autoComplete="off"
          placeholder=" "
        />
        <label className="login-label" htmlFor="user-name">
          Name
        </label>
        <div className="login-error">
          <svg
            className="login-error-icon"
            width="12px"
            height="12px"
            aria-hidden="true"
          >
            <use href="#warning" />
          </svg>
          <span id="name-error" aria-live="assertive"></span>
        </div>
      </div>

      {/* Email */}
      <div className="login_div">
        <input
          className="login-input"
          id="register-user-email"
          type="email"
          name="email"
          autoComplete="off"
          placeholder=" "
        />
        <label className="login-label" htmlFor="register-user-email">
          Email
        </label>
        <div className="login-error">
          <svg
            className="login-error-icon"
            width="12px"
            height="12px"
            aria-hidden="true"
          >
            <use href="#warning" />
          </svg>
          <span id="register-email-error" aria-live="assertive"></span>
        </div>
      </div>

      {/* Continue Button */}
      <button
        className="login-btn"
        type="submit" // Change the type to "submit"
        data-action="register_continue"
      >
        Continue
      </button>

      {/* Social buttons */}
      <div className="login__or">Or Continue With</div>
      <div className="login__social">
        <button
          className="login__social-btn login__social-btn--google"
          type="button"
          title="Google"
        >
          <svg
            className="login__social-icon"
            width="16px"
            height="16px"
            aria-hidden="true"
          >
            <use href="#google" />
          </svg>
        </button>
        <button
          className="login__social-btn login__social-btn--apple"
          type="button"
          title="Apple"
        >
          <svg
            className="login__social-icon"
            width="16px"
            height="16px"
            aria-hidden="true"
          >
            <use href="#apple" />
          </svg>
        </button>
        <button
          className="login__social-btn login__social-btn--fb"
          type="button"
          title="Facebook"
        >
          <svg
            className="login__social-icon"
            width="16px"
            height="16px"
            aria-hidden="true"
          >
            <use href="#fb" />
          </svg>
        </button>
      </div>
    </form>
  );
}

function FRegister({
  togglePasswordVisibility,
  isPasswordVisible2,
  isPasswordVisible3,
  registerHandler,
  name,
  email,
  showLoader,
  hideLoader,
  navigate,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const password1 = document.querySelector("#pf-user-password1");
    const password2 = document.querySelector("#pf-user-password2");
    const error1 = document.getElementById("pf-password-error1");
    const error2 = document.getElementById("pf-password-error2");

    error1.textContent = "";
    error2.textContent = "";
    password1.classList.remove("error");
    password2.classList.remove("error");

    if (!password1.value.trim() && !password2.value.trim()) {
      error1.textContent = "Required";
      password1.classList.add("error");
      error2.textContent = "Required";
      password2.classList.add("error");
    } else {
      if (!password1.value.trim()) {
        error1.textContent = "Required";
        password1.classList.add("error");
      } else if (password1.value.length < 6) {
        error1.textContent = "Password must contain at least 6 characters.";
        password1.classList.add("error");
      } else if (!password2.value.trim()) {
        error2.textContent = "Please confirm your password.";
        password2.classList.add("error");
      } else if (password1.value !== password2.value) {
        error2.textContent = "Passwords do not match.";
        password2.classList.add("error");
      } else {
        // Proceed with registration logic here (e.g., API call)
        showLoader();
        const password = password1.value.trim();
        const clientData = {
          nom: name,
          prenom: "",
          email: email,
          password: password,
        };
        console.log(clientData);
        try {
          const registeredClient = await registerClient(clientData);
          console.log("Client enregistré:", registeredClient);
          navigate("/");
        } catch (err) {
          error2.textContent = err.message;
          password2.classList.add("error");
        } finally {
          hideLoader();
        }
      }
    }
  };

  return (
    <form id="password" className="input-box" onSubmit={handleSubmit}>
      {/* Password */}
      <div className="login_div">
        <input
          className="login-input"
          id="pf-user-password1"
          type={isPasswordVisible2 ? "text" : "password"}
          name="password"
          autoComplete="off"
          placeholder=" "
        />
        <label className="login-label" htmlFor="pf-user-password1">
          Password
        </label>
        <div className="login-error">
          <svg
            className="login-error-icon"
            width="12px"
            height="12px"
            aria-hidden="true"
          >
            <use href="#warning" />
          </svg>
          <span id="pf-password-error1" aria-live="assertive"></span>
        </div>
        <button
          className="login__eye"
          type="button"
          onClick={() => togglePasswordVisibility(2)}
          title="Show password"
        >
          <svg
            className={`login__eye-icon ${
              isPasswordVisible2 ? "show" : "hide"
            }`}
            width="24px"
            height="24px"
            data-icon="eye-on"
          >
            <use href="#eye-on" />
          </svg>
          <svg
            className={`login__eye-icon ${
              !isPasswordVisible2 ? "show" : "hide"
            }`}
            width="24px"
            height="24px"
            data-icon="eye-off"
          >
            <use href="#eye-off" />
          </svg>
        </button>
      </div>

      {/* Confirm Password */}
      <div className="login_div">
        <input
          className="login-input"
          id="pf-user-password2"
          type={isPasswordVisible3 ? "text" : "password"}
          name="password"
          autoComplete="off"
          placeholder=" "
        />
        <label className="login-label" htmlFor="pf-user-password2">
          Confirm Password
        </label>
        <div className="login-error">
          <svg
            className="login-error-icon"
            width="12px"
            height="12px"
            aria-hidden="true"
          >
            <use href="#warning" />
          </svg>
          <span id="pf-password-error2" aria-live="assertive"></span>
        </div>
        <button
          className="login__eye"
          type="button"
          onClick={() => togglePasswordVisibility(3)}
          title="Show password"
        >
          <svg
            className={`login__eye-icon ${
              isPasswordVisible3 ? "show" : "hide"
            }`}
            width="24px"
            height="24px"
            data-icon="eye-on"
          >
            <use href="#eye-on" />
          </svg>
          <svg
            className={`login__eye-icon ${
              !isPasswordVisible3 ? "show" : "hide"
            }`}
            width="24px"
            height="24px"
            data-icon="eye-off"
          >
            <use href="#eye-off" />
          </svg>
        </button>
      </div>

      <button className="login-btn" type="submit" data-action="continue">
        Sign Up
      </button>
      <button
        className="login-btn login__btn--secondary"
        type="button"
        data-action="back"
        id="back-register-btn"
        onClick={registerHandler}
      >
        Back
      </button>
    </form>
  );
}

export default LoginModal;
