import puppeteer from "puppeteer";

async function fillForm(req, res) {
  try {
    const requiredFields = [
      "name",
      "email",
      "merek",
      "nomor_registrasi",
      "nama_pemilik",
      "hubungan_pelapor",
      "nama_perusahaan",
      "pemilik_haki_",
      "website_perusahaan",
      "alamat_perusahaan",
      "alamat_email_pemilik_merek",
      "no_telepon_pelapor",
      "link_barang"
    ];

    const missingFields = requiredFields.filter(field => !(field in req.body));

    if (missingFields.length > 0) {
      
     res.status(400).json({message : `Missing required fields: ${missingFields.join(", ")}`});
     return;
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });


    const dummyData = req.body;

    const page = await browser.newPage();
    await page.goto("https://bukabantuan.bukalapak.com/form/175");

    await page.type("#name", dummyData.name);
    await page.type("#email", dummyData.email);
    await page.type('[name="merek"]', dummyData.merek);
    await page.type('[name="nomor_registrasi"]', dummyData.nomor_registrasi);
    await page.type('[name="nama_pemilik"]', dummyData.nama_pemilik);
    await page.type('[name="hubungan_pelapor"]', dummyData.hubungan_pelapor);
    await page.type('[name="nama_perusahaan"]', dummyData.nama_perusahaan);
    await page.click("[name='pemilik_haki_']");
    await page.type(
      '[name="website_perusahaan"]',
      dummyData.website_perusahaan
    );
    await page.type('[name="alamat_perusahaan"]', dummyData.alamat_perusahaan);
    await page.type(
      '[name="alamat_email_pemilik_merek"]',
      dummyData.alamat_email_pemilik_merek
    );
    await page.type(
      '[name="no_telepon_pelapor"]',
      dummyData.no_telepon_pelapor
    );
    await page.type('[name="link_barang"]', dummyData.link_barang);
    await page.type(
      '[name="body"]',
      "The quick brown fox jumps over the lazy dog. A quaint, cozy cabin nestled among tall trees, offering respite from the bustling city life."
    );

    var fileUploadOne = await page.$("[name='link_barang_banyak']");
    var fileUploadTwo = await page.$("[name='surat_kepemilikan_merek']");

    await fileUploadOne.uploadFile("xl/file_1.xlsx");
    await fileUploadTwo.uploadFile("xl/file_2.docx");

    await page.click("[type='checkbox']");

    const searchResultSelector = "[type='Submit']";
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    await page.waitForTimeout(10000);

    const pageContent = await page.evaluate(() => {
      return document.body.textContent;
    });

    if (
      pageContent.includes(
        "Terima kasih. Kamu telah masuk antrian layanan BukaBantuan."
      )
    ) {
      await browser.close();
      res.status(200).json({ message: "Form submitted successfully" });
    } else {
      await browser.close();
      res.status(500).json({ message: "Form submission failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default fillForm;
