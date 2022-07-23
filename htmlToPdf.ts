import * as pupp from 'puppeteer';

export async function htmlToPdf(file: FileType, options?: pupp.PDFOptions) : Promise<htmlToPdfResult> {
  const emailLimitMegaBytes = 24;
  const maxSize = emailLimitMegaBytes * 1024 * 1024;

  const browser = await pupp.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  });

  const page = await browser.newPage();

  await page.goto(file.url as string, {
    waitUntil: 'networkidle0',
  });

  const pdf = await page.pdf(options);
  const pdfSize = Buffer.byteLength(pdf);
  const veryLargeFile = pdfSize > maxSize;
  const picture = await page.screenshot({ fullPage: true, type: 'jpeg' });

  const result = {
    size: pdfSize,
    file: veryLargeFile ? picture : pdf,
    type: veryLargeFile ? 'jpeg' : 'pdf',
  }

  return result;
}

type FileType = { url };
type htmlToPdfResult = { size, type, file };

module.exports.htmlToPdf = htmlToPdf;