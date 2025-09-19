import { PaymentController } from "../controllers/paymentController.js";
import  PayementSevice  from "../services/paymentService.js";
import express from "express";

const router = express.Router();
const paymentController = new PaymentController();
const paymentService = new PayementSevice(paymentController);

router.post('/initiate-payment', async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentResponse = await paymentService.initiatePayment(amount);
        res.json(paymentResponse);
    } catch (error) {
        console.error("Payment initiation error:", error);
        res.status(500).json({ error: "Failed to initiate payment" , details: error.message.data  });
    }   
});

router.post('/download-receipt', async (req, res) => {
    const { orderNumber } = req.body;
    try {
        const receiptResponse = await paymentService.downloadReceipt(orderNumber);
        res.json(receiptResponse.links);

    } catch (error) {
        console.error("Receipt download error:", error);
        res.status(500).json({ error: "Failed to download receipt" , details: error.message.data  });
    }
});


router.post('/show-transaction', async (req, res) => {
        const { orderNumber } = req.body;
     try {
        const transactionResponse = await paymentService.showPaymentDetails(orderNumber);
        res.send(transactionResponse);
    }
    catch (error) {
        console.log('Validation errors:', error);;
        res.status(500).json({ error: 'Failed to fetch transaction', details: error.message.meta });
    }
})
export default router;