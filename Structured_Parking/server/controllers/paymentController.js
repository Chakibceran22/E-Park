import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const APP_KEY = process.env.APPLICATION_KEY;
const APP_SECRET = process.env.APPLICATION_SECRET;
export class PaymentController {
  async initiatePayment(userAmount) {
    
    const response = await axios.post(
      "https://epay.guiddini.dz/api/payment/initiate",
      {
        amount: userAmount,
        language: "FR",
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-app-key": APP_KEY,
          "x-app-secret": APP_SECRET,
        },
      }
    );
    return {
      url: response.data.data.attributes.form_url,
      id: response.data.data.id,

    }
  }
  async downloadReceipt(orderNumber) {
     const response = await axios.get(`https://epay.guiddini.dz/api/payment/receipt?order_number=${orderNumber}`, {
    
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-app-key': APP_KEY,
      'x-app-secret': APP_SECRET
    }
  });
  return response.data;
  }

  async showPaymentDetails(orderNumber) {
     const response = await axios.get(`https://epay.guiddini.dz/api/payment/show?order_number=${orderNumber}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-app-key': APP_KEY,
      'x-app-secret': APP_SECRET
    }
  });
  return response.data;
  }
}
