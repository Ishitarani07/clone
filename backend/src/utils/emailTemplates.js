export const orderConfirmationTemplate = (order, user) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />` : ''}
            <span style="font-weight: 500;">${item.title}</span>
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.lineTotal.toLocaleString('en-IN')}</td>
      </tr>
    `
    )
    .join('');

  const address = order.shippingAddress;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #2874f0; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-style: italic;">Flipkart</h1>
    </div>

    <!-- Content -->
    <div style="padding: 32px 24px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="width: 64px; height: 64px; background-color: #22c55e; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 32px;">✓</span>
        </div>
        <h2 style="color: #333; margin: 0 0 8px;">Order Confirmed!</h2>
        <p style="color: #666; margin: 0;">Thank you for shopping with us, ${user.name}!</p>
      </div>

      <!-- Order Info -->
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #666;">Order Number:</span>
          <span style="font-weight: 600; color: #2874f0;">${order.orderNumber}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #666;">Order Date:</span>
          <span style="font-weight: 500;">${new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <!-- Items Table -->
      <h3 style="color: #333; margin: 0 0 16px; font-size: 18px;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">Product</th>
            <th style="padding: 12px; text-align: center; font-weight: 600; color: #333;">Qty</th>
            <th style="padding: 12px; text-align: right; font-weight: 600; color: #333;">Price</th>
            <th style="padding: 12px; text-align: right; font-weight: 600; color: #333;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Pricing Summary -->
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #666;">Subtotal:</span>
          <span>₹${order.pricing.subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #666;">Shipping:</span>
          <span>${order.pricing.shippingFee === 0 ? '<span style="color: #22c55e;">FREE</span>' : `₹${order.pricing.shippingFee}`}</span>
        </div>
        ${order.pricing.discount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #666;">Discount:</span>
          <span style="color: #22c55e;">-₹${order.pricing.discount.toLocaleString('en-IN')}</span>
        </div>
        ` : ''}
        <hr style="border: none; border-top: 1px solid #ddd; margin: 12px 0;">
        <div style="display: flex; justify-content: space-between;">
          <span style="font-weight: 600; font-size: 18px;">Total:</span>
          <span style="font-weight: 600; font-size: 18px; color: #2874f0;">₹${order.pricing.total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <!-- Shipping Address -->
      <h3 style="color: #333; margin: 0 0 16px; font-size: 18px;">Shipping Address</h3>
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 4px; font-weight: 600;">${address.fullName}</p>
        <p style="margin: 0 0 4px; color: #666;">${address.addressLine1}</p>
        ${address.addressLine2 ? `<p style="margin: 0 0 4px; color: #666;">${address.addressLine2}</p>` : ''}
        <p style="margin: 0 0 4px; color: #666;">${address.city}, ${address.state} - ${address.pincode}</p>
        <p style="margin: 0; color: #666;">Phone: ${address.phone}</p>
      </div>

      <!-- CTA -->
      <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL}/orders" style="display: inline-block; background-color: #2874f0; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600;">View Order Details</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #eee;">
      <p style="margin: 0 0 8px; color: #666; font-size: 14px;">Need help? Contact us at support@flipkart.com</p>
      <p style="margin: 0; color: #999; font-size: 12px;">© ${new Date().getFullYear()} Flipkart Clone. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};
