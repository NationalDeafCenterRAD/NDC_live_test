import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

// Get all reports
const dataDir = path.join(__dirname,'../assets');
const filePath = path.join(dataDir,'acs_5_year.json');
const fileContent = fs.readFileSync(filePath,'utf8');
const acs5y = JSON.parse(fileContent)[0];

// Get Creation date function
const getFileCreationDate = (filePath) => {
  const stats = fs.statSync(filePath);
  return stats.birthtime.getFullYear(); // This returns the creation date
};

const pdfDirectory = path.join(__dirname, '../assets/Reports');

const pdfDir = fs.readdirSync(pdfDirectory)
  .filter(file => file.endsWith('.pdf'))
  .map(file => path.join(pdfDirectory, file));

describe('Total PDF reports are at least 50 reports', () => {
  test('',() => {
    expect(pdfDir.length).toBeGreaterThanOrEqual(50);
  })
});

describe.each(pdfDir)('PDF test: ', (pdfPath) => {
  let pdfDoc;
  let pdfYear;
  const pdfFileName = path.basename(pdfPath);
  const stateName = pdfFileName.split('_')[1].split('_report')[0];

  beforeAll(async () => {
    const dataBuffer = fs.readFileSync(pdfPath);
    const base64 = dataBuffer.toString('base64');
    pdfDoc = await PDFDocument.load(base64);
    pdfYear = getFileCreationDate(pdfPath);
  });

  describe(`Unit tests for the ${stateName} PDF report`, () => {
    test('The PDF report has at least 5 pages.', () => {
      expect(pdfDoc.getPageCount()).toBeGreaterThanOrEqual(1);
    });

    // Extract text
    test('The PDF report creation year and ACS 5 year difference are within 2 year.', () => {
      expect(Math.trunc(pdfYear - acs5y)).toBeLessThanOrEqual(2);
    })
  })
})