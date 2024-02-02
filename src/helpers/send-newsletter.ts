const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { marked } = require("marked");

dotenv.config();

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

type NewsLetter = {
  id: string;
  title: string;
  link: string;
  authors: Array<string>;
  published_at: string;
  summary: string;
  n_threads: number;
  dev_name: string;
  contributors: Array<string>;
  file_path: string;
  combined_summ_file_path: string;
};

type NewsLetterDataType = {
  summary_of_threads_started_this_week: string;
  new_threads_this_week: Array<NewsLetter>;
  active_posts_this_week: Array<NewsLetter>;
};

// get most recent newsletter from newsletter.json
const getCurrentNewsletter = (): NewsLetterDataType | null => {
  try {
    const newsletterPath = path.resolve(
      __dirname,
      "../../public/static/static/newsletters/newsletter.json"
    );
    const data = fs.readFileSync(newsletterPath, "utf-8");
    const parsedData = JSON.parse(data) as NewsLetterDataType;
    return parsedData;
  } catch (err) {
    console.error(err); // Log the error message
    return null;
  }
};


function generateHTMLForPost(post: NewsLetter) {
  const summary = marked(post.summary);
  const link = post.combined_summ_file_path;
  const datePublished = new Date(post.published_at).toDateString();
  const authors = post.authors.join(', ');
  const contributors = post.contributors.join(', ');
  const replies = post.n_threads;

  return `
    <div>
      <h3>${post.title}</h3>
      <p>${summary}</p>
      <p><strong>Source:</strong> ${post.dev_name}</p>
      <p><strong>Date of Original Post:</strong> ${datePublished}</p>
      <p><strong>Number of Replies:</strong> ${replies}</p>
      <p><strong>Authors:</strong> ${authors}</p>
      <p><strong>Contributors:</strong> ${contributors}</p>
      <a href="${link}">Read more</a>
    </div>
  `;
}

// This funtion creates the HTML content for the newsletter
function generateHTMLTemplate(data: NewsLetterDataType) {
  // Split the summary into words
  let words = data.summary_of_threads_started_this_week.split(" ");
  // Take the first 300 words
  let summary = words.slice(0, 300).join(" ");
  // Convert the summary to HTML using marked
  let summaryHtml = marked(summary);

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    body {
      font-family: Arial, sans-serif;
      color: #ddd;
      background-color: #000; 
      margin: 0;
      padding: 0;
    }
    
    h1 {
      background-color: #ddd; 
      color: #000; /* black text */
      padding: 10px 0;
      text-align: center;
      font-size: 2em;
      margin-bottom: 20px;
    }
    
    h2 {
      color: #ddd; 
      margin-top: 40px;
      margin-bottom: 20px;
    }
    
    p {
      font-size: 1em;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    
    a {
      color: #ddd; 
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    div {
      border-bottom: 1px solid #555; 
      padding-bottom: 20px;
    }
    
    h3 {
      font-size: 1.5em;
      margin-bottom: 10px;
    }
    </style>
    </head>
    <body>
      <h1>TLDR Newsletter</h1>
      <h2>Summary of Threads Started This Week</h2>
      <p>${summaryHtml}</p>
      <h2>New Threads This Week</h2>
  `;

    // This loop add each new thread to the HTML
    data.new_threads_this_week.forEach((thread) => {
      html += generateHTMLForPost(thread);
    });
  
    // section for active posts
    html += '<h2>Active Posts This Week</h2>';
  
    // This loop add each active post to the HTML
    data.active_posts_this_week.forEach((post) => {
      html += generateHTMLForPost(post);
    });

  html += `
    </body>
    </html>
  `;

  return html;
}

// send newsletter to mailchimp list
const sendNewsletter = async (): Promise<void> => {
  try {
    const currentNewsletter = getCurrentNewsletter();
    if (!currentNewsletter) {
      console.error("Failed to get current newsletter");
      return;
    }

    const htmlContent = generateHTMLTemplate(currentNewsletter);

    // Only send the newsletter if the environment is production
    if (process.env.NODE_ENV === "production") {
      const campaignResponse = await mailchimp.campaigns.create({
        type: "regular",
        recipients: {
          list_id: process.env.MAILCHIMP_LIST_ID,
        },
        settings: {
          subject_line: "TLDR Newsletter",
          title: "Your weekly newsletter is here",
          from_name: "Chaincode Labs",
          reply_to: process.env.MAILCHIMP_REPLY_TO,
          auto_footer: false,
        },
      });

      await mailchimp.campaigns.setContent(campaignResponse.id, {
        html: htmlContent,
      });

      await mailchimp.campaigns.send(campaignResponse.id);

      console.log("Newsletter sent successfully");
    } else {
      console.log("Not in production environment, skipping email send");
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

sendNewsletter();
