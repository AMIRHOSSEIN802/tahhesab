const express = require('express');
const router = express.Router();
const { Factors } = require('../models');

router.post('/save-factor', async (req, res) => {
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
    console.error('خطا در ذخیره فاکتور:', err);
    res.status(500).json({ error: 'خطا در ذخیره فاکتور' });
  }
});

module.exports = router;
