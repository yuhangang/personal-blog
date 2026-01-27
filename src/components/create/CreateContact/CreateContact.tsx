"use client";

import { useState, useRef, useEffect } from "react";
import MessyThreads from "../../common/MessyThreads/MessyThreads";
import styles from "./CreateContact.module.scss";

import Turnstile from "../../common/Turnstile/Turnstile";

export default function CreateContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    business: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [captchaToken, setCaptchaToken] = useState<string | null>(
    process.env.NODE_ENV === "development" ? "dev_bypass" : null,
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true);
  }, []);

  // Refs for navigation
  const emailRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const businessRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const validateField = (name: string, value: string) => {
    if (name === "name" && !value.trim()) return "Name is required";
    if (name === "email") {
      if (!value.trim()) return "Email is required";
      if (!/^\S+@\S+\.\S+$/.test(value)) return "Please enter a valid email";
    }
    if (name === "message" && !value.trim()) return "Message is required";
    return "";
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    fieldName: string,
    nextRef: React.RefObject<HTMLElement | null>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const error = validateField(
        fieldName,
        formData[fieldName as keyof typeof formData],
      );
      if (error) {
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
      } else {
        setErrors((prev) => ({ ...prev, [fieldName]: "" }));
        nextRef.current?.focus();
      }
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const nameError = validateField("name", formData.name);
    if (nameError) newErrors.name = nameError;
    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;
    const messageError = validateField("message", formData.message);
    if (messageError) newErrors.message = messageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (!captchaToken) {
      alert("Please complete the verification check.");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          token: captchaToken,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          website: "",
          business: "",
          message: "",
        });
        // Reset token
        setCaptchaToken(
          process.env.NODE_ENV === "development" ? "dev_bypass" : null,
        );
      } else {
        setStatus("error");
        alert(data.error || "Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      alert("An error occurred.");
    }
  };

  if (status === "success") {
    return (
      <section className={styles.section} id="contact">
        <div className={styles.container}>
          <div className={`${styles.fullWidth} ${styles.successContainer}`}>
            <div className={styles.successIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className={styles.successTitle}>Message Sent</h2>
            <p className={styles.successText}>
              Thank you for reaching out. We&apos;ve received your message and
              will get back to you within 24-48 hours.
            </p>
            <button
              className={styles.resetBtn}
              onClick={() => setStatus("idle")}
            >
              Send Another Message
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="contact">
      <div className={styles.container}>
        {/* Left Column: Text */}
        <div className={styles.textColumn}>
          <div className={styles.backgroundLayer}>
            <MessyThreads />
          </div>
          <div>
            <h2 className={styles.headline}>
              Ready to <em>elevate</em> your brand?
            </h2>
            <p className={styles.subhead}>
              Tell us about your project. We&apos;re ready to listen.
            </p>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className={styles.formColumn}>
          <form className={styles.formGrid} onSubmit={handleContactSubmit}>
            <div className={styles.inputGroup}>
              <label>Your Name *</label>
              <input
                type="text"
                className={errors.name ? styles.errorInput : ""}
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                onKeyDown={(e) => handleKeyDown(e, "name", emailRef)}
                suppressHydrationWarning
              />
              {errors.name && (
                <span className={styles.errorMessage}>{errors.name}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Email *</label>
              <input
                ref={emailRef}
                type="email"
                className={errors.email ? styles.errorInput : ""}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                onKeyDown={(e) => handleKeyDown(e, "email", websiteRef)}
                suppressHydrationWarning
              />
              {errors.email && (
                <span className={styles.errorMessage}>{errors.email}</span>
              )}
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Your Website / Social Link</label>
              <input
                ref={websiteRef}
                type="text"
                value={formData.website}
                placeholder="e.g. yourwebsite.com"
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                onKeyDown={(e) => handleKeyDown(e, "website", businessRef)}
                suppressHydrationWarning
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Your Business Name</label>
              <input
                ref={businessRef}
                type="text"
                value={formData.business}
                onChange={(e) =>
                  setFormData({ ...formData, business: e.target.value })
                }
                onKeyDown={(e) => handleKeyDown(e, "business", messageRef)}
                suppressHydrationWarning
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Message *</label>
              <textarea
                ref={messageRef}
                rows={4}
                className={errors.message ? styles.errorInput : ""}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: "" });
                }}
                suppressHydrationWarning
              />
              {errors.message && (
                <span className={styles.errorMessage}>{errors.message}</span>
              )}
            </div>

            {/* --- SHARED TURNSTILE --- */}
            {isMounted && process.env.NODE_ENV !== "development" && (
              <div className={styles.fullWidth} style={{ marginTop: "16px" }}>
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                  onVerify={(token) => setCaptchaToken(token)}
                />
              </div>
            )}

            <div className={styles.buttonWrapper}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "SENDING..." : "SEND"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
