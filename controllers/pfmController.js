var connection = require('../db/context');
const asyncHandler = require("express-async-handler");

exports.assign_category_to_transaction = asyncHandler(async (req, res, next) => {
    //res.send("NOT IMPLEMENTED: notes list");
    console.log(connection.query)
});

exports.edit_category = asyncHandler(async (req, res, next) => {
    //res.send("NOT IMPLEMENTED: notes list");
    console.log(connection.query)
});

exports.delete_category = asyncHandler(async (req, res, next) => {
    //res.send("NOT IMPLEMENTED: notes list");
    console.log(connection.query)
});

exports.list = asyncHandler(async (req, res, next) => {
    try {
      const query = `
        SELECT
          t.id,
          t.title,
          t.amount,
          t.date,
          t.transactionType,
          c.title AS category
        FROM transaction t
        LEFT JOIN trans_category tc ON t.id = tc.trans_id
        LEFT JOIN category c ON tc.cat_id = c.id
        ORDER BY t.date DESC
      `;
  
      connection.query(query, (err, results) => {
        if (err) {
          return next(err);
        }
  
        const transactions = results.map(transaction => ({
          id: transaction.id,
          title: transaction.title,
          amount: transaction.amount,
          date: transaction.date,
          transactionType: transaction.transactionType,
          category: transaction.category || 'Uncategorized'
        }));
  
        res.json(transactions);
      });
    } catch (err) {
      next(err);
    }
  });

  exports.yearly_transactions = asyncHandler(async (req, res, next) => {
    try {
      const { year } = req.params;
  
      const query = `
        SELECT *
        FROM transaction
        WHERE DATE_FORMAT(date, '%Y') = ?
        ORDER BY date DESC
      `;
  
      connection.query(query, [year], (err, results) => {
        if (err) {
          return next(err);
        }
  
        const transactions = results.map(transaction => ({
          id: transaction.id,
          title: transaction.title,
          amount: transaction.amount,
          date: transaction.date,
          transactionType: transaction.transactionType
        }));
  
        res.json(transactions);
      });
    } catch (err) {
      next(err);
    }
  });

exports.monthly_transactions = asyncHandler(async (req, res, next) => {
    try {
      const { month } = req.params;
  
      const query = `
        SELECT *
        FROM transaction
        WHERE DATE_FORMAT(date, '%m') = ?
        ORDER BY date DESC
      `;
  
      connection.query(query, [month], (err, results) => {
        if (err) {
          return next(err);
        }
  
        const transactions = results.map(transaction => ({
          id: transaction.id,
          title: transaction.title,
          amount: transaction.amount,
          date: transaction.date,
          transactionType: transaction.transactionType
        }));
  
        res.json(transactions);
      });
    } catch (err) {
      next(err);
    }
  });

exports.circle_chart = asyncHandler(async (req, res, next) => {
    try {
      const query = `
        SELECT c.title, SUM(t.amount) AS total_amount
        FROM transaction t
        JOIN trans_category tc ON t.id = tc.trans_id
        JOIN category c ON tc.cat_id = c.id
        GROUP BY c.title
      `;
  
      connection.query(query, (err, results) => {
        if (err) {
          return next(err);
        }
  
        const response = {};
        results.forEach(row => {
          response[row.title] = row.total_amount;
        });
  
        res.json(response);
      });
    } catch (err) {
      next(err);
    }
  });

exports.cart_details = asyncHandler(async (req, res, next) => {
    try {
        // Get the average deposits and average debits from the transaction table
        const transactionQuery = `
        SELECT
          AVG(CASE WHEN transactionType = 'DEPOSIT' THEN amount END) AS avg_deposit,
          AVG(CASE WHEN transactionType = 'DEBIT' THEN amount END) AS avg_debit,
          (SELECT amount FROM transaction WHERE transactionType = 'DEPOSIT' ORDER BY date DESC LIMIT 1) AS last_deposit,
          (SELECT amount FROM transaction WHERE transactionType = 'DEBIT' ORDER BY date DESC LIMIT 1) AS last_debit
        FROM transaction;
      `;

        const transactionResult = await new Promise((resolve, reject) => {
            connection.query(transactionQuery, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            });
        });

        // Get the owner and amount from the cart table
        const cartQuery = 'SELECT owner, amount FROM cart LIMIT 1';
        const cartResult = await new Promise((resolve, reject) => {
            connection.query(cartQuery, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            });
        });

        // Combine the results into a single JSON object
        const response = {
            avg_deposit: transactionResult.avg_deposit,
            avg_debit: transactionResult.avg_debit,
            last_deposit: transactionResult.last_deposit,
            last_debit: transactionResult.last_debit,
            owner: cartResult.owner,
            amount: cartResult.amount
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
})

exports.transactions_by_category = asyncHandler(async (req, res, next) => {
    try {
      const { catId } = req.params;
  
      const query = `
        SELECT t.*
        FROM transaction t
        JOIN trans_category tc ON t.id = tc.trans_id
        WHERE tc.cat_id = ?
        ORDER BY t.date DESC
      `;
  
      connection.query(query, [catId], (err, results) => {
        if (err) {
          return next(err);
        }
  
        const transactions = results.map(transaction => ({
          id: transaction.id,
          title: transaction.title,
          amount: transaction.amount,
          date: transaction.date,
          transactionType: transaction.transactionType
        }));
  
        res.json(transactions);
      });
    } catch (err) {
      next(err);
    }
  });