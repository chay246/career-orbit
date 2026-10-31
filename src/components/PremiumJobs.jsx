import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "./Jobcard";

const API = "http://localhost:5000/api";

export default function PremiumJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsResponse, subscriptionResponse] = await Promise.all([
          axios.get(`${API}/jobs`),
          axios.get(`${API}/subscription/status`).catch(() => ({
            data: { active: false },
          })),
        ]);

        setJobs(jobsResponse.data.jobs || []);
        setSubscribed(subscriptionResponse.data.active === true);
      } catch (error) {
        setMessage("Jobs load nahi hui. Backend server check karo.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const premiumList = jobs.filter(
    (job) =>
      job.salary?.toUpperCase().includes("LPA") ||
      job.type?.toLowerCase() === "full-time"
  );

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubscribe = async () => {
    try {
      setPaying(true);
      setMessage("");

      const loaded = await loadRazorpay();

      if (!loaded) {
        setMessage("Payment checkout load nahi hua. Dobara try karo.");
        return;
      }

      // Backend securely creates the ₹10 payment order.
      const orderResponse = await axios.post(
        `${API}/payment/create-order`,
        { amount: 10 }
      );

      const order = orderResponse.data;

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "HireHub Premium",
        description: "Premium Jobs Subscription",
        order_id: order.id,

        handler: async (response) => {
          try {
            // Backend verifies Razorpay's payment signature.
            const verifyResponse = await axios.post(
              `${API}/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyResponse.data.verified === true) {
              setSubscribed(true);
              setMessage("Payment successful! Premium jobs unlocked.");
            } else {
              setMessage("Payment verify nahi ho payi. Support se contact karo.");
            }
          } catch {
            setMessage(
              "Payment verification pending hai. Status backend par check karo."
            );
          }
        },

        modal: {
          ondismiss: () => setMessage("Payment cancel kar di gayi."),
        },

        theme: { color: "#6c5ce7" },
      };

      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", () => {
        setMessage("Payment failed. Dobara try kar sakte ho.");
      });

      checkout.open();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Payment start nahi hui. Backend payment routes check karo."
      );
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <section className="section">Loading premium jobs...</section>;
  }

  return (
    <section className="section">
      <div
        className="section-heading"
        style={{
          background: "linear-gradient(135deg, #f3e7e9, #e3eeff)",
          padding: "2rem",
          borderRadius: "12px",
        }}
      >
        <p className="eyebrow" style={{ color: "#764ba2" }}>
          ⭐ VIP RECRUITER CHANNEL
        </p>

        <h2>Verified Premium Opportunities</h2>

        <p>
          Subscribe to unlock premium job opportunities and view their details.
        </p>
      </div>

      {!subscribed && (
        <div
          style={{
            marginTop: "24px",
            padding: "28px",
            borderRadius: "16px",
            border: "1px solid #ded7ff",
            background: "#faf9ff",
            textAlign: "center",
          }}
        >
          <h2>🔒 Unlock Premium Jobs</h2>
          <p>Get access to all available premium job listings.</p>

          <h1 style={{ color: "#6c5ce7", margin: "12px 0" }}>₹10</h1>
          <p>Subscription payment required to unlock.</p>

          <button
            onClick={handleSubscribe}
            disabled={paying}
            style={{
              background: "#6c5ce7",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              cursor: paying ? "wait" : "pointer",
              fontWeight: "bold",
            }}
          >
            {paying ? "Processing..." : "Unlock for ₹10"}
          </button>
        </div>
      )}

      {message && (
        <p role="status" style={{ marginTop: "16px" }}>
          {message}
        </p>
      )}

      <div className="job-grid" style={{ marginTop: "2rem" }}>
        {subscribed ? (
          premiumList.length ? (
            premiumList.map((job) => (
              <JobCard key={job._id || job.id} job={job} />
            ))
          ) : (
            <p>No premium jobs currently available.</p>
          )
        ) : (
          premiumList.map((job) => (
            <div
              key={job._id || job.id}
              style={{
                padding: "22px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                background: "#fff",
              }}
            >
              <h3>🔒 Premium Job</h3>
              <p>Subscribe to view this job's details.</p>
              <p style={{ color: "#777" }}>Job details locked</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}