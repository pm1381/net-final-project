const connection = require('../db/context');
const asyncHandler = require("express-async-handler");
const TransactionDto = require('../dto/transaction');

exports.edit = asyncHandler(async (req, res, next) => {
  const transactionId = req.params.id;
  let { title, amount, cartId, date, transactionType } = req.body;

  if (title == null || cartId == null) {
    return res.status(400).json({ error: 'no amount or cart or title is set' });
  }
  if (amount != null) {
    return res.status(400).json({ error: 'amount cannot be updated. delete and make a new one' });
  }
  if (date == null) {
    date = new Date().toISOString().slice(0, 10);
  }
  if (transactionType == null) {
    transactionType = "DEPOSIT"
  }
  
  const query = 'UPDATE transaction SET title = ?, amount = ?, cart_id = ?, date = ?, transactionType = ? WHERE id = ?';
  connection.query(query, [title, amount, cartId, date, transactionType, transactionId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    trans = new TransactionDto(transactionId, title, amount, cartId, date, transactionType)
    res.json({ message: 'Transaction updated successfully', status: "1", data: trans });
  });
});

exports.delete = asyncHandler(async (req, res, next) => {
    const transactionId = req.params.id;

    const selectQuery = "select amount, cart_id from transaction where id = ?"
    connection.query(selectQuery, [transactionId], (err, results) => {
        let added_amount = results[0].amount
        let cartOrigin = results[0].cart_id
        console.log(added_amount, cartOrigin)
        const queryUpdate = 'UPDATE cart SET amount = amount+' + added_amount + '  WHERE id = ?';
        connection.query(queryUpdate, [cartOrigin], (err, result) => {
            if (err) throw err;
            if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'cart not found' });
            }
            const query = 'DELETE FROM transaction WHERE id = ?';
            connection.query(query, [transactionId], (err, result) => {
                if (err) throw err;
                if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Transaction not found' });
                }
            });
        });
    })
    res.json({ message: 'Transaction deleted successfully', status: "1", id: transactionId });

});

exports.linear_chart = asyncHandler(async (req, res, next) => {
    let monthes1 = 0
    let monthes2 = 0
    let monthes3 = 0
    const currentDate = new Date();
    const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate());
    const query = 'SELECT date, SUM(amount) AS total_amount FROM transaction where date > ? GROUP BY date ORDER BY date';
    connection.query(query, [threeMonthsAgo], (err, results) => {
        if (err) throw err;
        results.forEach(element => {
            const date = new Date(element.date);
            const monthDiff = currentDate.getMonth() - date.getMonth() + (12 * (currentDate.getFullYear() - date.getFullYear()));
        
            if (monthDiff === 1) {
              monthes1 += element.total_amount;
            } else if (monthDiff === 2) {
              monthes2 += element.total_amount;
            } else if (monthDiff === 3) {
              monthes3 += element.total_amount;
            }
        });
        res.json({first: monthes1, second: monthes2, third: monthes3});
    });
});

exports.add = asyncHandler(async (req, res, next) => {
    let { title, amount, cartId, date, transactionType } = req.body;
    var category = req.body.category
    var now = new Date().toISOString().slice(0, 10);
    let new_id = 1;

    if (amount == null || title == null || cartId == null) {
        return res.status(400).json({ error: 'no amount or cart or title is set' });
    }
    if (date == null) {
        date = new Date().toISOString().slice(0, 10);
    }
    if (transactionType == null) {
        transactionType = "DEPOSIT"
    }

    const query = 'INSERT INTO transaction (title, amount, cart_id, date, transactionType) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [title, amount, cartId, date, transactionType], (err, result) => {
        if (err) throw err;
        new_id = result.insertId
        if (category != null) {
            const assign = 'INSERT INTO trans_category (date_created, cat_id, trans_id) VALUES (?, ?, ?)'
            connection.query(assign, [now, category, new_id], (err, results) => {
                if (err) throw err;
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Transaction not found' });
                }
            });
        }
        trans = new TransactionDto(new_id, title, amount, cartId, date, transactionType)
        res.json({ data: trans,  message: "added successfully", status: "1" });
    });
});
