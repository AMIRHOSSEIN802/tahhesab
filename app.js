const express = require('express');
const path = require('path');
const { sequelize, Factors } = require('./models'); 
const bodyParser = require('body-parser');
const {fetchAndSave} = require('./routes/flow');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/factor/save-factor', async (req, res) => {
  try {
    const { Factor_Code, mobile, ZamanSabt, details, price, weight, isCheck } = req.body;

    if (!Factor_Code || !details || !Array.isArray(details) || details.length === 0) {
      return res.status(400).json({ error: 'اطلاعات فاکتور ناقص است' });
    }

    // بررسی وجود فاکتور قبلی
    const existing = await Factors.findOne({ where: { Factor_Code } });
    if (existing) {
      return res.json({ success: false, error: `فاکتور با کد ${Factor_Code} قبلاً ثبت شده است` });
    }

    // ذخیره فاکتور جدید
    await Factors.create({
      Factor_Code,
      mobile,
      ZamanSabt,
      details,
      price,
      weight,
      isCheck: isCheck === true // فقط برای اطمینان
    });

    res.json({ success: true, message: 'فاکتور با موفقیت ذخیره شد' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ذخیره فاکتور' });
  }
});
app.post('/run-flow', async (req, res) => {
  try {
    await fetchAndSave();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3001;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({force: true});
    console.log('اتصال به دیتابیس موفقیت‌آمیز بود');
  } catch (err) {
    console.error('خطا در اتصال به دیتابیس:', err);
  }
  console.log(`Server running on http://localhost:${PORT}`);
});
