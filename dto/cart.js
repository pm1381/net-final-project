class CartDto {
    constructor(id, title, owner, amount, address) {
      this.id = id;
      this.title = title;
      this.owner = owner;
      this.amount = amount;
      this.address = address;
    }
}

module.exports = CartDto