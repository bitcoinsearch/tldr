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

// Function to generate HTML for each post
function generateHTMLForPost(post: NewsLetter) {
  const summary = marked(post.summary);
  const link = post.combined_summ_file_path;
  const datePublished = new Date(post.published_at).toDateString();
  const authors = post.authors.join(", ");
  const contributors = post.contributors.join(", ");
  const replies = post.n_threads;
  const originalPostLink = post.link;

  return `
    <div class="thread">
      <h3><strong>Title:</strong> <a href="${link}">${post.title}</a></h3>
      <h4>Summary of thread</h4>
      <p class="summary">${summary}</p>
      <p><strong>Source:</strong> ${post.dev_name}</p>
      <p><strong>Date of Original Post:</strong> ${datePublished}</p>
      <p><strong>Number of Replies:</strong> ${replies}</p>
      <p><strong>Authors:</strong> ${authors}</p>
      <p><strong>Contributors:</strong> ${contributors}</p>
      <button class="read-more-btn"><a href="${originalPostLink}">Read More</a></button>
    </div>
  `;
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
  }
  .card:hover {
    border-color: #999;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
  
  /* Threads */
  .thread {
    display: grid;
    align-items: start;
    background-color: #f9f9f9;
    border-radius: 10px;
    padding: 15px;
    margin: 15px 0;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .thread h3 {
    color: #444;
    margin-bottom: 5px;
  }

  .thread p {
    color: #666;
    margin-left: 10px; 
    margin-bottom: 8px;
    margin-top: 0;
    line-height: 1.2;
  }
  
  .thread a {
    color: #007BFF;
    text-decoration: none;
  }
  
  .thread a:hover {
    text-decoration: underline;
  }
  
  h4 {
    color: #333;
    margin-top: 3px;
  }

  h4 + .summary {
    font-size: 12px;
    color: #666;
    margin-top: 0;
    line-height: 1.5;
  }

  .read-more-btn {
    background-color: #007BFF;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
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
              <p>${summaryHtml}</p>
          </div>
      </div>

      <h2>New Threads This Week</h2>
      <!-- Loop through new threads -->
      ${data.new_threads_this_week
        .map(
          (thread) => `<div class="card">${generateHTMLForPost(thread)}</div>`
        )
        .join("")}

      <h2>Active Posts This Week</h2>
      <!-- Loop through active posts -->
      ${data.active_posts_this_week
        .map((post) => `<div class="card">${generateHTMLForPost(post)}</div>`)
        .join("")}
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
