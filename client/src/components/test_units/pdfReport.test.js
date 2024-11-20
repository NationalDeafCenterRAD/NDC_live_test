const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { GlobalWorkerOptions } = 'pdfjs-dist/legacy/build/pdf';

// Get all reports
const dataDir = path.join(__dirname,'../assets');
const filePath = path.join(dataDir,'acs_5_year.json');
const fileContent = fs.readFileSync(filePath,'utf8');
const acs5y = JSON.parse(fileContent)[0];

const pdfDirectory = path.join(__dirname, '../assets/Reports');

const pdfDir = fs.readdirSync(pdfDirectory)
  .filter(file => file.endsWith('.pdf'))
  .map(file => path.join(pdfDirectory, file));

describe('Must be at least 50 reports', () => {
  test('',() => {
    expect(pdfDir.length).toBeGreaterThanOrEqual(50);
  })
});

/*describe.each(pdfDir)('PDF Report Tests for %s', (pdfPath) => {
  let pdfData;
  const pdfFileName = path.basename(pdfPath);
  const stateName = pdfFileName.split('_')[1].split('_report')[0];

  beforeAll(async () => {
    const dataBuffer = fs.readFileSync(pdfPath);
    pdfData = await pdf(dataBuffer);
  })

  describe(`Unit tests for the ${stateName} PDF report`, () => {
    test(`should contain expected text`, () => {
      expect(pdfData.text).toContain(`-${acs5y})`)
    })
  })
})*/