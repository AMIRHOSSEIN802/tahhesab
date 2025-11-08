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
    const { Factor_Code, mobile, ZamanSabt, details } = req.body;

    if (!Factor_Code || !details || !Array.isArray(details) || details.length === 0) {
      return res.status(400).json({ error: 'اطلاعات فاکتور ناقص است' });
    }

    const price = details.reduce((sum, d) => sum + (Number(d.Fi) || 0), 0);
    const weight = details.reduce((sum, d) => sum + ((Number(d.count) || 0) * (Number(d.weight) || 0)), 0);

    await Factors.upsert({
      Factor_Code,
      mobile,
      ZamanSabt,
      details,
      price,
      weight
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
