const RawMaterial = require("../Model/rawMaterialModel");
const Production = require("../Model/productionModel");
const Product = require("../Model/productModel");
const SalesOrder = require("../Model/salesOrderModel");

// Get dashboard statistics in a single API call
exports.getDashboardStats = async (req, res) => {
  try {
    // Ensure we have a company ID from the authenticated user
    if (!req.companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required but not available",
      });
    }

    // Run all queries in parallel for better performance
    const [rawMaterials, productions, products, salesOrders] =
      await Promise.all([
        RawMaterial.find({ companyId: req.companyId }),
        Production.find({ companyId: req.companyId, status: "Completed" }),
        Product.find({ companyId: req.companyId }),
        SalesOrder.find({ companyId: req.companyId })
          .sort({ date: -1 })
          .limit(10), // Get only the 10 most recent orders
      ]);

    // Calculate total sales
    const totalSales = salesOrders.reduce(
      (sum, order) => sum + (Number(order.total_price) || 0),
      0
    );

    // Rest of the function remains unchanged
    // Format recent activity
    const recentActivity = salesOrders.slice(0, 5).map((order) => ({
      id: order._id,
      type: "Sale",
      description: `${order.p_name || "Product"} (${
        order.quantity || 0
      } kg) to ${order.b_name || "Customer"}`,
      amount: order.total_price || 0,
      date: order.date,
    }));

    // Create chart data
    const chartData = [
      { name: "Raw Materials", value: rawMaterials.length },
      { name: "Production", value: productions.length },
      { name: "Products", value: products.length },
      { name: "Orders", value: salesOrders.length },
    ];

    // Return all dashboard data in a single response
    res.status(200).json({
      success: true,
      data: {
        stats: {
          rawMaterials: rawMaterials.length,
          production: productions.length,
          finishedGoods: products.length,
          pendingOrders: salesOrders.length,
          totalSales: totalSales,
          recentActivity: recentActivity,
        },
        chartData: chartData,
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error.message,
    });
  }
};
