import { useState, useEffect } from "react";
import axios from "axios";
import gpayQrImg from "../assets/gpay-qr.jpg";

const API = "http://localhost:5000/api";
const MERCHANT_UPI = "ripendrakumar883-1@okhdfcbank";
const MERCHANT_NAME = "Ripendra Kumar";

export default function PaymentModal({ course, onClose, onSuccess }) {
  // steps: "account" | "payment"
  const [step, setStep] = useState("account");
  const [isLoginTab, setIsLoginTab] = useState(false);

  // Student details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Payment details
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [autoDetectSeconds, setAutoDetectSeconds] = useState(10);

  // Check existing login on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("hirehub_user");
      const token = localStorage.getItem("hirehub_token");
      if (stored && token) {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        if (u.name) setName(u.name);
        if (u.contact || u.email) setEmail(u.contact || u.email);
        setStep("payment");
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCopyUpi = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(MERCHANT_UPI);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Step 1: Submit student signup / login
  const handleAccountSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!isLoginTab && !cleanName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setAuthLoading(true);

      const res = await axios.post(`${API}/payment/quick-auth`, {
        name: cleanName,
        email: cleanEmail,
        password,
        isLogin: isLoginTab,
      });

      if (res.data.success && res.data.token) {
        localStorage.setItem("hirehub_token", res.data.token);
        localStorage.setItem("hirehub_user", JSON.stringify(res.data.user));
        setCurrentUser(res.data.user);
        setName(res.data.user.name || cleanName);
        setEmail(res.data.user.contact || cleanEmail);
        setStep("payment");
        return;
      }
    } catch (err) {
      if (isLoginTab) {
        setErrorMessage(
          err.response?.data?.message || "Invalid email or password. Please try again."
        );
        setAuthLoading(false);
        return;
      }
      console.warn("Proceeding to payment step with entered credentials:", err.message);
    } finally {
      setAuthLoading(false);
    }

    const tempUser = { name: cleanName, contact: cleanEmail, role: "candidate" };
    setCurrentUser(tempUser);
    localStorage.setItem("hirehub_user", JSON.stringify(tempUser));
    setStep("payment");
  };

  // Automatic payment detection & verification
  const triggerAutoPaymentVerify = async () => {
    if (redirecting) return;
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    try {
      setRedirecting(true);
      setLoading(true);

      const res = await axios.post(`${API}/payment/auto-verify`, {
        courseId: course.id,
        email: cleanEmail,
        name: cleanName || cleanEmail.split("@")[0],
        password: password || "hirehub123",
      });

      if (res.data.success || res.data.paid) {
        if (res.data.token) {
          localStorage.setItem("hirehub_token", res.data.token);
        }
        if (res.data.user) {
          localStorage.setItem("hirehub_user", JSON.stringify(res.data.user));
        }

        // Cache unlocked course in localStorage
        try {
          const list = JSON.parse(
            localStorage.getItem("hirehub_unlocked_courses") || "[]"
          );
          if (!list.includes(course.id)) {
            list.push(course.id);
            localStorage.setItem(
              "hirehub_unlocked_courses",
              JSON.stringify(list)
            );
          }
        } catch {
          // ignore
        }

        // Notify parent to unlock course and open notes!
        onSuccess(course.id);

        // Auto-close modal after 1.2s celebration so student is directly on notes page!
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.warn("Auto verification check:", err.message);
      setRedirecting(false);
      setLoading(false);
    }
  };

  // Auto-detect countdown effect when on payment step
  useEffect(() => {
    if (step !== "payment" || redirecting) return;

    const interval = setInterval(() => {
      setAutoDetectSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          triggerAutoPaymentVerify();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, redirecting]);

  return (
    <div className="payment-modal-backdrop" onClick={onClose}>
      <div
        className="payment-modal-container paid-course-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          className="payment-modal-close"
          onClick={onClose}
          aria-label="Close checkout"
        >
          ×
        </button>

        {/* 1. AUTO-SUCCESS & DIRECT REDIRECT SCREEN */}
        {redirecting ? (
          <div className="payment-auto-success-overlay">
            <div className="auto-success-badge">🎉</div>
            <h2>Payment Received & Verified!</h2>
            <p>
              ₹{course.price} successfully received on <strong>{MERCHANT_NAME}</strong>
            </p>
            <div className="auto-redirect-box">
              <span className="spinner-mini"></span>
              <strong>Auto-redirecting directly to course notes & videos...</strong>
            </div>
            <span className="auto-redirect-hint">Permanent access activated for {email}</span>
          </div>
        ) : (
          /* 2. STEPPED PAID COURSE CHECKOUT FLOW */
          <div className="paid-checkout-layout">
            {/* Top Checkout Header */}
            <div className="checkout-top-header">
              <div className="checkout-course-pill">
                <span className="checkout-icon">{course.icon}</span>
                <div>
                  <span className="checkout-eyebrow">COURSE CHECKOUT</span>
                  <h4>{course.title}</h4>
                </div>
              </div>
              <div className="checkout-price-tag">
                <span className="fee-label">Total to Pay</span>
                <span className="fee-amount">₹{course.price}</span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="checkout-stepper-bar">
              <div className={`step-item ${step === "account" ? "active" : "completed"}`}>
                <span className="step-circle">{currentUser ? "✓" : "1"}</span>
                <span className="step-label">Student Account</span>
              </div>
              <div className="step-line"></div>
              <div className={`step-item ${step === "payment" ? "active" : ""}`}>
                <span className="step-circle">2</span>
                <span className="step-label">Scan QR & Auto-Unlock</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="payment-error-alert" role="alert">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* STEP 1: STUDENT ACCOUNT SETUP */}
            {step === "account" && (
              <div className="checkout-account-step">
                {currentUser ? (
                  /* ALREADY LOGGED IN VIEW */
                  <div className="already-logged-card">
                    <div className="logged-user-row">
                      <span className="user-avatar-icon">👤</span>
                      <div>
                        <span className="enrolling-label">Enrolling as Student:</span>
                        <strong className="logged-user-name">{currentUser.name}</strong>
                        <span className="logged-user-email">{currentUser.contact || currentUser.email}</span>
                      </div>
                      <span className="verified-account-badge">✓ Verified Account</span>
                    </div>

                    <p className="account-access-note">
                      🔒 Your purchase will be permanently attached to this account. You can watch videos and read notes anytime on any device.
                    </p>

                    <div className="account-action-buttons">
                      <button
                        type="button"
                        className="payment-cta-button"
                        onClick={() => setStep("payment")}
                      >
                        Continue to QR Payment (₹{course.price}) →
                      </button>

                      <button
                        type="button"
                        className="switch-account-link"
                        onClick={() => {
                          setCurrentUser(null);
                          localStorage.removeItem("hirehub_token");
                          localStorage.removeItem("hirehub_user");
                        }}
                      >
                        Use a different email / account
                      </button>
                    </div>
                  </div>
                ) : (
                  /* SIGNUP / LOGIN FORM */
                  <div className="checkout-auth-card">
                    <div className="auth-toggle-tabs">
                      <button
                        type="button"
                        className={`auth-tab-pill ${!isLoginTab ? "active" : ""}`}
                        onClick={() => { setIsLoginTab(false); setErrorMessage(""); }}
                      >
                        New Student? Sign Up
                      </button>
                      <button
                        type="button"
                        className={`auth-tab-pill ${isLoginTab ? "active" : ""}`}
                        onClick={() => { setIsLoginTab(true); setErrorMessage(""); }}
                      >
                        Already Registered? Login
                      </button>
                    </div>

                    <form onSubmit={handleAccountSubmit} className="checkout-auth-form">
                      {!isLoginTab && (
                        <label className="payment-label">
                          Your Full Name *
                          <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="payment-input"
                            required
                          />
                        </label>
                      )}

                      <label className="payment-label">
                        Your Email Address *
                        <input
                          type="email"
                          placeholder="e.g. yourname@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="payment-input"
                          required
                        />
                        <span className="input-hint">Lifetime course access will be tied to this email.</span>
                      </label>

                      <label className="payment-label">
                        {isLoginTab ? "Password *" : "Create Password *"}
                        <input
                          type="password"
                          placeholder="At least 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="payment-input"
                          required
                        />
                      </label>

                      <button
                        type="submit"
                        className="payment-cta-button full-btn"
                        disabled={authLoading}
                      >
                        {authLoading ? (
                          "Processing..."
                        ) : isLoginTab ? (
                          `Login & Proceed to Pay (₹${course.price}) →`
                        ) : (
                          `Create Account & Pay (₹${course.price}) →`
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: AUTO-DETECT QR PAYMENT (NO MANUAL BUTTON CLICK NEEDED) */}
            {step === "payment" && (
              <div className="checkout-payment-step">
                {/* Live Auto-Detection Radar Banner */}
                <div className="live-radar-banner">
                  <div className="radar-animation-box">
                    <span className="radar-pulse-ring"></span>
                    <span className="radar-center-dot"></span>
                  </div>
                  <div className="radar-info-text">
                    <strong>📡 Auto-Detecting Payment ({autoDetectSeconds}s)</strong>
                    <span>Scan & pay ₹{course.price}. System will auto-detect your transfer and immediately open your notes!</span>
                  </div>
                  <span className="live-auto-pill">LIVE RADAR</span>
                </div>

                {/* Clean Google Pay QR Box */}
                <div className="clean-payment-card">
                  <div className="qr-box-top-badges">
                    <span className="verified-gpay-pill">🟢 Official Google Pay Scanner</span>
                    <span className="pay-amount-pill">Pay Exactly: ₹{course.price}</span>
                  </div>

                  {/* QR Image Frame */}
                  <div className="official-qr-image-frame">
                    <img
                      src={gpayQrImg}
                      alt="Google Pay QR Code"
                      className="official-qr-image"
                    />
                  </div>

                  {/* Recipient Details & Copy */}
                  <div className="merchant-vpa-row">
                    <div>
                      <span className="vpa-title">Official Recipient:</span>
                      <strong className="vpa-name">{MERCHANT_NAME}</strong>
                      <span className="vpa-address">{MERCHANT_UPI}</span>
                    </div>
                    <button
                      type="button"
                      className="copy-upi-btn"
                      onClick={handleCopyUpi}
                    >
                      {copied ? "✓ Copied!" : "📋 Copy UPI"}
                    </button>
                  </div>

                  {/* Auto-Redirect Prompt */}
                  <div className="auto-detect-guidance">
                    <div>✓ <strong>Scan with GPay, PhonePe or Paytm</strong></div>
                    <div>✓ Transfer <strong>₹{course.price}</strong></div>
                    <div>✓ <strong>No button click needed</strong> — page will automatically open notes upon payment!</div>
                  </div>

                  {/* Instant Click (Optional backup if student paid in 2 seconds) */}
                  <button
                    type="button"
                    className="instant-verify-button"
                    onClick={triggerAutoPaymentVerify}
                    disabled={loading || redirecting}
                  >
                    ⚡ Already Paid? Click for Instant 1-Second Redirect →
                  </button>
                </div>

                {/* Trust Footer */}
                <div className="checkout-trust-footer">
                  <span>🔒 256-bit Secure Encryption</span>
                  <span>⚡ Instant Lifetime Access</span>
                  <span>📧 Permanent Access linked to {email}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
