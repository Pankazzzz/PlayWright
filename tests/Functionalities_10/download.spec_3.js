import { test, expect } from '@playwright/test';
import path from 'path';


test('download a report', async ({ page }) => {

    const context = await browser.newContext({
    acceptDownloads: true
    });

    await page.goto('https://example.com/reports');
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download Report' }).click();
    const download = await downloadPromise;
    console.log(download.suggestedFilename());


    //save as
    const filePath = path.join(
    process.cwd(),
    'downloads',
    download.suggestedFilename()
    );
    await download.saveAs(filePath);

    //path
    const filePath = await download.path();
    console.log(filePath);

    //suggestedFileName
    const fileName = download.suggestedFilename();
    console.log(fileName);


    //failure
    const failure = await download.failure();
    expect(failure).toBeNull();


    //delete
    const download = await downloadPromise;
    await download.delete();

});


//upload single file
import path from 'path';
test('upload a PDF document', async ({ page }) => {
    await page.goto('https://example.com/upload');

    const filePath = path.join(
        process.cwd(),
        'test-data',
        'sample.pdf'
    );

    await page.locator('#documentUpload').setInputFiles(filePath);

    await expect(
        page.getByText('sample.pdf')
    ).toBeVisible();



    //upload multiple files
    const files = [
    path.join(process.cwd(), 'test-data', 'report.pdf'),
    path.join(process.cwd(), 'test-data', 'profile.png'),
    path.join(process.cwd(), 'test-data', 'data.csv')
    ];
    await page.locator('input[type="file"]').setInputFiles(files);

    await expect(page.getByText('report.pdf')).toBeVisible();
    await expect(page.getByText('profile.png')).toBeVisible();
    await expect(page.getByText('data.csv')).toBeVisible();

    //uploading from buffer
    const file = {
    name: 'sample.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('This is a Playwright test file')
    };
    await page.locator('input[type="file"]').setInputFiles(file);

    const csvContent = `id,name,department
    1,Pankaj,QA
    2,Rahul,Development
    3,Amit,Testing`;
    await page.locator('input[type="file"]').setInputFiles({
    name: 'employees.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from(csvContent)
    });


    //uploading file directory
    const directoryPath = path.join(
    process.cwd(),
    'test-data',
    'documents'
    );
    await page.locator('input[type="file"]').setInputFiles(directoryPath);

    //clearing uploaded files
    await page.locator('input[type="file"]').setInputFiles([]);


});


    //handling filechooser
    //<button id="uploadButton">Choose File</button>
test('upload using file chooser', async ({ page }) => {
    await page.goto('https://example.com/upload');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Choose File' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(
        path.join(process.cwd(), 'test-data', 'sample.pdf')
    );
    await expect(page.getByText('sample.pdf')).toBeVisible();



    //setfiles
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Browse').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
    'test-data/report.pdf',
    'test-data/profile.png'
    ]);


    //isMutliple
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Browse').click();
    const fileChooser = await fileChooserPromise;
    console.log(fileChooser.isMultiple());
    expect(fileChooser.isMultiple()).toBe(true);


    //validating file size and assertions
    import fs from 'fs';

    const filePath = path.join(
    process.cwd(),
    'test-data',
    'sample.pdf'
    );
    const stats = fs.statSync(filePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    expect(filePath.endsWith('.pdf')).toBe(true);
    expect(fileSizeInMB).toBeLessThan(5);

    //renaming
    import fs from 'fs/promises';

    await fs.rename(
    'downloads/report.pdf',
    'downloads/employee-report.pdf'
    );


});


//downloading specific directory
test('download employee report', async ({ page }, testInfo) => {
  await page.goto('https://example.com/reports');
  const downloadPromise = page.waitForEvent('download');
  await page.getByText('Download Report').click();
  const download = await downloadPromise;
  const filePath = testInfo.outputPath('employee-report.pdf');
  await download.saveAs(filePath);
  console.log(filePath);
});

//pdf verification
import fs from 'fs';
import pdf from 'pdf-parse';

test('verify downloaded PDF content', async ({ page }, testInfo) => {
  await page.goto('https://example.com/reports');
  const downloadPromise = page.waitForEvent('download');
  await page.getByText('Download PDF').click();
  const download = await downloadPromise;
  const filePath = testInfo.outputPath('report.pdf');
  await download.saveAs(filePath);
  const buffer = fs.readFileSync(filePath);
  const result = await pdf(buffer);
  expect(result.text).toContain('Employee Report');
  expect(result.text).toContain('Pankaj');

  //cleanup
  //finally {
    await fs.rm(filePath, { force: true });
  //}
});


//validating downloaded content
import fs from 'fs';

test('validate downloaded file', async ({ page }, testInfo) => {
  await page.goto('https://example.com/reports');

  const downloadPromise = page.waitForEvent('download');

  await page.getByRole('button', { name: 'Download Report' }).click();

  const download = await downloadPromise;

  expect(await download.failure()).toBeNull();

  const filePath = testInfo.outputPath(
    download.suggestedFilename()
  );

  await download.saveAs(filePath);
  expect(fs.existsSync(filePath)).toBe(true);
  expect(fs.statSync(filePath).size).toBeGreaterThan(0);
  expect(filePath.endsWith('.pdf')).toBe(true);
});