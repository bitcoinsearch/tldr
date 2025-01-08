"use client";
import React from "react";

const MailchimpSubscribeForm = ({ className }: { className?: string }) => {
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
    <form onSubmit={handleSubmit} method='post' id='mc-embedded-subscribe-form' name='mc-embedded-subscribe-form'>
      <div className={`relative w-full max-w-[530px] flex items-center justify-center ${className}`}>
        <input
          className={`rounded-full bg-gray-custom-300 border border-gray-custom-400 h-14 w-full max-w-[530px] placeholder:text-gray-custom-500 placeholder:font-normal text-base pl-4 ${className}`}
          placeholder='Enter your email'
          type='email'
          name='EMAIL'
          id='mce-EMAIL'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className={`text-base leading-[18.32px] font-medium text-white bg-orange-custom-100 rounded-full py-4 px-6 w-fit text-nowrap absolute right-1 ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
          type='submit'
          name='subscribe'
          id='mc-embedded-subscribe'
          value='Subscribe Now'
          disabled={loading}
        />
      </div>
      <div id='mce-responses' className='pt-2 max-w-[530px]'>
        <div className='px-2 pb-4'>
          {mailchimpResponse && <p className='text-green-500 font-gt-walsheim'>{mailchimpResponse}</p>}
          {error && <p className='text-red-500 font-gt-walsheim'>{error}</p>}
        </div>
      </div>
    </form>
  );
};

export default MailchimpSubscribeForm;
