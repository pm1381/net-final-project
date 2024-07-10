class TransactionDto {
    constructor(id, title, amount, cartId, date, transactionType) {
      this.id = id;
      this.title = title;
      this.amount = amount;
      this.cartId = cartId;
      this.date = date;
      this.transactionType = transactionType;
    }
}

module.exports = TransactionDto