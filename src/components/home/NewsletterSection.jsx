import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;


    setStatus("sending");
    setTimeout(() => {
      setStatus("done");
      setEmail("");
    }, 600);
  }

  return (

    <section className="bg-slate-50 dark:bg-slate-950 pt-15">
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-12 text-center sm:px-12">
          <FaEnvelope className="mx-auto mb-4 text-3xl text-white/90" />

          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Stay Updated
          </h2>

          <p className="mx-auto mt-3 max-w-md text-indigo-100">
            Subscribe to our newsletter and get exclusive deals and new
            arrivals first.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-indigo-200 outline-none focus:border-white/40"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-lg bg-white px-6 py-2.5 font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-70"
            >
              {status === "sending"
                ? "Subscribing..."
                : status === "done"
                  ? "Subscribed!"
                  : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}