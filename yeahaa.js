// Backend for EmporifyX using Node.js + Express + MongoDB

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/emporifyx', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  products: [String],
  customer: String,
  status: String,
}));

// Routes

// Add product
app.post('/products', async (req, res) => {
  const { name, description, price } = req.body;
  const product = new Product({ name, description, price });
  await product.save();
  res.status(201).send(product);
});

// Get all products
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

// Place order
app.post('/orders', async (req, res) => {
  const { products, customer } = req.body;
  const order = new Order({ products, customer, status: 'Processing' });
  await order.save();
  res.status(201).send(order);
});

// Track order by customer
app.get('/orders/:customer', async (req, res) => {
  const orders = await Order.find({ customer: req.params.customer });
  res.send(orders);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
