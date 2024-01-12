"use client";

import React from "react";

const MailchimpSubscribeForm = () => {
  const [email, setEmail] = React.useState("");
  const [mailchimpResponse, setMailchimpResponse] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMailchimpResponse("");
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      setLoading(false);
      if (response.ok) {
        const data = await response.json();
        // console.log({ data });
        setMailchimpResponse(data.message);
        setEmail("");
        return;
      }
      if (response.status === 400) {
        const data = await response.json();
        if (data?.title?.toLowerCase().includes("member exists")) {
          setError("You are already subscribed to our newsletter");
          return;
        }
      }
      throw new Error("Something went wrong. Please try again later.");
    } catch (error: any) {
      setLoading(false);
      console.error({ error });
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <div id="mc_embed_shell">
        <div
          id="mc_embed_signup"
          className="bg-white w-full md:w-[600px] clear-left text-[15px]"
        >
          <form
            onSubmit={handleSubmit}
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            className="validate"
          >
            <div id="mc_embed_signup_scroll">
              <div className="mc-field-group">
                <h2>Subscribe to our weekly newsletter</h2>
                <p className="text-[15px] leading-6">
                  Get the latest updates on the community, upcoming topics, and
                  new discussions in your inbox every month.
                </p>
              </div>
              <div className="mc-field-group">
                <label htmlFor="mce-EMAIL">
                  Email Address <span className="asterisk">*</span>
                </label>
                <input
                  type="email"
                  name="EMAIL"
                  className="required email"
                  id="mce-EMAIL"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span id="mce-EMAIL-HELPERTEXT" className="helper_text"></span>
              </div>
              <div hidden>
                <input type="hidden" name="tags" value="6514641" />
              </div>
              <div id="mce-responses" className="clear">
                <div className="px-2 pb-4">
                  {mailchimpResponse && (
                    <p className="text-green-500">{mailchimpResponse}</p>
                  )}
                  {error && <p className="text-red-500">{error}</p>}{" "}
                </div>
              </div>
              <div aria-hidden="true" className="absolute left-[-5000px]">
                <input
                  type="text"
                  name="b_718f9c0ab4af9b4acf93a8e6f_6d27e4b5b0"
                  tabIndex={-1}
                  readOnly
                />
              </div>
              <div className="clear">
                <input
                  type="submit"
                  name="subscribe"
                  id="mc-embedded-subscribe"
                  className={`button ${
                    loading ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  value="Subscribe"
                  disabled={loading}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MailchimpSubscribeForm;
