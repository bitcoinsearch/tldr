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

function getWeekCovered() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);

  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };

  const startFormatted = new Intl.DateTimeFormat("en-US", options).format(
    startDate
  );
  const endFormatted = new Intl.DateTimeFormat("en-US", options).format(
    endDate
  );

  return `${startFormatted} - ${endFormatted}`;
}

function generateHTMLForPost(post: NewsLetter) {
  const summary = marked(post.summary);
  const link = post.combined_summ_file_path;
  const datePublished = new Date(post.published_at).toDateString();
  const authors = post.authors.join(", ");
  const contributors = post.contributors.join(", ");
  const replies = post.n_threads;
  const originalPostLink = post.link;

  // Function to generate HTML for a key-value pair, only if the value is not empty
  function generateKeyValueHTML(key?: string, value?: string | number) {
    if (value) {
      return key
        ? `<p><strong>${key}:</strong> ${value}</p>`
        : `<p>${value}</p>`;
    }
    return "";
  }

  // Generate HTML for each key-value pair, excluding empty values
  //undefined key means we don't want to display the key
  const htmlContent = `
      <div class="thread">
        <h2><a href="${link}">${post.title}</a></h2>
        <div class="post-details">
          ${generateKeyValueHTML(undefined, summary)}
          ${generateKeyValueHTML(undefined, post.dev_name)}
          ${generateKeyValueHTML(undefined, datePublished)}
          ${generateKeyValueHTML("Replies", replies)}
          ${generateKeyValueHTML("Author(s)", authors)}
          ${generateKeyValueHTML("Contributor(s)", contributors)}
        </div>
        <a href="${originalPostLink}" class="read-more-btn">Original Post</a>
      </div>
  `;

  return htmlContent;
}

// Function to generate the HTML content for the newsletter
function generateHTMLTemplate(data: NewsLetterDataType) {
  let words = data.summary_of_threads_started_this_week.split(" ");
  let summary = words.slice(0, 300).join(" ");
  let summaryHtml = marked(summary);

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    /* Reset some default styles */
    body, h1, h2, h3, h4, p {
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: Arial, sans-serif;
      color: #333;
      background-color: #f4f4f4;
      text-align: justify;
    }
    
    .container {
      width: 95%;
      margin: auto;
    }
    
    /* Headings */
    h1 {
      font-weight: bold;
      font-size: 28px;
      background-color: #444; /* Darker background for contrast */
      color: #fff;
      padding: 15px 0;
      text-align: center;
      border-radius: 10px 10px 0 0; /* Rounded top corners */
    }
    
    h2 {
      color: #333;
      margin-top: 30px;
      margin-bottom: 20px;
      font-size: 20px;
      font-weight: 500;
    }
    
    /* Cards */
    .card {
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 10px; 
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); 
    }
    
    .card p {
      color: #666;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .card:hover {
      border-color: #999;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
    }
    
    /* Threads */
    .thread {
      background-color: #f9f9f9;
      border-radius: 5px;
      padding: 20px;
      margin-bottom: 20px;
      font-family: Arial, sans-serif;
    }
  
    .thread h2 {
      margin: 0 0 10px ;
      color: #333;
    }
  
    .thread h2 a {
      text-decoration: underline;
      color: #333;
    }
  
    .thread .summary {
      color: #666;
      margin-bottom: 10px;
    }
  
    .thread p {
      margin: 0 0 10px 0;
    }
  
    .thread .read-more-btn {
      display: inline-block;
      background-color: #000;
      color: #fff;
      text-decoration: none;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 14px;
    }
  
    .thread .read-more-btn:hover {
      background-color: #0056b3;
    }
    /* Media query for smaller screens */
    @media (max-width: 600px) {
      .thread {
        width: 100%;
        padding: 10px;
      }
    }
    </style>
    </head>
    <body>
    <div class="container">
    <h1> TLDR Newsletter for ${getWeekCovered()}</h1>
        <div>
            <h2>Summary of Threads Started This Week</h2>
            <div class="card">
                <p style="margin-bottom: 20px;">${summaryHtml}</p>
            </div>
        </div>
  
        <!-- New Threads This Week -->
        ${data.new_threads_this_week.length > 0
          ? `<h2>New Threads This Week</h2>` +
            data.new_threads_this_week
              .map((thread) => `<div class="card">${generateHTMLForPost(thread)}</div>`)
              .join("")
          : '<p>No new threads this week.</p>'}

  
        <!-- Active Posts This Week -->
          ${data.active_posts_this_week.length > 0
            ? `<h2>Active Posts This Week</h2>` +
              data.active_posts_this_week
                .map((post) => `<div class="card">${generateHTMLForPost(post)}</div>`)
                .join("")
            : '<p>No active posts this week.</p>'}
    </div>
  </body>
  </html>`;

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
          from_name: "Bitcoin Dev Project",
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
