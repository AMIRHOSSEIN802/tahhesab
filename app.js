const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { sequelize, Factors, Counter } = require('./models'); 
const { fetchAndSave } = require('./routes/flow');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/factor/save-factor', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { mobile, ZamanSabt, details } = req.body;

    if (!details || !Array.isArray(details) || details.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'اطلاعات فاکتور ناقص است' });
    }

    const price = details.reduce((sum, d) => sum + (Number(d.Fi) || 0) * (Number(d.count) || 0), 0);
    const weight = details.reduce((sum, d) => sum + (Number(d.count) || 0) * (Number(d.weight) || 0), 0);

    const [ctr] = await Counter.findOrCreate({
      where: { name: 'factor_code' },
      defaults: { value: 0 },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    await ctr.increment('value', { by: 1, transaction: t });
    await ctr.reload({ transaction: t });
    const nextNumber = ctr.value;
    const Factor_Code = `F-${String(nextNumber).padStart(6, '0')}`;

    const saved = await Factors.create({
      Factor_Code,
      mobile,
      ZamanSabt,
      details,
      price,
      weight,
      isCheck: false
    }, { transaction: t });

    await t.commit();
    return res.json({ success: true, message: 'فاکتور با موفقیت ذخیره شد', code: saved.Factor_Code });

  } catch (err) {
    await t.rollback();
    console.error(' خطا در ذخیره فاکتور:', err);
    return res.status(500).json({ success: false, error: 'server' });
  }
});

app.get("/factor/list", async (req, res) => {
  try {
    const list = await Factors.findAll({
      where: { isCheck: false },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: list });
  } catch (err) {
    console.error("خطا در دریافت فاکتورها:", err);
    res.status(500).json({ success: false, error: "server" });
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

const PORT = 3001;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); 
    console.log('اتصال به دیتابیس موفقیت‌آمیز بود');
  } catch (err) {
    console.error('خطا در اتصال به دیتابیس:', err);
  }
  console.log(`Server running on http://localhost:${PORT}`);
});
