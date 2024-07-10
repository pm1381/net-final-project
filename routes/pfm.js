let express = require('express');
let router = express.Router();

// Require controller modules.
const pfm_controller = require("../controllers/pfmController");
const transaction_controller = require("../controllers/transactionController")
const category_controller = require("../controllers/categoryController")

router.put('/edit-category/:id', category_controller.edit)
router.delete('/delete-category/:id', category_controller.delete)
router.post('/create-category', category_controller.add)
router.get('/list-category', category_controller.watch)
router.get('/manage-category/:id', category_controller.manage)

router.post('/assign-category/:catId/transaction/:transId', pfm_controller.assign_category_to_transaction)
router.put('/edit-transaction/:transId/category/:catId', pfm_controller.edit_category)
router.delete('/delete-transaction/:transId/category/:catId', pfm_controller.delete_category)
router.get('/list-transaction', pfm_controller.list)
router.get('/yearly-transactions/:year', pfm_controller.yearly_transactions)
router.get('/monthly-transactions/:month', pfm_controller.monthly_transactions)
router.get('/circle-chart', pfm_controller.circle_chart)
router.get('/cart-details', pfm_controller.cart_details)
router.get('/list-transactions-by-category/:catId', pfm_controller.transactions_by_category)

router.post('/create-transaction', transaction_controller.add)
router.put('/edit-transaction/:id', transaction_controller.edit)
router.delete('/delete-transaction/:id', transaction_controller.delete)
router.get('/linear-chart', transaction_controller.linear_chart)


module.exports = router;
