// Orders-All (full history)
app.get("/orders-all", async (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /orders-all`);
  try {
    const orders = await shopifyQuery(`
      query ($cursor: String) {
        orders(first: 50, after: $cursor, sortKey: CREATED_AT, reverse: true) {
          edges {
            cursor
            node {
              name
              createdAt
              financialStatus
              fulfillments { status }
            }
          }
          pageInfo { hasNextPage }
        }
      }
    `, {}, "orders");

    const ordersWithPT = orders.map(o => ({
      ...o,
      createdAt: toPacific(o.createdAt)
    }));

    res.json({
      TOTAL_ORDERS: ordersWithPT.length,
      ORDERS: ordersWithPT
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
