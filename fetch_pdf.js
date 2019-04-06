const puppeteer = require("puppeteer");
const { DateTime } = require("luxon");
const https = require("https");
const fs = require("fs");
const sgMail = require("@sendgrid/mail");

async function getPDFLocation() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 800 });
  await page.goto("https://leandoo.com");
  await page.click("a.login");
  await page.type("input[name='ldentrnow']", process.env.LEANDOO_LOGIN);
  await page.type("input[name='ldpwd']", process.env.LEANDOO_PASSWORD);
  await page.click("input[type='button']");
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  const targetWeek = DateTime.local()
    .set({ weekday: 1 })
    .plus({ weeks: 1 })
    .toISODate();

  await page.goto(`https://leandoo.com/internal/foodplan/${targetWeek}`);

  const link = await page.$eval("a.userAction", el => el.href);
  await browser.close();
  return link;
}

async function downloadFile(finish) {
  const link = await getPDFLocation();
  const file = fs.createWriteStream("menu.pdf");
  https.get(link, response => {
    response.pipe(file);
    file.on("finish", function() {
      file.close(finish);
    });
  });
}

if (!process.env.LEANDOO_LOGIN) {
  console.log("❌ missing environment: 'LEANDOO_LOGIN'");
  return;
}

if (!process.env.LEANDOO_PASSWORD) {
  console.log("❌ missing environment: 'LEANDOO_PASSWORD'");
  return;
}

if (!process.env.SENDGRID_API_KEY) {
  console.log("❌ missing environment: 'SENDGRID_API_KEY'");
  return;
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log("🚗 Downloading pdf file...");
downloadFile(() => {
  console.log("📩 Finished! Now mailing it...");
  fs.readFile("menu.pdf", async (err, data) => {
    const msg = {
      to: "leandoo@wannawork.de",
      bcc: ["familie.lindtner.tasche@gmail.com"],
      from: "mail@leandoomailer.bitboxer.de",
      subject: "Leandoo Menüplan",
      text: "Anbei der Leandoo Menüplan",
      attachments: [
        {
          filename: "menu.pdf",
          content: data.toString("base64"),
          type: "application/pdf",
          disposition: "attachment",
          contentId: "menuPdf"
        }
      ]
    };
    sgMail.send(msg);
    console.log("✅ Message sent!");
  });
});
