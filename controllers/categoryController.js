const asyncHandler = require("express-async-handler");
const connection = require('../db/context');
const e = require("express");

exports.add = asyncHandler(async (req, res, next) => {
  try {
    const { title } = req.body;

    // Check if the category title already exists
    const existingCategory = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM category WHERE title = ?', [title], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this title already exists' });
    }

    // Insert the new category
    const query = 'INSERT INTO category (title) VALUES (?)';
    connection.query(query, [title], (err, result) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ id: result.insertId, title });
    });
  } catch (err) {
    next(err);
  }
});

exports.manage = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id
  // Check if the category exists
  const existingCategory = await new Promise((resolve, reject) => {
    connection.query('SELECT id, title FROM category WHERE id = ?', [id], (err, results) => {
      if (err) {
        throw err
      } else {
        if (clothing.length <= 0) {
          return res.status(404).json({ error: 'no category found' });
        }
        var categoryTitle = results[0].title
        res.json({ message: 'category found successfully', status: "1", id: categoryId, title: categoryTitle});
      }
    });
  });
})

exports.edit = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // Check if the category exists
    const existingCategory = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM category WHERE id = ?', [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Update the category
    const query = 'UPDATE category SET title = ? WHERE id = ?';
    connection.query(query, [title, id], (err, result) => {
      if (err) {
        return next(err);
      }
      res.json({ id, title });
    });
  } catch (err) {
    next(err);
  }
});

exports.delete = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the category exists
    const existingCategory = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM category WHERE id = ?', [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Delete the category
    const query = 'DELETE FROM category WHERE id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) {
        return next(err);
      }
      res.json({ message: 'Category deleted' });
    });
  } catch (err) {
    next(err);
  }
});

exports.watch = asyncHandler(async (req, res, next) => {
  try {
    const query = 'SELECT * FROM category';
    connection.query(query, (err, results) => {
      if (err) {
        return next(err);
      }
      res.json(results);
    });
  } catch (err) {
    next(err);
  }
});