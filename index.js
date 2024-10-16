let express = require('express');
let cors = require('cors');
let { resolve } = require('path');

let app = express();
let port = 3000;
app.use(cors());
app.use(express.static('static'));

// Server-side values

let taxRate = 5;
let discountPercentage = 10;
let loyaltyRate = 2;

// Endpoint 1: Calculate the total price of items in the cart
function cartValue(newItemPrice, cartTotal) {
  return (cartTotal += newItemPrice);
}

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(cartValue(newItemPrice, cartTotal).toString());
});
// Endpoint 2 : Apply a discount based on membership status

function totalValue(member, cartTotal) {
  if (member === 'true') {
    let cartValue = cartTotal - cartTotal / discountPercentage;
    return cartValue.toString();
  } else {
    return cartTotal.toString();
  }
}

app.get('/membership-discount', (req, res) => {
  let member = req.query.isMember;
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(totalValue(member, cartTotal));
});

// Endpoint 3 : Calculate tax on the cart total
function calcuateTax(cartTotal) {
  let totalTax = (cartTotal / 100) * taxRate;
  return totalTax.toString();
}
app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calcuateTax(cartTotal));
});

// Endpoint 4 : Estimate delivery time based on shipping method

function estimateDelivary(shippingMethod, distance) {
  if (shippingMethod == 'standard') {
    let shippingTime = distance / 50;
    return (
      'shipping time for Standard Delivary for this order is ' + shippingTime
    );
  } else if (shippingMethod == 'express') {
    let shippingTime = distance / 100;
    return (
      'shipping time for Express Delivary for this order is ' + shippingTime
    );
  } else {
    return 'Wrong Shipping Method';
  }
}
app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
  res.send(estimateDelivary(shippingMethod, distance));
});

// Endpoint 5 : Calculate the shipping cost based on weight and distance

function shippingCost(weight, distance) {
  let cost = weight * distance * 0.1;
  return 'Cost for delivary for ' + distance + ' is ' + cost;
}
app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  res.send(shippingCost(weight, distance));
});

// Endpoint 6 : Calculate loyalty points earned from a purchase

function loyaltyPoints(purchaseAmount) {
  let points = purchaseAmount * loyaltyRate;
  return points.toString();
}
app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  res.send(loyaltyPoints(purchaseAmount));
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
