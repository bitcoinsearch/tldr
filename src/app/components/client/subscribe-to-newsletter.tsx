"use client";

import React from "react";
import * as cheerio from "cheerio";

const MailchimpSubscribeForm = () => {
  const [email, setEmail] = React.useState("");
  const [mailchimpResponse, setMailchimpResponse] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMailchimpResponse("");
    try {
      const response = await fetch("/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ EMAIL: email }).toString(),
      });
      if (response.ok) {
        const data = await response.json();
        setMailchimpResponse(data);
        setEmail("");
      }
    } catch (error) {
      console.log({ error });
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
                <h2>Subscribe to our monthly newsletter</h2>
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
                  {parseMailchimpResponse(mailchimpResponse).success ? (
                    <p className="text-green-500">
                      {parseMailchimpResponse(mailchimpResponse).successText}
                    </p>
                  ) : (
                    <p className="text-red-500">
                      {parseMailchimpResponse(mailchimpResponse).errorText}
                    </p>
                  )}{" "}
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
                  className="button"
                  value="Subscribe"
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

const parseMailchimpResponse = (response: string) => {
  const $ = cheerio.load(response);
  const successH2Text = $("h2").text().includes("Subscription Confirmed");
  const hasSuccessPText = $("p")
    .text()
    .includes("Your subscription to our list has been confirmed.");
  const successText = hasSuccessPText && $("p").text();

  const errorDiv = $("div").hasClass("formstatus error");
  const errorDivText = $("div.formstatus.error")
    .text()
    .includes("There are errors below");
  const hasErrorText = $("div").hasClass("errorText");
  const errorText = hasErrorText && $("div.errorText").text();

  const error = errorDiv && errorText && hasErrorText && errorDivText;
  const success = successH2Text && successText && !error;
  return {
    success: !!success,
    successText,
    error: !!error,
    errorText,
  };
};
