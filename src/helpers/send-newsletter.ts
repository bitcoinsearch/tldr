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
  dev_name: DevName;
  contributors: Array<string>;
  file_path: string;
  combined_summ_file_path: string;
};

type NewsLetterDataType = {
  summary_of_threads_started_this_week: string;
  new_threads_this_week: Array<NewsLetter>;
  active_posts_this_week: Array<NewsLetter>;
};

const dev_name_config = {
  "bitcoin-dev": {
    name: "Bitcoin-dev",
    icon: "https://mcusercontent.com/5ed3a24c2a06c817a3182bbcb/images/b7ee5bb5-1250-0f03-932a-c33e7c38be0d.png",
  },
  "lightning-dev": {
    name: "Lightning-dev",
    icon: "lightning-dev_icon.svg",
  },
  delvingbitcoin: {
    name: "Delving bitcoin",
    icon: "https://mcusercontent.com/5ed3a24c2a06c817a3182bbcb/images/e6db0370-ed7c-249b-75b4-d8ebfdfc357c.png",
  },
};

// --brand-bg: #FFFAF0;
// --brand-hero: #FDE9C8;
// --brand-author: #FFF8EB;

type DevName = keyof typeof dev_name_config;

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
  const link = post.file_path;
  const combinedSummaryLink = post.combined_summ_file_path;
  const datePublished = new Date(post.published_at).toDateString();
  const authors = post.authors.join(", ");
  const contributors_rendered = post.contributors.slice(0, 2).join(", ");
  const contributors = post.contributors.length > 2 ? `${contributors_rendered} +${post.contributors.length - 2} ${post.contributors.length - 2 > 1 ? 'others': 'other'} ` : contributors_rendered;
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
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="width: 100%;">
            <div class="card" style="margin-top: 16px;">
              <a href="${link}" style="text-decoration: none; color: #000;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="width: 100%; white-space: nowrap; vertical-align: top;">
                      <table class="dev_name" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; margin-bottom: 8px; display: none;">
                        <tr style="width: 100%";>
                          <td style="width: 24px; padding-right: 4px; vertical-align: middle;">
                            <img src="${dev_name_config[post.dev_name].icon}" alt="" style="display: block; width: 24px; height: auto; margin-left: auto;" />
                          </td>
                          <td style="width: 1%; vertical-align: middle; white-space: nowrap; margin-left: auto;">
                            ${dev_name_config[post.dev_name].name}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-right: 8px;">
                      <h3 style="font-size: 18px; font-weight: 500; margin: 0;">
                        <a id="title_link" href="${link}" style="text-decoration: none; color: #000000;">${post.title}</a>
                      </h3>
                    </td>
                    <td style="vertical-align: top;">
                      <table class="dev_name_desktop" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; margin-bottom: 8px;">
                        <tr style="width: 100%";>
                          <td style="width: 24px; padding-right: 4px; vertical-align: middle;">
                            <img src="${dev_name_config[post.dev_name].icon}" alt="" style="display: block; width: 24px; height: auto; margin-left: auto;" />
                          </td>
                          <td style="width: 1%; vertical-align: middle; white-space: nowrap; margin-left: auto;">
                            ${dev_name_config[post.dev_name].name}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-top: 16px;">
                  <tr width="100%">
                    <td style="width: 100%; padding-right: 8px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                        <tr>
                          <td class="column first" style="width: fit-content; margin-right: 8px;">
                            <span style="display: inline-block; width: fit-content; text-wrap: no-wrap; font-size: 14px; font-weight: 400; color: #fff; background-color: #000; padding: 2px 8px; border-radius: 16px;">
                              By ${authors}
                            </span> 
                          </td>
                          ${post.contributors.length ? `
                          <td class="column contributor_desktop" style="width: fit-content;">
                            <span style="display: inline-block; width: fit-content; text-wrap: no-wrap; font-size: 14px; font-weight: 400; color: #000; background-color: #FFF8EB; padding: 2px 8px; border-radius: 16px;">
                              ${contributors}
                            </span>
                          </td>
                          ` : ''}
                        </tr>
                      </table>
                    </td>
                    ${replies > 0 && combinedSummaryLink ? `
                    <td style="white-space: nowrap; font-size: 14px; font-weight: 400; vertical-align: top; margin-top: 4px;">
                      <a href="${combinedSummaryLink}">
                        ${replies > 1 ? `${replies} replies` : `${replies} reply`}
                      </a>
                    </td>
                    ` : '<td></td>'}
                  </tr>
                </table>
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                  <tr>
                    ${post.contributors.length ? `
                    <td class="contributor" style="width: fit-content; display: none;">
                      <p style="display: inline-block; width: fit-content; text-wrap: no-wrap; font-size: 14px; font-weight: 400; color: #000; background-color: #FFF8EB; padding: 2px 8px; border-radius: 16px;">
                        ${contributors}
                      </p>
                    </td>
                    ` : ''}
                  </tr>
                </table>
                <div id="post_summary" style="padding-top: 20px;">
                  ${summary}
                </div>
              </a>
            </div>
          </td>
        </tr>
      </table>
  `;

  return htmlContent;
}

// Function to generate the HTML content for the newsletter
function generateHTMLTemplate(data: NewsLetterDataType) {
  let words = data.summary_of_threads_started_this_week.split(" ");
  let summary = words.slice(0, 300).join(" ").replaceAll("\n", "<br/>");
  let summaryHtml = marked(summary);

  let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
  <title>TLDR Newsletter for ${getWeekCovered()}</title>
  <style>
  /* Reset some default styles */
  body, h1, h2, h3, h4, p {
    margin: 0;
    padding: 0;
  }
  
  * {
    box-sizing: border-box;
  }
  :root {
    color-scheme: light only;
    supported-color-schemes: light only;
  }
  body {
    color: #000000 !important;
  }
  .container {
    position: relative;
    padding: 24px;
    font-family: "Space Grotesk", -apple-system, Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    color: #000 !important;
    max-width: 600px;
    margin: 0 auto;
    box-sizing: border-box;
    background-color: #FFFAF0 !important;
  }
  
  .container * {
    box-sizing: border-box;
  }

  .container p, .container h2 {
    color: #000 !important;
  }

  .conatiner table, .container tbody, .container tr, .container td {
    margin: 0;
    padding: 0;
  }

  /* Cards */
  .card {
    background-color: #fff !important;
    border: 1px solid #000;
    border-radius: 4px; 
    padding: 24px;
  }

  .card #title_link {
    color: #000 !important;
    text-decoration: none;
  }

  .card #post_summary > ul {
    margin: 0;
    padding: 0;
    margin-left: 20px;
  }

  .card #post_summary > ul > li {
    text-decoration: none;
    color: #000;
  }
  
  .card:hover {
    border-color: #999;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }

  .thread .summary {
    color: #666 !important;
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

  .column {
    display: inline-block;
    width: 48%;
    vertical-align: top;
  }

  /* Media query for smaller screens */
  @media (max-width: 600px) {
    .container {
      padding: 12px;
    }
    .thread {
      width: 100%;
      padding: 10px;
    }
    .column {
      display: block !important;
      width: 100% !important;
    }
    .column.first {
      margin-bottom: 8px;
    }
    .dev_name {
      display: block !important;
    }
    .contributor {
      display: inline-block !important;
    }
    .dev_name_desktop, .contributor_desktop {
      display: none !important;
    }
  }
  </style>
  </head>
  <body>
    <div class="container">

      <table style="padding-bottom: 24px;" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr style="width: 100%">
          <td style="width: 1%; vertical-align: middle;">
            <img src="https://mcusercontent.com/5ed3a24c2a06c817a3182bbcb/images/b7ee5bb5-1250-0f03-932a-c33e7c38be0d.png"
            style="display: block; width:32px; max-width: 32px; height: auto; vertical-align: bottom;" />
          </td>
          <td style="vertical-align: middle;">
            <p style="font-size: 20px; font-weight:500; color: #000;">TLDR</p>
          </td>
        </tr>
      </table>

      <!-- Hero -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #000; border-radius: 8px;">
        <tr>
          <td style="padding: 24px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="vertical-align: middle;">
                  <h1 style="color: #FDE9C8; font-size: 32px; font-weight: 500; margin: 0; padding: 0;">
                    TLDR Newsletter for ${getWeekCovered()}
                  </h1>
                </td>
                <td style="width: 163px; padding-left: 8px; vertical-align: middle;">
                  <img src="https://mcusercontent.com/5ed3a24c2a06c817a3182bbcb/images/0c6ad3a1-8519-f850-031c-2b215745ceee.png" alt="Newsletter Logo" style="display: block; width: 100%; max-width: 163px; height: auto;" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Summary -->
      <div style="padding-top: 24px">
        <div>
            <h2 style="margin-bottom: 16px; font-size: 28px; font-weight: 500;">
              Catch Up on This Week's Activity
            </h2>
            <div style="font-size: 18px; font-weight: 400;">${summaryHtml}</div>
        </div>
      </div>

      <div style="padding-top: 32px;">
        
        <!-- New Threads This Week -->
        <div >
          ${
            data.new_threads_this_week.length > 0
              ? `<h2 style="font-size: 28px; font-weight: 500;">Recent Threads</h2>` +
              '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="width: 100%;>' +
                data.new_threads_this_week
                  .map((thread) => generateHTMLForPost(thread))
                  .join("")
                + "</td></tr></table>"
              : "<p>No new threads this week.</p>"
          }
        </div>

        <!-- Active Posts This Week -->
        <div style="margin-top: 32px;">
          ${
            data.active_posts_this_week.length > 0
              ? `<h2 style="font-size: 28px; font-weight: 500;">Active Discussions</h2>` +
              '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="width: 100%;>' +
                data.active_posts_this_week
                  .map((post) => generateHTMLForPost(post))
                  .join("")
                + "</td></tr></table>"
              : "<p>No active posts this week.</p>"
          }
        </div>
      </div>
    </div>
  </body>
  </html>`;
  fs.writeFileSync("./newsletter.html", html);
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
