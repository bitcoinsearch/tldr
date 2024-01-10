"use client";

import React, { useEffect } from "react";

declare global {
  interface Window {
    jQuery: any;
    fnames: any;
    ftypes: any;
  }
}

const action = process.env.NEWSLETTER_FORM_URL;

const MailchimpSubscribeForm = () => {
  const [email, setEmail] = React.useState("");

  const loadMailchimpScript = () => {
    const script = document.createElement("script");
    script.src = "//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (typeof window.jQuery !== "undefined") {
        (function ($) {
          window.fnames = new Array();
          window.ftypes = new Array();
          window.fnames[0] = "EMAIL";
          window.ftypes[0] = "email";
        })(window.jQuery);
        var $mcj = window.jQuery.noConflict(true);
      }
    };
  };

  useEffect(() => {
    // Check if the Mailchimp script is already loaded
    if (!window.jQuery || !window.jQuery.fn.jquery) {
      loadMailchimpScript();
    }
  }, []);

  return (
    <div>
      <div id="mc_embed_shell">
        <div
          id="mc_embed_signup"
          className="bg-white w-[600px] clear-left text-[15px]"
        >
          <form
            action={action as string}
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            className="validate"
            target="_blank"
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
                <div
                  className="response"
                  id="mce-error-response"
                  style={{ display: "none" }}
                ></div>
                <div
                  className="response"
                  id="mce-success-response"
                  style={{ display: "none" }}
                ></div>
              </div>
              <div
                aria-hidden="true"
                className="absolute left-[-5000px]"
              >
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
