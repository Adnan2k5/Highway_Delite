import { Router } from "express";

const router = Router();

const promoCodes = {
  SAVE10: {
    type: "percentage",
    value: 10,
    description: "10% discount on total amount",
  },
  FLAT100: {
    type: "fixed",
    value: 100,
    description: "₹100 flat discount",
  },
};

router.post("/validate", (req, res) => {
  try {
    const { promoCode, totalAmount } = req.body;

    if (!promoCode) {
      return res.status(400).json({
        success: false,
        message: "Promo code is required",
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid total amount is required",
      });
    }

    const promoCodeUpper = promoCode.toUpperCase();
    const promo = promoCodes[promoCodeUpper];

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: "Invalid promo code",
      });
    }

    let discountAmount = 0;
    let finalAmount = totalAmount;

    if (promo.type === "percentage") {
      discountAmount = (totalAmount * promo.value) / 100;
      finalAmount = totalAmount - discountAmount;
    } else if (promo.type === "fixed") {
      discountAmount = Math.min(promo.value, totalAmount);
      finalAmount = totalAmount - discountAmount;
    }
    finalAmount = Math.max(finalAmount, 0);

    return res.status(200).json({
      success: true,
      promo: {
        code: promoCodeUpper,
        description: promo.description,
        type: promo.type,
        value: promo.value,
      },
      originalAmount: totalAmount,
      discountAmount: discountAmount,
      finalAmount: finalAmount,
      message: "Promo code applied successfully",
    });
  } catch (error) {
    console.error("Promo validation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
