
class PaymentService { // Fix typo: PayementSevice -> PaymentService
    constructor(paymentController) { // Fix: remove space, lowercase 'p'
        this.paymentController = paymentController;
    }

    async initiatePayment(amount) {
        return await this.paymentController.initiatePayment(amount);
    }

    async downloadReceipt(orderNumber) {
        return await this.paymentController.downloadReceipt(orderNumber);
    }

    async showPaymentDetails(orderNumber) {
        return await this.paymentController.showPaymentDetails(orderNumber);
    }
}

export default PaymentService;