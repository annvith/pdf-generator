const express = require("express");
const Cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const utils = require("util");
const puppeteer = require("puppeteer");
const hb = require("handlebars");
const performance = require('perf_hooks').performance;

const PORT = 4000;

const app = express();
app.use(
    Cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const readFile = utils.promisify(fs.readFile);
async function getTemplateHtml() {
    // console.log("Loading template file in memory...");
    try {
        const htmlPath = path.resolve("./invoice.html");
        return await readFile(htmlPath, "utf8");
    } catch (err) {
        return Promise.reject("Could not load html template!");
    }
}

async function generatePdf(details,i) {
    let date_ob = new Date();
    // console.log(i);
    let total =
        Number(details.itemA) + Number(details.itemB) + Number(details.itemC);
    let data = {
        name: details.name,
        email: details.email,
        itemA: Number(details.itemA),     // console.log(res)
        itemB: Number(details.itemB),
        itemC: Number(details.itemC),
        total: total,
        date: date_ob,
    };
    getTemplateHtml()
        .then(async (res) => {
            // Now we have the html code of our template in res object
            // you can check by logging it on console
            // console.log("Entered inside get template" +i);
            // console.log("Compiing the template with handlebars...");
            const template = hb.compile(res, { strict: true });
            // we have compile our code with handlebars
            const result = template(data);
            // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
            const html = result;
            // we are using headless mode
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            // We set the page content as the generated html by handlebars
            await page.setContent(html);
            // We use pdf function to generate the pdf in the same folder as this file.
            await page.pdf({
                path: `PDFs/Invoice for ${details.name} ${i}.pdf`,
                format: "A4",
            });
            await browser.close();
            // console.log("PDF Generated");
        })
        .catch((err) => {
            console.error(err);
        });
}

app.use("/", express.static(path.join(__dirname, "PDFs")));

app.post("/generate-pdf", (req, res) => {
    // var t0=performance.now();
    console.time('label');
        for(i=0;i<500;i++){
            generatePdf(req.body,i);
        }
        // var t1=performance.now();
        console.timeEnd('label');
        // console/log("time taken is"+t1-t0);
        res.send(`http://localhost:${PORT}/${req.body.name}.pdf`);
    
       
});

app.listen(PORT, () => {
    console.log("Express app listening on port 4000");
});
