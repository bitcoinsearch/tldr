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
    icon: "https://tldr.bitcoinsearch.xyz/images/newsletter/bitcoin.png",
  },
  "lightning-dev": {
    name: "Lightning-dev",
    icon: "https://tldr.bitcoinsearch.xyz/images/newsletter/lightning.png",
  },
  delvingbitcoin: {
    name: "Delving bitcoin",
    icon: "https://tldr.bitcoinsearch.xyz/images/newsletter/delving.png",
  },
};

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

  const authorsList = post.authors.slice(0, 2)
  if (post.authors.length > 2) {
    authorsList.push(`+${post.authors.length - 2} more`)
  }

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
      <tr>
        <td style="width: 100%;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="position: relative; margin-top: 16px;">
          <tbody>
            <tr>
              <td style="width: 100%;">
                <div class="card">
                  <a href="${combinedSummaryLink || link}" style="text-decoration: none; color: #000;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="width: 100%; white-space: nowrap; vertical-align: top;">
                          <table class="dev_name" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; margin-bottom: 8px; display: none;">
                            <tr style="width: 100%";>
                              <td style="width: 24px; padding-right: 4px; vertical-align: middle;">
                                <img src="${dev_name_config[post.dev_name].icon}" alt="${dev_name_config[post.dev_name].name} icon" style="display: block; width: 24px; height: auto; margin-left: auto;" />
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
                            <a id="title_link" href="${combinedSummaryLink ||link}" style="text-decoration: none; color: #000000;">${post.title}</a>
                          </h3>
                        </td>
                        <td style="vertical-align: top;">
                          <table class="dev_name_desktop" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; margin-bottom: 8px;">
                            <tr style="width: 100%";>
                              <td style="width: 24px; padding-right: 4px; vertical-align: middle;">
                                <img src="${dev_name_config[post.dev_name].icon}" alt="${dev_name_config[post.dev_name].name} icon" style="display: block; width: 24px; height: auto; margin-left: auto;" />
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
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              ${authorsList.map(author => `
                                <td class="" style="width: fit-content; padding-right: 8px;">
                                  <span style="display: inline-block; width: fit-content; text-wrap: no-wrap; font-size: 14px; font-weight: 400; color: #fff; background-color: #000; padding: 2px 8px; border-radius: 16px;">
                                    ${author}
                                  </span> 
                                </td>
                              `).join("")}
                            </tr>
                          </table>
                        </td>
                        ${replies > 0 && combinedSummaryLink ? `
                        <td style="white-space: nowrap; font-size: 14px; font-weight: 400; vertical-align: top; margin-top: 4px;">
                          ${replies > 1 ? `${replies} replies` : `${replies} reply`}
                        </td>
                        ` : '<td></td>'}
                      </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-top: 10px;">
                      <tr>
                        ${post.contributors.length ? `
                        <td class="contributor" style="width: fit-content;">
                          <p style="display: inline-block; width: fit-content; text-wrap: no-wrap; font-size: 14px; font-weight: 400; color: #000; background-color: #F7931A; padding: 2px 8px; border-radius: 16px;">
                            ${contributors}
                          </p>
                        </td>
                        ` : ''}
                      </tr>
                    </table>
                    <div id="post_summary" style="padding-top: 18px;">
                      ${summary}
                    </div>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </td>
      </tr>
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
  
  /* Override mailchimp styles */
  .im {
    color: #000;
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

  #summary {
    font-size: 18px;
    font-weight: 400;
  }

  /* Cards */
  .card {
    background-color: #fff !important;
    border: 1px solid #3D3D3D;
    border-radius: 6px; 
    padding: 24px;
    box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 1);
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
    line-height: 1.4;
  }
  
  .card:hover {
    border-color: #999;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
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
    .container h1 {
      font-size: 24px !important;
    }
    .container h2 {
      font-size: 22px !important;
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

    #summary {
      font-size: 16px;
    }
  }
  </style>
  </head>
  <body>
    <div class="container">
      <!-- Hidden text for summary -->
      <div style="display:none;visibility:hidden;height:0px;width:0px;opacity:0;overflow:hidden;">
        Catch Up on This Week's Activity. ${summary.slice(0, 300)}
      </div>

      <table style="padding-bottom: 24px;" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr style="width: 100%">
          <td style="width: 1%; vertical-align: middle;">
            <img src="https://tldr.bitcoinsearch.xyz/images/newsletter/btc.png"
            style="display: block; width:32px; max-width: 32px; height: auto; vertical-align: bottom;" alt="Logo" />
          </td>
          <td style="vertical-align: middle;">
            <div>
              <span aria-hidden="true" style="font-size: 20px; font-weight:500; color: #000;">TLDR</span>
            </div>
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
                <td style="width: 30%; padding-left: 16px; vertical-align: top;">
                  <img src="https://tldr.bitcoinsearch.xyz/images/newsletter/hero.png" alt="Newsletter Logo" style="display: block; width: 100%; max-width: 163px; height: auto;" />
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
            <div id="summary">${summaryHtml}</div>
        </div>
      </div>

      <div style="padding-top: 32px;">
        
        <!-- New Threads This Week -->
        <div >
          ${
            data.new_threads_this_week.length > 0
              ? `<h2 style="font-size: 28px; font-weight: 500;">Recent Threads</h2>` +
              `<table cellpadding="0" cellspacing="0" border="0" width="100%">` +
                data.new_threads_this_week
                  .map((thread) => generateHTMLForPost(thread))
                  .join("")
                + `</table>`
              : "<p>No new threads this week.</p>"
          }
        </div>

        <!-- Active Posts This Week -->
        <div style="margin-top: 32px;">
          ${
            data.active_posts_this_week.length > 0
              ? `<h2 style="font-size: 28px; font-weight: 500;">Active Discussions</h2>` +
              `<table cellpadding="0" cellspacing="0" border="0" width="100%">` +
                data.active_posts_this_week
                  .map((post) => generateHTMLForPost(post))
                  .join("")
                  + `</table>`
              : "<p>No active posts this week.</p>"
          }
        </div>
      </div>
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
          subject_line: `TLDR Newsletter for ${getWeekCovered()}`,
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
      fs.writeFileSync("./newsletter.html", htmlContent);
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

sendNewsletter();
