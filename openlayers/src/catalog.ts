/* eslint-disable */
/* THIS FILE WAS AUTO-GENERATED USING CATALOG EXPORTER; YOU SHOULD NOT EDIT THIS FILE; GENERATE TIME: 2026-01-02T19:24:11.100Z; */
// @ts-ignore ignore unused imports here if they happen (e.g. when there is no measure in the workspace)
import {
  newAttribute,
  newMeasure,
  IAttribute,
  IMeasure,
  IMeasureDefinition,
  idRef,
} from "@gooddata/sdk-model";

/**
 * Attribute Title: Customer age
 * Attribute ID: customer_age
 */
export const CustomerAge: IAttribute = newAttribute("customer_age");
/**
 * Attribute Title: Customer city
 * Attribute ID: customer_city
 */
export const CustomerCity = {
  /**
   * Display Form Title: Customer city
   * Display Form ID: customer_city
   */
  Default: newAttribute("customer_city")
  /**
   * Display Form Title: City pushpin latitude
   * Display Form ID: geo__customer_city__city_pushpin_latitude
   */,
  CityPushpinLatitude: newAttribute(
    "geo__customer_city__city_pushpin_latitude"
  )
  /**
   * Display Form Title: City pushpin longitude
   * Display Form ID: geo__customer_city__city_pushpin_longitude
   */,
  CityPushpinLongitude: newAttribute(
    "geo__customer_city__city_pushpin_longitude"
  ),
};
/**
 * Attribute Title: Customer country
 * Attribute ID: customer_country
 */
export const CustomerCountry: IAttribute = newAttribute("customer_country");
/**
 * Attribute Title: Customer email
 * Attribute ID: customer_email
 */
export const CustomerEmail: IAttribute = newAttribute("customer_email");
/**
 * Attribute Title: Customer id
 * Attribute ID: customer_id
 */
export const CustomerId = {
  /**
   * Display Form Title: Customer name
   * Display Form ID: customer_name
   */
  CustomerName: newAttribute("customer_name")
  /**
   * Display Form Title: Customer id
   * Display Form ID: customer_id
   */,
  Default: newAttribute("customer_id"),
};
/**
 * Attribute Title: Customer state
 * Attribute ID: customer_state
 */
export const CustomerState: IAttribute = newAttribute("customer_state");
/**
 * Attribute Title: Monthly inventory id
 * Attribute ID: monthly_inventory_id
 */
export const MonthlyInventoryId: IAttribute = newAttribute(
  "monthly_inventory_id"
);
/**
 * Attribute Title: Order id
 * Attribute ID: order_id
 */
export const OrderId: IAttribute = newAttribute("order_id");
/**
 * Attribute Title: Order line id
 * Attribute ID: order_line_id
 */
export const OrderLineId: IAttribute = newAttribute("order_line_id");
/**
 * Attribute Title: Order status
 * Attribute ID: order_status
 */
export const OrderStatus: IAttribute = newAttribute("order_status");
/**
 * Attribute Title: Product brand
 * Attribute ID: product_brand
 */
export const ProductBrand: IAttribute = newAttribute("product_brand");
/**
 * Attribute Title: Product category
 * Attribute ID: product_category
 */
export const ProductCategory: IAttribute = newAttribute("product_category");
/**
 * Attribute Title: Product id
 * Attribute ID: product_id
 */
export const ProductId = {
  /**
   * Display Form Title: Product name
   * Display Form ID: product_name
   */
  ProductName: newAttribute("product_name")
  /**
   * Display Form Title: Product id
   * Display Form ID: product_id
   */,
  Default: newAttribute("product_id")
  /**
   * Display Form Title: Product id image web
   * Display Form ID: product_id_image_web
   */,
  ImageWeb: newAttribute("product_id_image_web"),
};
/**
 * Attribute Title: Product image
 * Attribute ID: product_image
 */
export const ProductImage = {
  /**
   * Display Form Title: Product image
   * Display Form ID: product_image
   */
  Default: newAttribute("product_image")
  /**
   * Display Form Title: Product image web
   * Display Form ID: product_image_web
   */,
  Web: newAttribute("product_image_web"),
};
/**
 * Attribute Title: Product rating
 * Attribute ID: product_rating
 */
export const ProductRating: IAttribute = newAttribute("product_rating");
/**
 * Attribute Title: Return id
 * Attribute ID: return_id
 */
export const ReturnId: IAttribute = newAttribute("return_id");
/**
 * Metric Title: Active Customers
 * Metric ID: active_customers
 * Metric Type: MAQL Metric
 */
export const ActiveCustomers: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("active_customers", "measure")
);
/**
 * Metric Title: All Time Average Order Volume
 * Metric ID: all_time_average_order_volume
 * Metric Type: MAQL Metric
 */
export const AllTimeAverageOrderVolume: IMeasure<IMeasureDefinition> =
  newMeasure(idRef("all_time_average_order_volume", "measure"));
/**
 * Metric Title: Average Revenue per User (ARPU)
 * Metric ID: arpu
 * Metric Type: MAQL Metric
 */
export const AverageRevenuePerUserARPU: IMeasure<IMeasureDefinition> =
  newMeasure(idRef("arpu", "measure"));
/**
 * Metric Title: Average Orders by Customers
 * Metric ID: average_orders_by_customers
 * Metric Type: MAQL Metric
 */
export const AverageOrdersByCustomers: IMeasure<IMeasureDefinition> =
  newMeasure(idRef("average_orders_by_customers", "measure"));
/**
 * Metric Title: Average Order Volume
 * Metric ID: average_order_volume
 * Metric Type: MAQL Metric
 */
export const AverageOrderVolume: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("average_order_volume", "measure")
);
/**
 * Metric Title: Average Product Cost
 * Metric ID: average_product_cost
 * Metric Type: MAQL Metric
 */
export const AverageProductCost: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("average_product_cost", "measure")
);
/**
 * Metric Title: Average Product Price
 * Metric ID: average_product_price
 * Metric Type: MAQL Metric
 */
export const AverageProductPrice: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("average_product_price", "measure")
);
/**
 * Metric Title: Canceled Orders
 * Metric ID: canceled_orders
 * Metric Type: MAQL Metric
 */
export const CanceledOrders: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("canceled_orders", "measure")
);
/**
 * Metric Title: COGS
 * Metric ID: cogs
 * Metric Type: MAQL Metric
 */
export const COGS: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("cogs", "measure")
);
/**
 * Metric Title: COGS (negative)
 * Metric ID: cogs_n
 * Metric Type: MAQL Metric
 */
export const COGSNegative: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("cogs_n", "measure")
);
/**
 * Metric Title: COGS for Processed Orders
 * Metric ID: cogs_orders
 * Metric Type: MAQL Metric
 */
export const COGSForProcessedOrders: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("cogs_orders", "measure")
);
/**
 * Metric Title: COGS for Returns
 * Metric ID: cogs_returns
 * Metric Type: MAQL Metric
 */
export const COGSForReturns: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("cogs_returns", "measure")
);
/**
 * Metric Title: Cost-to-Revenue Ratio
 * Metric ID: cost-to-revenue_ratio
 * Metric Type: MAQL Metric
 */
export const CostToRevenueRatio: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("cost-to-revenue_ratio", "measure")
);
/**
 * Metric Title: Cost vs Selling Price
 * Metric ID: cost_vs_selling_price
 * Metric Type: MAQL Metric
 */
export const CostVsSellingPrice: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("cost_vs_selling_price", "measure")
);
/**
 * Metric Title: Customer Lifetime Value (CLV)
 * Metric ID: customer_lifetime_value_clv
 * Metric Type: MAQL Metric
 */
export const CustomerLifetimeValueCLV: IMeasure<IMeasureDefinition> =
  newMeasure(idRef("customer_lifetime_value_clv", "measure"));
/**
 * Metric Title: Customer Retention Rate
 * Metric ID: customer_retention_rate
 * Metric Type: MAQL Metric
 */
export const CustomerRetentionRate: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("customer_retention_rate", "measure")
);
/**
 * Metric Title: Customers with Processed Orders
 * Metric ID: customers_w_processed_orders
 * Metric Type: MAQL Metric
 */
export const CustomersWithProcessedOrders: IMeasure<IMeasureDefinition> =
  newMeasure(idRef("customers_w_processed_orders", "measure"));
/**
 * Metric Title: Desired Product Rating
 * Metric ID: desired_product_rating
 * Metric Type: MAQL Metric
 */
export const DesiredProductRating: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("desired_product_rating", "measure")
);
/**
 * Metric Title: Discount Rate
 * Metric ID: discount_rate
 * Metric Type: MAQL Metric
 */
export const DiscountRate: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("discount_rate", "measure")
);
/**
 * Metric Title: Discount Utilization Rate
 * Metric ID: discount_utilization_rate
 * Metric Type: MAQL Metric
 */
export const DiscountUtilizationRate: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("discount_utilization_rate", "measure")
);
/**
 * Metric Title: Global BOM Inventory
 * Metric ID: global_bom_inventory
 * Metric Type: MAQL Metric
 */
export const GlobalBOMInventory: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("global_bom_inventory", "measure")
);
/**
 * Metric Title: Gross Profit
 * Metric ID: gross_profit
 * Metric Type: MAQL Metric
 */
export const GrossProfit: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("gross_profit", "measure")
);
/**
 * Metric Title: Gross Profit Margin
 * Metric ID: gross_profit_margin
 * Metric Type: MAQL Metric
 */
export const GrossProfitMargin: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("gross_profit_margin", "measure")
);
/**
 * Metric Title: Inventory Turnover Rate
 * Metric ID: inventory_turnover_rate
 * Metric Type: MAQL Metric
 */
export const InventoryTurnoverRate: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("inventory_turnover_rate", "measure")
);
/**
 * Metric Title: Markup Percentage
 * Metric ID: markup_percentage
 * Metric Type: MAQL Metric
 */
export const MarkupPercentage: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("markup_percentage", "measure")
);
/**
 * Metric Title: Monthly Total Sales
 * Metric ID: monthly_total_sales
 * Metric Type: MAQL Metric
 */
export const MonthlyTotalSales: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("monthly_total_sales", "measure")
);
/**
 * Metric Title: Net Delivered Orders
 * Metric ID: net_delivered_orders
 * Metric Type: MAQL Metric
 */
export const NetDeliveredOrders: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("net_delivered_orders", "measure")
);
/**
 * Metric Title: Net Orders
 * Metric ID: net_orders
 * Metric Type: MAQL Metric
 */
export const NetOrders: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("net_orders", "measure")
);
/**
 * Metric Title: Total Net Sales
 * Metric ID: net_sales
 * Metric Type: MAQL Metric
 */
export const TotalNetSales: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("net_sales", "measure")
);
/**
 * Metric Title: Net Sales Goal
 * Metric ID: net_sales_goal
 * Metric Type: MAQL Metric
 */
export const NetSalesGoal: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("net_sales_goal", "measure")
);
/**
 * Metric Title: New Customers
 * Metric ID: new_customers
 * Metric Type: MAQL Metric
 */
export const NewCustomers: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("new_customers", "measure")
);
/**
 * Metric Title: # of Orders
 * Metric ID: number_of_orders
 * Metric Type: MAQL Metric
 */
export const NrOfOrders: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("number_of_orders", "measure")
);
/**
 * Metric Title: # of Single Orders
 * Metric ID: number_of_single_orders
 * Metric Type: MAQL Metric
 */
export const NrOfSingleOrders: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("number_of_single_orders", "measure")
);
/**
 * Metric Title: Total Order Amount
 * Metric ID: order_amount
 * Metric Type: MAQL Metric
 */
export const TotalOrderAmount: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("order_amount", "measure")
);
/**
 * Metric Title: Order Volume vs Return Volume
 * Metric ID: order_volume_vs_return_volume
 * Metric Type: MAQL Metric
 */
export const OrderVolumeVsReturnVolume: IMeasure<IMeasureDefinition> =
  newMeasure(idRef("order_volume_vs_return_volume", "measure"));
/**
 * Metric Title: % of Net Sales
 * Metric ID: percentage_of_net_sales
 * Metric Type: MAQL Metric
 */
export const PercentOfNetSales: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("percentage_of_net_sales", "measure")
);
/**
 * Metric Title: Perfectly Inelastic
 * Metric ID: perfectly_inelastic
 * Metric Type: MAQL Metric
 */
export const PerfectlyInelastic: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("perfectly_inelastic", "measure")
);
/**
 * Metric Title: Price Elasticity of Demand
 * Metric ID: price_elasticity_of_demand
 * Metric Type: MAQL Metric
 */
export const PriceElasticityOfDemand: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("price_elasticity_of_demand", "measure")
);
/**
 * Metric Title: Product Rating
 * Metric ID: product_rating
 * Metric Type: MAQL Metric
 */
export const ProductRating_1: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("product_rating", "measure")
);
/**
 * Metric Title: Product Return Rate
 * Metric ID: product_return_rate
 * Metric Type: MAQL Metric
 */
export const ProductReturnRate: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("product_return_rate", "measure")
);
/**
 * Metric Title: Profit per Order
 * Metric ID: profit_per_order
 * Metric Type: MAQL Metric
 */
export const ProfitPerOrder: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("profit_per_order", "measure")
);
/**
 * Metric Title: Purchase Frequency per Customer
 * Metric ID: purchase_frequency_per_customer
 * Metric Type: MAQL Metric
 */
export const PurchaseFrequencyPerCustomer: IMeasure<IMeasureDefinition> =
  newMeasure(idRef("purchase_frequency_per_customer", "measure"));
/**
 * Metric Title: BOM Quantity by Year
 * Metric ID: quantity_bom_by_year
 * Metric Type: MAQL Metric
 */
export const BOMQuantityByYear: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("quantity_bom_by_year", "measure")
);
/**
 * Metric Title: Returning Customers
 * Metric ID: return_customers
 * Metric Type: MAQL Metric
 */
export const ReturningCustomers: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("return_customers", "measure")
);
/**
 * Metric Title: Return Loss Impact
 * Metric ID: return_loss_impact
 * Metric Type: MAQL Metric
 */
export const ReturnLossImpact: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("return_loss_impact", "measure")
);
/**
 * Metric Title: Revenue by Product
 * Metric ID: revenue_by_product
 * Metric Type: MAQL Metric
 */
export const RevenueByProduct: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("revenue_by_product", "measure")
);
/**
 * Metric Title: Sales Conversion Rate
 * Metric ID: sales_conversion_rate
 * Metric Type: MAQL Metric
 */
export const SalesConversionRate: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("sales_conversion_rate", "measure")
);
/**
 * Metric Title: Sales-to-Returns Correlation
 * Metric ID: sales-to-returns_correlation
 * Metric Type: MAQL Metric
 */
export const SalesToReturnsCorrelation: IMeasure<IMeasureDefinition> =
  newMeasure(idRef("sales-to-returns_correlation", "measure"));
/**
 * Metric Title: Sell-Through Rate
 * Metric ID: sell_through_rate
 * Metric Type: MAQL Metric
 */
export const SellThroughRate: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("sell_through_rate", "measure")
);
/**
 * Metric Title: Top Products
 * Metric ID: top_products
 * Metric Type: MAQL Metric
 */
export const TopProducts: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("top_products", "measure")
);
/**
 * Metric Title: Total BOM Inventory (Ignoring Year)
 * Metric ID: total_bom_inventory
 * Metric Type: MAQL Metric
 */
export const TotalBOMInventoryIgnoringYear: IMeasure<IMeasureDefinition> =
  newMeasure(idRef("total_bom_inventory", "measure"));
/**
 * Metric Title: Total Customers
 * Metric ID: total_customers
 * Metric Type: MAQL Metric
 */
export const TotalCustomers: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("total_customers", "measure")
);
/**
 * Metric Title: Total Discounts
 * Metric ID: total_discounts
 * Metric Type: MAQL Metric
 */
export const TotalDiscounts: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("total_discounts", "measure")
);
/**
 * Metric Title: Total Discounts (Negative)
 * Metric ID: total_discounts_n
 * Metric Type: MAQL Metric
 */
export const TotalDiscountsNegative: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("total_discounts_n", "measure")
);
/**
 * Metric Title: Total Product Costs
 * Metric ID: total_product_costs
 * Metric Type: MAQL Metric
 */
export const TotalProductCosts: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("total_product_costs", "measure")
);
/**
 * Metric Title: Total Returns
 * Metric ID: total_returns
 * Metric Type: MAQL Metric
 */
export const TotalReturns: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("total_returns", "measure")
);
/**
 * Metric Title: Total Returns (Negative)
 * Metric ID: total_returns_n
 * Metric Type: MAQL Metric
 */
export const TotalReturnsNegative: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("total_returns_n", "measure")
);
/**
 * Metric Title: Total Sales
 * Metric ID: total_sales
 * Metric Type: MAQL Metric
 */
export const TotalSales: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("total_sales", "measure")
);
/**
 * Metric Title: Unit Elastic
 * Metric ID: unit_elastic
 * Metric Type: MAQL Metric
 */
export const UnitElastic: IMeasure<IMeasureDefinition> = newMeasure(
  idRef("unit_elastic", "measure")
);
/**
 * Metric Title: Product Price vs Return Volume
 * Metric ID: unit_price_vs_return_volume
 * Metric Type: MAQL Metric
 */
export const ProductPriceVsReturnVolume: IMeasure<IMeasureDefinition> =
  newMeasure(idRef("unit_price_vs_return_volume", "measure"));
/**
 * Fact Title: Monthly quantity bom
 * Fact ID: monthly_quantity_bom
 */
export const MonthlyQuantityBom = {
  /**
   * Fact Title: Monthly quantity bom
   * Fact ID: monthly_quantity_bom
   * Fact Aggregation: sum
   */
  Sum: newMeasure(idRef("monthly_quantity_bom", "fact"), (m) =>
    m.aggregation("sum")
  )
  /**
   * Fact Title: Monthly quantity bom
   * Fact ID: monthly_quantity_bom
   * Fact Aggregation: avg
   */,
  Avg: newMeasure(idRef("monthly_quantity_bom", "fact"), (m) =>
    m.aggregation("avg")
  )
  /**
   * Fact Title: Monthly quantity bom
   * Fact ID: monthly_quantity_bom
   * Fact Aggregation: min
   */,
  Min: newMeasure(idRef("monthly_quantity_bom", "fact"), (m) =>
    m.aggregation("min")
  )
  /**
   * Fact Title: Monthly quantity bom
   * Fact ID: monthly_quantity_bom
   * Fact Aggregation: max
   */,
  Max: newMeasure(idRef("monthly_quantity_bom", "fact"), (m) =>
    m.aggregation("max")
  )
  /**
   * Fact Title: Monthly quantity bom
   * Fact ID: monthly_quantity_bom
   * Fact Aggregation: median
   */,
  Median: newMeasure(idRef("monthly_quantity_bom", "fact"), (m) =>
    m.aggregation("median")
  )
  /**
   * Fact Title: Monthly quantity bom
   * Fact ID: monthly_quantity_bom
   * Fact Aggregation: runsum
   */,
  Runsum: newMeasure(idRef("monthly_quantity_bom", "fact"), (m) =>
    m.aggregation("runsum")
  ),
};
/**
 * Fact Title: Monthly quantity eom
 * Fact ID: monthly_quantity_eom
 */
export const MonthlyQuantityEom = {
  /**
   * Fact Title: Monthly quantity eom
   * Fact ID: monthly_quantity_eom
   * Fact Aggregation: sum
   */
  Sum: newMeasure(idRef("monthly_quantity_eom", "fact"), (m) =>
    m.aggregation("sum")
  )
  /**
   * Fact Title: Monthly quantity eom
   * Fact ID: monthly_quantity_eom
   * Fact Aggregation: avg
   */,
  Avg: newMeasure(idRef("monthly_quantity_eom", "fact"), (m) =>
    m.aggregation("avg")
  )
  /**
   * Fact Title: Monthly quantity eom
   * Fact ID: monthly_quantity_eom
   * Fact Aggregation: min
   */,
  Min: newMeasure(idRef("monthly_quantity_eom", "fact"), (m) =>
    m.aggregation("min")
  )
  /**
   * Fact Title: Monthly quantity eom
   * Fact ID: monthly_quantity_eom
   * Fact Aggregation: max
   */,
  Max: newMeasure(idRef("monthly_quantity_eom", "fact"), (m) =>
    m.aggregation("max")
  )
  /**
   * Fact Title: Monthly quantity eom
   * Fact ID: monthly_quantity_eom
   * Fact Aggregation: median
   */,
  Median: newMeasure(idRef("monthly_quantity_eom", "fact"), (m) =>
    m.aggregation("median")
  )
  /**
   * Fact Title: Monthly quantity eom
   * Fact ID: monthly_quantity_eom
   * Fact Aggregation: runsum
   */,
  Runsum: newMeasure(idRef("monthly_quantity_eom", "fact"), (m) =>
    m.aggregation("runsum")
  ),
};
/**
 * Fact Title: Order unit cost
 * Fact ID: order_unit_cost
 */
export const OrderUnitCost = {
  /**
   * Fact Title: Order unit cost
   * Fact ID: order_unit_cost
   * Fact Aggregation: sum
   */
  Sum: newMeasure(idRef("order_unit_cost", "fact"), (m) =>
    m.aggregation("sum")
  )
  /**
   * Fact Title: Order unit cost
   * Fact ID: order_unit_cost
   * Fact Aggregation: avg
   */,
  Avg: newMeasure(idRef("order_unit_cost", "fact"), (m) =>
    m.aggregation("avg")
  )
  /**
   * Fact Title: Order unit cost
   * Fact ID: order_unit_cost
   * Fact Aggregation: min
   */,
  Min: newMeasure(idRef("order_unit_cost", "fact"), (m) =>
    m.aggregation("min")
  )
  /**
   * Fact Title: Order unit cost
   * Fact ID: order_unit_cost
   * Fact Aggregation: max
   */,
  Max: newMeasure(idRef("order_unit_cost", "fact"), (m) =>
    m.aggregation("max")
  )
  /**
   * Fact Title: Order unit cost
   * Fact ID: order_unit_cost
   * Fact Aggregation: median
   */,
  Median: newMeasure(idRef("order_unit_cost", "fact"), (m) =>
    m.aggregation("median")
  )
  /**
   * Fact Title: Order unit cost
   * Fact ID: order_unit_cost
   * Fact Aggregation: runsum
   */,
  Runsum: newMeasure(idRef("order_unit_cost", "fact"), (m) =>
    m.aggregation("runsum")
  ),
};
/**
 * Fact Title: Order unit discount
 * Fact ID: order_unit_discount
 */
export const OrderUnitDiscount = {
  /**
   * Fact Title: Order unit discount
   * Fact ID: order_unit_discount
   * Fact Aggregation: sum
   */
  Sum: newMeasure(idRef("order_unit_discount", "fact"), (m) =>
    m.aggregation("sum")
  )
  /**
   * Fact Title: Order unit discount
   * Fact ID: order_unit_discount
   * Fact Aggregation: avg
   */,
  Avg: newMeasure(idRef("order_unit_discount", "fact"), (m) =>
    m.aggregation("avg")
  )
  /**
   * Fact Title: Order unit discount
   * Fact ID: order_unit_discount
   * Fact Aggregation: min
   */,
  Min: newMeasure(idRef("order_unit_discount", "fact"), (m) =>
    m.aggregation("min")
  )
  /**
   * Fact Title: Order unit discount
   * Fact ID: order_unit_discount
   * Fact Aggregation: max
   */,
  Max: newMeasure(idRef("order_unit_discount", "fact"), (m) =>
    m.aggregation("max")
  )
  /**
   * Fact Title: Order unit discount
   * Fact ID: order_unit_discount
   * Fact Aggregation: median
   */,
  Median: newMeasure(idRef("order_unit_discount", "fact"), (m) =>
    m.aggregation("median")
  )
  /**
   * Fact Title: Order unit discount
   * Fact ID: order_unit_discount
   * Fact Aggregation: runsum
   */,
  Runsum: newMeasure(idRef("order_unit_discount", "fact"), (m) =>
    m.aggregation("runsum")
  ),
};
/**
 * Fact Title: Order unit price
 * Fact ID: order_unit_price
 */
export const OrderUnitPrice = {
  /**
   * Fact Title: Order unit price
   * Fact ID: order_unit_price
   * Fact Aggregation: sum
   */
  Sum: newMeasure(idRef("order_unit_price", "fact"), (m) =>
    m.aggregation("sum")
  )
  /**
   * Fact Title: Order unit price
   * Fact ID: order_unit_price
   * Fact Aggregation: avg
   */,
  Avg: newMeasure(idRef("order_unit_price", "fact"), (m) =>
    m.aggregation("avg")
  )
  /**
   * Fact Title: Order unit price
   * Fact ID: order_unit_price
   * Fact Aggregation: min
   */,
  Min: newMeasure(idRef("order_unit_price", "fact"), (m) =>
    m.aggregation("min")
  )
  /**
   * Fact Title: Order unit price
   * Fact ID: order_unit_price
   * Fact Aggregation: max
   */,
  Max: newMeasure(idRef("order_unit_price", "fact"), (m) =>
    m.aggregation("max")
  )
  /**
   * Fact Title: Order unit price
   * Fact ID: order_unit_price
   * Fact Aggregation: median
   */,
  Median: newMeasure(idRef("order_unit_price", "fact"), (m) =>
    m.aggregation("median")
  )
  /**
   * Fact Title: Order unit price
   * Fact ID: order_unit_price
   * Fact Aggregation: runsum
   */,
  Runsum: newMeasure(idRef("order_unit_price", "fact"), (m) =>
    m.aggregation("runsum")
  ),
};
/**
 * Fact Title: Order unit quantity
 * Fact ID: order_unit_quantity
 */
export const OrderUnitQuantity = {
  /**
   * Fact Title: Order unit quantity
   * Fact ID: order_unit_quantity
   * Fact Aggregation: sum
   */
  Sum: newMeasure(idRef("order_unit_quantity", "fact"), (m) =>
    m.aggregation("sum")
  )
  /**
   * Fact Title: Order unit quantity
   * Fact ID: order_unit_quantity
   * Fact Aggregation: avg
   */,
  Avg: newMeasure(idRef("order_unit_quantity", "fact"), (m) =>
    m.aggregation("avg")
  )
  /**
   * Fact Title: Order unit quantity
   * Fact ID: order_unit_quantity
   * Fact Aggregation: min
   */,
  Min: newMeasure(idRef("order_unit_quantity", "fact"), (m) =>
    m.aggregation("min")
  )
  /**
   * Fact Title: Order unit quantity
   * Fact ID: order_unit_quantity
   * Fact Aggregation: max
   */,
  Max: newMeasure(idRef("order_unit_quantity", "fact"), (m) =>
    m.aggregation("max")
  )
  /**
   * Fact Title: Order unit quantity
   * Fact ID: order_unit_quantity
   * Fact Aggregation: median
   */,
  Median: newMeasure(idRef("order_unit_quantity", "fact"), (m) =>
    m.aggregation("median")
  )
  /**
   * Fact Title: Order unit quantity
   * Fact ID: order_unit_quantity
   * Fact Aggregation: runsum
   */,
  Runsum: newMeasure(idRef("order_unit_quantity", "fact"), (m) =>
    m.aggregation("runsum")
  ),
};
/**
 * Fact Title: Rating
 * Fact ID: rating
 */
export const Rating = {
  /**
   * Fact Title: Rating
   * Fact ID: rating
   * Fact Aggregation: sum
   */
  Sum: newMeasure(idRef("rating", "fact"), (m) => m.aggregation("sum"))
  /**
   * Fact Title: Rating
   * Fact ID: rating
   * Fact Aggregation: avg
   */,
  Avg: newMeasure(idRef("rating", "fact"), (m) => m.aggregation("avg"))
  /**
   * Fact Title: Rating
   * Fact ID: rating
   * Fact Aggregation: min
   */,
  Min: newMeasure(idRef("rating", "fact"), (m) => m.aggregation("min"))
  /**
   * Fact Title: Rating
   * Fact ID: rating
   * Fact Aggregation: max
   */,
  Max: newMeasure(idRef("rating", "fact"), (m) => m.aggregation("max"))
  /**
   * Fact Title: Rating
   * Fact ID: rating
   * Fact Aggregation: median
   */,
  Median: newMeasure(idRef("rating", "fact"), (m) => m.aggregation("median"))
  /**
   * Fact Title: Rating
   * Fact ID: rating
   * Fact Aggregation: runsum
   */,
  Runsum: newMeasure(idRef("rating", "fact"), (m) => m.aggregation("runsum")),
};
/**
 * Fact Title: Return unit cost
 * Fact ID: return_unit_cost
 */
export const ReturnUnitCost = {
  /**
   * Fact Title: Return unit cost
   * Fact ID: return_unit_cost
   * Fact Aggregation: sum
   */
  Sum: newMeasure(idRef("return_unit_cost", "fact"), (m) =>
    m.aggregation("sum")
  )
  /**
   * Fact Title: Return unit cost
   * Fact ID: return_unit_cost
   * Fact Aggregation: avg
   */,
  Avg: newMeasure(idRef("return_unit_cost", "fact"), (m) =>
    m.aggregation("avg")
  )
  /**
   * Fact Title: Return unit cost
   * Fact ID: return_unit_cost
   * Fact Aggregation: min
   */,
  Min: newMeasure(idRef("return_unit_cost", "fact"), (m) =>
    m.aggregation("min")
  )
  /**
   * Fact Title: Return unit cost
   * Fact ID: return_unit_cost
   * Fact Aggregation: max
   */,
  Max: newMeasure(idRef("return_unit_cost", "fact"), (m) =>
    m.aggregation("max")
  )
  /**
   * Fact Title: Return unit cost
   * Fact ID: return_unit_cost
   * Fact Aggregation: median
   */,
  Median: newMeasure(idRef("return_unit_cost", "fact"), (m) =>
    m.aggregation("median")
  )
  /**
   * Fact Title: Return unit cost
   * Fact ID: return_unit_cost
   * Fact Aggregation: runsum
   */,
  Runsum: newMeasure(idRef("return_unit_cost", "fact"), (m) =>
    m.aggregation("runsum")
  ),
};
/**
 * Fact Title: Return unit paid amount
 * Fact ID: return_unit_paid_amount
 */
export const ReturnUnitPaidAmount = {
  /**
   * Fact Title: Return unit paid amount
   * Fact ID: return_unit_paid_amount
   * Fact Aggregation: sum
   */
  Sum: newMeasure(idRef("return_unit_paid_amount", "fact"), (m) =>
    m.aggregation("sum")
  )
  /**
   * Fact Title: Return unit paid amount
   * Fact ID: return_unit_paid_amount
   * Fact Aggregation: avg
   */,
  Avg: newMeasure(idRef("return_unit_paid_amount", "fact"), (m) =>
    m.aggregation("avg")
  )
  /**
   * Fact Title: Return unit paid amount
   * Fact ID: return_unit_paid_amount
   * Fact Aggregation: min
   */,
  Min: newMeasure(idRef("return_unit_paid_amount", "fact"), (m) =>
    m.aggregation("min")
  )
  /**
   * Fact Title: Return unit paid amount
   * Fact ID: return_unit_paid_amount
   * Fact Aggregation: max
   */,
  Max: newMeasure(idRef("return_unit_paid_amount", "fact"), (m) =>
    m.aggregation("max")
  )
  /**
   * Fact Title: Return unit paid amount
   * Fact ID: return_unit_paid_amount
   * Fact Aggregation: median
   */,
  Median: newMeasure(idRef("return_unit_paid_amount", "fact"), (m) =>
    m.aggregation("median")
  )
  /**
   * Fact Title: Return unit paid amount
   * Fact ID: return_unit_paid_amount
   * Fact Aggregation: runsum
   */,
  Runsum: newMeasure(idRef("return_unit_paid_amount", "fact"), (m) =>
    m.aggregation("runsum")
  ),
};
/**
 * Fact Title: Return unit quantity
 * Fact ID: return_unit_quantity
 */
export const ReturnUnitQuantity = {
  /**
   * Fact Title: Return unit quantity
   * Fact ID: return_unit_quantity
   * Fact Aggregation: sum
   */
  Sum: newMeasure(idRef("return_unit_quantity", "fact"), (m) =>
    m.aggregation("sum")
  )
  /**
   * Fact Title: Return unit quantity
   * Fact ID: return_unit_quantity
   * Fact Aggregation: avg
   */,
  Avg: newMeasure(idRef("return_unit_quantity", "fact"), (m) =>
    m.aggregation("avg")
  )
  /**
   * Fact Title: Return unit quantity
   * Fact ID: return_unit_quantity
   * Fact Aggregation: min
   */,
  Min: newMeasure(idRef("return_unit_quantity", "fact"), (m) =>
    m.aggregation("min")
  )
  /**
   * Fact Title: Return unit quantity
   * Fact ID: return_unit_quantity
   * Fact Aggregation: max
   */,
  Max: newMeasure(idRef("return_unit_quantity", "fact"), (m) =>
    m.aggregation("max")
  )
  /**
   * Fact Title: Return unit quantity
   * Fact ID: return_unit_quantity
   * Fact Aggregation: median
   */,
  Median: newMeasure(idRef("return_unit_quantity", "fact"), (m) =>
    m.aggregation("median")
  )
  /**
   * Fact Title: Return unit quantity
   * Fact ID: return_unit_quantity
   * Fact Aggregation: runsum
   */,
  Runsum: newMeasure(idRef("return_unit_quantity", "fact"), (m) =>
    m.aggregation("runsum")
  ),
};
/** Available Date Data Sets */
export const DateDatasets = {
  /**
   * Date Data Set Title: Customer created date
   * Date Data Set ID: customer_created_date
   */
  CustomerCreatedDate: {
    ref: idRef("customer_created_date", "dataSet"),
    identifier: "customer_created_date"
    /**
     * Date Attribute: Customer created date - Date
     * Date Attribute ID: customer_created_date.day
     */,
    CustomerCreatedDateDate: {
      ref: idRef("customer_created_date.day", "attribute"),
      identifier: "customer_created_date.day"
      /**
       * Display Form Title: Customer created date - Date
       * Display Form ID: customer_created_date.day
       */,
      Default: newAttribute("customer_created_date.day"),
    }
    /**
     * Date Attribute: Customer created date - Day of Month
     * Date Attribute ID: customer_created_date.dayOfMonth
     */,
    CustomerCreatedDateDayOfMonth: {
      ref: idRef("customer_created_date.dayOfMonth", "attribute"),
      identifier: "customer_created_date.dayOfMonth"
      /**
       * Display Form Title: Customer created date - Day of Month
       * Display Form ID: customer_created_date.dayOfMonth
       */,
      Default: newAttribute("customer_created_date.dayOfMonth"),
    }
    /**
     * Date Attribute: Customer created date - Day of Week
     * Date Attribute ID: customer_created_date.dayOfWeek
     */,
    CustomerCreatedDateDayOfWeek: {
      ref: idRef("customer_created_date.dayOfWeek", "attribute"),
      identifier: "customer_created_date.dayOfWeek"
      /**
       * Display Form Title: Customer created date - Day of Week
       * Display Form ID: customer_created_date.dayOfWeek
       */,
      Default: newAttribute("customer_created_date.dayOfWeek"),
    }
    /**
     * Date Attribute: Customer created date - Day of Year
     * Date Attribute ID: customer_created_date.dayOfYear
     */,
    CustomerCreatedDateDayOfYear: {
      ref: idRef("customer_created_date.dayOfYear", "attribute"),
      identifier: "customer_created_date.dayOfYear"
      /**
       * Display Form Title: Customer created date - Day of Year
       * Display Form ID: customer_created_date.dayOfYear
       */,
      Default: newAttribute("customer_created_date.dayOfYear"),
    }
    /**
     * Date Attribute: Customer created date - Hour
     * Date Attribute ID: customer_created_date.hour
     */,
    CustomerCreatedDateHour: {
      ref: idRef("customer_created_date.hour", "attribute"),
      identifier: "customer_created_date.hour"
      /**
       * Display Form Title: Customer created date - Hour
       * Display Form ID: customer_created_date.hour
       */,
      Default: newAttribute("customer_created_date.hour"),
    }
    /**
     * Date Attribute: Customer created date - Hour of Day
     * Date Attribute ID: customer_created_date.hourOfDay
     */,
    CustomerCreatedDateHourOfDay: {
      ref: idRef("customer_created_date.hourOfDay", "attribute"),
      identifier: "customer_created_date.hourOfDay"
      /**
       * Display Form Title: Customer created date - Hour of Day
       * Display Form ID: customer_created_date.hourOfDay
       */,
      Default: newAttribute("customer_created_date.hourOfDay"),
    }
    /**
     * Date Attribute: Customer created date - Minute
     * Date Attribute ID: customer_created_date.minute
     */,
    CustomerCreatedDateMinute: {
      ref: idRef("customer_created_date.minute", "attribute"),
      identifier: "customer_created_date.minute"
      /**
       * Display Form Title: Customer created date - Minute
       * Display Form ID: customer_created_date.minute
       */,
      Default: newAttribute("customer_created_date.minute"),
    }
    /**
     * Date Attribute: Customer created date - Minute of Hour
     * Date Attribute ID: customer_created_date.minuteOfHour
     */,
    CustomerCreatedDateMinuteOfHour: {
      ref: idRef("customer_created_date.minuteOfHour", "attribute"),
      identifier: "customer_created_date.minuteOfHour"
      /**
       * Display Form Title: Customer created date - Minute of Hour
       * Display Form ID: customer_created_date.minuteOfHour
       */,
      Default: newAttribute("customer_created_date.minuteOfHour"),
    }
    /**
     * Date Attribute: Customer created date - Month/Year
     * Date Attribute ID: customer_created_date.month
     */,
    CustomerCreatedDateMonthYear: {
      ref: idRef("customer_created_date.month", "attribute"),
      identifier: "customer_created_date.month"
      /**
       * Display Form Title: Customer created date - Month/Year
       * Display Form ID: customer_created_date.month
       */,
      Default: newAttribute("customer_created_date.month"),
    }
    /**
     * Date Attribute: Customer created date - Month of Year
     * Date Attribute ID: customer_created_date.monthOfYear
     */,
    CustomerCreatedDateMonthOfYear: {
      ref: idRef("customer_created_date.monthOfYear", "attribute"),
      identifier: "customer_created_date.monthOfYear"
      /**
       * Display Form Title: Customer created date - Month of Year
       * Display Form ID: customer_created_date.monthOfYear
       */,
      Default: newAttribute("customer_created_date.monthOfYear"),
    }
    /**
     * Date Attribute: Customer created date - Quarter/Year
     * Date Attribute ID: customer_created_date.quarter
     */,
    CustomerCreatedDateQuarterYear: {
      ref: idRef("customer_created_date.quarter", "attribute"),
      identifier: "customer_created_date.quarter"
      /**
       * Display Form Title: Customer created date - Quarter/Year
       * Display Form ID: customer_created_date.quarter
       */,
      Default: newAttribute("customer_created_date.quarter"),
    }
    /**
     * Date Attribute: Customer created date - Quarter of Year
     * Date Attribute ID: customer_created_date.quarterOfYear
     */,
    CustomerCreatedDateQuarterOfYear: {
      ref: idRef("customer_created_date.quarterOfYear", "attribute"),
      identifier: "customer_created_date.quarterOfYear"
      /**
       * Display Form Title: Customer created date - Quarter of Year
       * Display Form ID: customer_created_date.quarterOfYear
       */,
      Default: newAttribute("customer_created_date.quarterOfYear"),
    }
    /**
     * Date Attribute: Customer created date - Week/Year
     * Date Attribute ID: customer_created_date.week
     */,
    CustomerCreatedDateWeekYear: {
      ref: idRef("customer_created_date.week", "attribute"),
      identifier: "customer_created_date.week"
      /**
       * Display Form Title: Customer created date - Week/Year
       * Display Form ID: customer_created_date.week
       */,
      Default: newAttribute("customer_created_date.week"),
    }
    /**
     * Date Attribute: Customer created date - Week of Year
     * Date Attribute ID: customer_created_date.weekOfYear
     */,
    CustomerCreatedDateWeekOfYear: {
      ref: idRef("customer_created_date.weekOfYear", "attribute"),
      identifier: "customer_created_date.weekOfYear"
      /**
       * Display Form Title: Customer created date - Week of Year
       * Display Form ID: customer_created_date.weekOfYear
       */,
      Default: newAttribute("customer_created_date.weekOfYear"),
    }
    /**
     * Date Attribute: Customer created date - Year
     * Date Attribute ID: customer_created_date.year
     */,
    CustomerCreatedDateYear: {
      ref: idRef("customer_created_date.year", "attribute"),
      identifier: "customer_created_date.year"
      /**
       * Display Form Title: Customer created date - Year
       * Display Form ID: customer_created_date.year
       */,
      Default: newAttribute("customer_created_date.year"),
    },
  }
  /**
   * Date Data Set Title: Date
   * Date Data Set ID: date
   */,
  Date: {
    ref: idRef("date", "dataSet"),
    identifier: "date"
    /**
     * Date Attribute: Date - Date
     * Date Attribute ID: date.day
     */,
    DateDate: {
      ref: idRef("date.day", "attribute"),
      identifier: "date.day"
      /**
       * Display Form Title: Date - Date
       * Display Form ID: date.day
       */,
      Default: newAttribute("date.day"),
    }
    /**
     * Date Attribute: Date - Day of Month
     * Date Attribute ID: date.dayOfMonth
     */,
    DateDayOfMonth: {
      ref: idRef("date.dayOfMonth", "attribute"),
      identifier: "date.dayOfMonth"
      /**
       * Display Form Title: Date - Day of Month
       * Display Form ID: date.dayOfMonth
       */,
      Default: newAttribute("date.dayOfMonth"),
    }
    /**
     * Date Attribute: Date - Day of Week
     * Date Attribute ID: date.dayOfWeek
     */,
    DateDayOfWeek: {
      ref: idRef("date.dayOfWeek", "attribute"),
      identifier: "date.dayOfWeek"
      /**
       * Display Form Title: Date - Day of Week
       * Display Form ID: date.dayOfWeek
       */,
      Default: newAttribute("date.dayOfWeek"),
    }
    /**
     * Date Attribute: Date - Day of Year
     * Date Attribute ID: date.dayOfYear
     */,
    DateDayOfYear: {
      ref: idRef("date.dayOfYear", "attribute"),
      identifier: "date.dayOfYear"
      /**
       * Display Form Title: Date - Day of Year
       * Display Form ID: date.dayOfYear
       */,
      Default: newAttribute("date.dayOfYear"),
    }
    /**
     * Date Attribute: Date - Hour
     * Date Attribute ID: date.hour
     */,
    DateHour: {
      ref: idRef("date.hour", "attribute"),
      identifier: "date.hour"
      /**
       * Display Form Title: Date - Hour
       * Display Form ID: date.hour
       */,
      Default: newAttribute("date.hour"),
    }
    /**
     * Date Attribute: Date - Hour of Day
     * Date Attribute ID: date.hourOfDay
     */,
    DateHourOfDay: {
      ref: idRef("date.hourOfDay", "attribute"),
      identifier: "date.hourOfDay"
      /**
       * Display Form Title: Date - Hour of Day
       * Display Form ID: date.hourOfDay
       */,
      Default: newAttribute("date.hourOfDay"),
    }
    /**
     * Date Attribute: Date - Minute
     * Date Attribute ID: date.minute
     */,
    DateMinute: {
      ref: idRef("date.minute", "attribute"),
      identifier: "date.minute"
      /**
       * Display Form Title: Date - Minute
       * Display Form ID: date.minute
       */,
      Default: newAttribute("date.minute"),
    }
    /**
     * Date Attribute: Date - Minute of Hour
     * Date Attribute ID: date.minuteOfHour
     */,
    DateMinuteOfHour: {
      ref: idRef("date.minuteOfHour", "attribute"),
      identifier: "date.minuteOfHour"
      /**
       * Display Form Title: Date - Minute of Hour
       * Display Form ID: date.minuteOfHour
       */,
      Default: newAttribute("date.minuteOfHour"),
    }
    /**
     * Date Attribute: Date - Month/Year
     * Date Attribute ID: date.month
     */,
    DateMonthYear: {
      ref: idRef("date.month", "attribute"),
      identifier: "date.month"
      /**
       * Display Form Title: Date - Month/Year
       * Display Form ID: date.month
       */,
      Default: newAttribute("date.month"),
    }
    /**
     * Date Attribute: Date - Month of Year
     * Date Attribute ID: date.monthOfYear
     */,
    DateMonthOfYear: {
      ref: idRef("date.monthOfYear", "attribute"),
      identifier: "date.monthOfYear"
      /**
       * Display Form Title: Date - Month of Year
       * Display Form ID: date.monthOfYear
       */,
      Default: newAttribute("date.monthOfYear"),
    }
    /**
     * Date Attribute: Date - Quarter/Year
     * Date Attribute ID: date.quarter
     */,
    DateQuarterYear: {
      ref: idRef("date.quarter", "attribute"),
      identifier: "date.quarter"
      /**
       * Display Form Title: Date - Quarter/Year
       * Display Form ID: date.quarter
       */,
      Default: newAttribute("date.quarter"),
    }
    /**
     * Date Attribute: Date - Quarter of Year
     * Date Attribute ID: date.quarterOfYear
     */,
    DateQuarterOfYear: {
      ref: idRef("date.quarterOfYear", "attribute"),
      identifier: "date.quarterOfYear"
      /**
       * Display Form Title: Date - Quarter of Year
       * Display Form ID: date.quarterOfYear
       */,
      Default: newAttribute("date.quarterOfYear"),
    }
    /**
     * Date Attribute: Date - Week/Year
     * Date Attribute ID: date.week
     */,
    DateWeekYear: {
      ref: idRef("date.week", "attribute"),
      identifier: "date.week"
      /**
       * Display Form Title: Date - Week/Year
       * Display Form ID: date.week
       */,
      Default: newAttribute("date.week"),
    }
    /**
     * Date Attribute: Date - Week of Year
     * Date Attribute ID: date.weekOfYear
     */,
    DateWeekOfYear: {
      ref: idRef("date.weekOfYear", "attribute"),
      identifier: "date.weekOfYear"
      /**
       * Display Form Title: Date - Week of Year
       * Display Form ID: date.weekOfYear
       */,
      Default: newAttribute("date.weekOfYear"),
    }
    /**
     * Date Attribute: Date - Year
     * Date Attribute ID: date.year
     */,
    DateYear: {
      ref: idRef("date.year", "attribute"),
      identifier: "date.year"
      /**
       * Display Form Title: Date - Year
       * Display Form ID: date.year
       */,
      Default: newAttribute("date.year"),
    },
  }
  /**
   * Date Data Set Title: Inventory month
   * Date Data Set ID: inventory_month
   */,
  InventoryMonth: {
    ref: idRef("inventory_month", "dataSet"),
    identifier: "inventory_month"
    /**
     * Date Attribute: Inventory month - Date
     * Date Attribute ID: inventory_month.day
     */,
    InventoryMonthDate: {
      ref: idRef("inventory_month.day", "attribute"),
      identifier: "inventory_month.day"
      /**
       * Display Form Title: Inventory month - Date
       * Display Form ID: inventory_month.day
       */,
      Default: newAttribute("inventory_month.day"),
    }
    /**
     * Date Attribute: Inventory month - Day of Month
     * Date Attribute ID: inventory_month.dayOfMonth
     */,
    InventoryMonthDayOfMonth: {
      ref: idRef("inventory_month.dayOfMonth", "attribute"),
      identifier: "inventory_month.dayOfMonth"
      /**
       * Display Form Title: Inventory month - Day of Month
       * Display Form ID: inventory_month.dayOfMonth
       */,
      Default: newAttribute("inventory_month.dayOfMonth"),
    }
    /**
     * Date Attribute: Inventory month - Day of Week
     * Date Attribute ID: inventory_month.dayOfWeek
     */,
    InventoryMonthDayOfWeek: {
      ref: idRef("inventory_month.dayOfWeek", "attribute"),
      identifier: "inventory_month.dayOfWeek"
      /**
       * Display Form Title: Inventory month - Day of Week
       * Display Form ID: inventory_month.dayOfWeek
       */,
      Default: newAttribute("inventory_month.dayOfWeek"),
    }
    /**
     * Date Attribute: Inventory month - Day of Year
     * Date Attribute ID: inventory_month.dayOfYear
     */,
    InventoryMonthDayOfYear: {
      ref: idRef("inventory_month.dayOfYear", "attribute"),
      identifier: "inventory_month.dayOfYear"
      /**
       * Display Form Title: Inventory month - Day of Year
       * Display Form ID: inventory_month.dayOfYear
       */,
      Default: newAttribute("inventory_month.dayOfYear"),
    }
    /**
     * Date Attribute: Inventory month - Hour
     * Date Attribute ID: inventory_month.hour
     */,
    InventoryMonthHour: {
      ref: idRef("inventory_month.hour", "attribute"),
      identifier: "inventory_month.hour"
      /**
       * Display Form Title: Inventory month - Hour
       * Display Form ID: inventory_month.hour
       */,
      Default: newAttribute("inventory_month.hour"),
    }
    /**
     * Date Attribute: Inventory month - Hour of Day
     * Date Attribute ID: inventory_month.hourOfDay
     */,
    InventoryMonthHourOfDay: {
      ref: idRef("inventory_month.hourOfDay", "attribute"),
      identifier: "inventory_month.hourOfDay"
      /**
       * Display Form Title: Inventory month - Hour of Day
       * Display Form ID: inventory_month.hourOfDay
       */,
      Default: newAttribute("inventory_month.hourOfDay"),
    }
    /**
     * Date Attribute: Inventory month - Minute
     * Date Attribute ID: inventory_month.minute
     */,
    InventoryMonthMinute: {
      ref: idRef("inventory_month.minute", "attribute"),
      identifier: "inventory_month.minute"
      /**
       * Display Form Title: Inventory month - Minute
       * Display Form ID: inventory_month.minute
       */,
      Default: newAttribute("inventory_month.minute"),
    }
    /**
     * Date Attribute: Inventory month - Minute of Hour
     * Date Attribute ID: inventory_month.minuteOfHour
     */,
    InventoryMonthMinuteOfHour: {
      ref: idRef("inventory_month.minuteOfHour", "attribute"),
      identifier: "inventory_month.minuteOfHour"
      /**
       * Display Form Title: Inventory month - Minute of Hour
       * Display Form ID: inventory_month.minuteOfHour
       */,
      Default: newAttribute("inventory_month.minuteOfHour"),
    }
    /**
     * Date Attribute: Inventory month - Month/Year
     * Date Attribute ID: inventory_month.month
     */,
    InventoryMonthMonthYear: {
      ref: idRef("inventory_month.month", "attribute"),
      identifier: "inventory_month.month"
      /**
       * Display Form Title: Inventory month - Month/Year
       * Display Form ID: inventory_month.month
       */,
      Default: newAttribute("inventory_month.month"),
    }
    /**
     * Date Attribute: Inventory month - Month of Year
     * Date Attribute ID: inventory_month.monthOfYear
     */,
    InventoryMonthMonthOfYear: {
      ref: idRef("inventory_month.monthOfYear", "attribute"),
      identifier: "inventory_month.monthOfYear"
      /**
       * Display Form Title: Inventory month - Month of Year
       * Display Form ID: inventory_month.monthOfYear
       */,
      Default: newAttribute("inventory_month.monthOfYear"),
    }
    /**
     * Date Attribute: Inventory month - Quarter/Year
     * Date Attribute ID: inventory_month.quarter
     */,
    InventoryMonthQuarterYear: {
      ref: idRef("inventory_month.quarter", "attribute"),
      identifier: "inventory_month.quarter"
      /**
       * Display Form Title: Inventory month - Quarter/Year
       * Display Form ID: inventory_month.quarter
       */,
      Default: newAttribute("inventory_month.quarter"),
    }
    /**
     * Date Attribute: Inventory month - Quarter of Year
     * Date Attribute ID: inventory_month.quarterOfYear
     */,
    InventoryMonthQuarterOfYear: {
      ref: idRef("inventory_month.quarterOfYear", "attribute"),
      identifier: "inventory_month.quarterOfYear"
      /**
       * Display Form Title: Inventory month - Quarter of Year
       * Display Form ID: inventory_month.quarterOfYear
       */,
      Default: newAttribute("inventory_month.quarterOfYear"),
    }
    /**
     * Date Attribute: Inventory month - Week/Year
     * Date Attribute ID: inventory_month.week
     */,
    InventoryMonthWeekYear: {
      ref: idRef("inventory_month.week", "attribute"),
      identifier: "inventory_month.week"
      /**
       * Display Form Title: Inventory month - Week/Year
       * Display Form ID: inventory_month.week
       */,
      Default: newAttribute("inventory_month.week"),
    }
    /**
     * Date Attribute: Inventory month - Week of Year
     * Date Attribute ID: inventory_month.weekOfYear
     */,
    InventoryMonthWeekOfYear: {
      ref: idRef("inventory_month.weekOfYear", "attribute"),
      identifier: "inventory_month.weekOfYear"
      /**
       * Display Form Title: Inventory month - Week of Year
       * Display Form ID: inventory_month.weekOfYear
       */,
      Default: newAttribute("inventory_month.weekOfYear"),
    }
    /**
     * Date Attribute: Inventory month - Year
     * Date Attribute ID: inventory_month.year
     */,
    InventoryMonthYear: {
      ref: idRef("inventory_month.year", "attribute"),
      identifier: "inventory_month.year"
      /**
       * Display Form Title: Inventory month - Year
       * Display Form ID: inventory_month.year
       */,
      Default: newAttribute("inventory_month.year"),
    },
  }
  /**
   * Date Data Set Title: Order date
   * Date Data Set ID: order_date
   */,
  OrderDate: {
    ref: idRef("order_date", "dataSet"),
    identifier: "order_date"
    /**
     * Date Attribute: Order date - Date
     * Date Attribute ID: order_date.day
     */,
    OrderDateDate: {
      ref: idRef("order_date.day", "attribute"),
      identifier: "order_date.day"
      /**
       * Display Form Title: Order date - Date
       * Display Form ID: order_date.day
       */,
      Default: newAttribute("order_date.day"),
    }
    /**
     * Date Attribute: Order date - Day of Month
     * Date Attribute ID: order_date.dayOfMonth
     */,
    OrderDateDayOfMonth: {
      ref: idRef("order_date.dayOfMonth", "attribute"),
      identifier: "order_date.dayOfMonth"
      /**
       * Display Form Title: Order date - Day of Month
       * Display Form ID: order_date.dayOfMonth
       */,
      Default: newAttribute("order_date.dayOfMonth"),
    }
    /**
     * Date Attribute: Order date - Day of Week
     * Date Attribute ID: order_date.dayOfWeek
     */,
    OrderDateDayOfWeek: {
      ref: idRef("order_date.dayOfWeek", "attribute"),
      identifier: "order_date.dayOfWeek"
      /**
       * Display Form Title: Order date - Day of Week
       * Display Form ID: order_date.dayOfWeek
       */,
      Default: newAttribute("order_date.dayOfWeek"),
    }
    /**
     * Date Attribute: Order date - Day of Year
     * Date Attribute ID: order_date.dayOfYear
     */,
    OrderDateDayOfYear: {
      ref: idRef("order_date.dayOfYear", "attribute"),
      identifier: "order_date.dayOfYear"
      /**
       * Display Form Title: Order date - Day of Year
       * Display Form ID: order_date.dayOfYear
       */,
      Default: newAttribute("order_date.dayOfYear"),
    }
    /**
     * Date Attribute: Order date - Hour
     * Date Attribute ID: order_date.hour
     */,
    OrderDateHour: {
      ref: idRef("order_date.hour", "attribute"),
      identifier: "order_date.hour"
      /**
       * Display Form Title: Order date - Hour
       * Display Form ID: order_date.hour
       */,
      Default: newAttribute("order_date.hour"),
    }
    /**
     * Date Attribute: Order date - Hour of Day
     * Date Attribute ID: order_date.hourOfDay
     */,
    OrderDateHourOfDay: {
      ref: idRef("order_date.hourOfDay", "attribute"),
      identifier: "order_date.hourOfDay"
      /**
       * Display Form Title: Order date - Hour of Day
       * Display Form ID: order_date.hourOfDay
       */,
      Default: newAttribute("order_date.hourOfDay"),
    }
    /**
     * Date Attribute: Order date - Minute
     * Date Attribute ID: order_date.minute
     */,
    OrderDateMinute: {
      ref: idRef("order_date.minute", "attribute"),
      identifier: "order_date.minute"
      /**
       * Display Form Title: Order date - Minute
       * Display Form ID: order_date.minute
       */,
      Default: newAttribute("order_date.minute"),
    }
    /**
     * Date Attribute: Order date - Minute of Hour
     * Date Attribute ID: order_date.minuteOfHour
     */,
    OrderDateMinuteOfHour: {
      ref: idRef("order_date.minuteOfHour", "attribute"),
      identifier: "order_date.minuteOfHour"
      /**
       * Display Form Title: Order date - Minute of Hour
       * Display Form ID: order_date.minuteOfHour
       */,
      Default: newAttribute("order_date.minuteOfHour"),
    }
    /**
     * Date Attribute: Order date - Month/Year
     * Date Attribute ID: order_date.month
     */,
    OrderDateMonthYear: {
      ref: idRef("order_date.month", "attribute"),
      identifier: "order_date.month"
      /**
       * Display Form Title: Order date - Month/Year
       * Display Form ID: order_date.month
       */,
      Default: newAttribute("order_date.month"),
    }
    /**
     * Date Attribute: Order date - Month of Year
     * Date Attribute ID: order_date.monthOfYear
     */,
    OrderDateMonthOfYear: {
      ref: idRef("order_date.monthOfYear", "attribute"),
      identifier: "order_date.monthOfYear"
      /**
       * Display Form Title: Order date - Month of Year
       * Display Form ID: order_date.monthOfYear
       */,
      Default: newAttribute("order_date.monthOfYear"),
    }
    /**
     * Date Attribute: Order date - Quarter/Year
     * Date Attribute ID: order_date.quarter
     */,
    OrderDateQuarterYear: {
      ref: idRef("order_date.quarter", "attribute"),
      identifier: "order_date.quarter"
      /**
       * Display Form Title: Order date - Quarter/Year
       * Display Form ID: order_date.quarter
       */,
      Default: newAttribute("order_date.quarter"),
    }
    /**
     * Date Attribute: Order date - Quarter of Year
     * Date Attribute ID: order_date.quarterOfYear
     */,
    OrderDateQuarterOfYear: {
      ref: idRef("order_date.quarterOfYear", "attribute"),
      identifier: "order_date.quarterOfYear"
      /**
       * Display Form Title: Order date - Quarter of Year
       * Display Form ID: order_date.quarterOfYear
       */,
      Default: newAttribute("order_date.quarterOfYear"),
    }
    /**
     * Date Attribute: Order date - Week/Year
     * Date Attribute ID: order_date.week
     */,
    OrderDateWeekYear: {
      ref: idRef("order_date.week", "attribute"),
      identifier: "order_date.week"
      /**
       * Display Form Title: Order date - Week/Year
       * Display Form ID: order_date.week
       */,
      Default: newAttribute("order_date.week"),
    }
    /**
     * Date Attribute: Order date - Week of Year
     * Date Attribute ID: order_date.weekOfYear
     */,
    OrderDateWeekOfYear: {
      ref: idRef("order_date.weekOfYear", "attribute"),
      identifier: "order_date.weekOfYear"
      /**
       * Display Form Title: Order date - Week of Year
       * Display Form ID: order_date.weekOfYear
       */,
      Default: newAttribute("order_date.weekOfYear"),
    }
    /**
     * Date Attribute: Order date - Year
     * Date Attribute ID: order_date.year
     */,
    OrderDateYear: {
      ref: idRef("order_date.year", "attribute"),
      identifier: "order_date.year"
      /**
       * Display Form Title: Order date - Year
       * Display Form ID: order_date.year
       */,
      Default: newAttribute("order_date.year"),
    },
  }
  /**
   * Date Data Set Title: Return date
   * Date Data Set ID: return_date
   */,
  ReturnDate: {
    ref: idRef("return_date", "dataSet"),
    identifier: "return_date"
    /**
     * Date Attribute: Return date - Date
     * Date Attribute ID: return_date.day
     */,
    ReturnDateDate: {
      ref: idRef("return_date.day", "attribute"),
      identifier: "return_date.day"
      /**
       * Display Form Title: Return date - Date
       * Display Form ID: return_date.day
       */,
      Default: newAttribute("return_date.day"),
    }
    /**
     * Date Attribute: Return date - Day of Month
     * Date Attribute ID: return_date.dayOfMonth
     */,
    ReturnDateDayOfMonth: {
      ref: idRef("return_date.dayOfMonth", "attribute"),
      identifier: "return_date.dayOfMonth"
      /**
       * Display Form Title: Return date - Day of Month
       * Display Form ID: return_date.dayOfMonth
       */,
      Default: newAttribute("return_date.dayOfMonth"),
    }
    /**
     * Date Attribute: Return date - Day of Week
     * Date Attribute ID: return_date.dayOfWeek
     */,
    ReturnDateDayOfWeek: {
      ref: idRef("return_date.dayOfWeek", "attribute"),
      identifier: "return_date.dayOfWeek"
      /**
       * Display Form Title: Return date - Day of Week
       * Display Form ID: return_date.dayOfWeek
       */,
      Default: newAttribute("return_date.dayOfWeek"),
    }
    /**
     * Date Attribute: Return date - Day of Year
     * Date Attribute ID: return_date.dayOfYear
     */,
    ReturnDateDayOfYear: {
      ref: idRef("return_date.dayOfYear", "attribute"),
      identifier: "return_date.dayOfYear"
      /**
       * Display Form Title: Return date - Day of Year
       * Display Form ID: return_date.dayOfYear
       */,
      Default: newAttribute("return_date.dayOfYear"),
    }
    /**
     * Date Attribute: Return date - Hour
     * Date Attribute ID: return_date.hour
     */,
    ReturnDateHour: {
      ref: idRef("return_date.hour", "attribute"),
      identifier: "return_date.hour"
      /**
       * Display Form Title: Return date - Hour
       * Display Form ID: return_date.hour
       */,
      Default: newAttribute("return_date.hour"),
    }
    /**
     * Date Attribute: Return date - Hour of Day
     * Date Attribute ID: return_date.hourOfDay
     */,
    ReturnDateHourOfDay: {
      ref: idRef("return_date.hourOfDay", "attribute"),
      identifier: "return_date.hourOfDay"
      /**
       * Display Form Title: Return date - Hour of Day
       * Display Form ID: return_date.hourOfDay
       */,
      Default: newAttribute("return_date.hourOfDay"),
    }
    /**
     * Date Attribute: Return date - Minute
     * Date Attribute ID: return_date.minute
     */,
    ReturnDateMinute: {
      ref: idRef("return_date.minute", "attribute"),
      identifier: "return_date.minute"
      /**
       * Display Form Title: Return date - Minute
       * Display Form ID: return_date.minute
       */,
      Default: newAttribute("return_date.minute"),
    }
    /**
     * Date Attribute: Return date - Minute of Hour
     * Date Attribute ID: return_date.minuteOfHour
     */,
    ReturnDateMinuteOfHour: {
      ref: idRef("return_date.minuteOfHour", "attribute"),
      identifier: "return_date.minuteOfHour"
      /**
       * Display Form Title: Return date - Minute of Hour
       * Display Form ID: return_date.minuteOfHour
       */,
      Default: newAttribute("return_date.minuteOfHour"),
    }
    /**
     * Date Attribute: Return date - Month/Year
     * Date Attribute ID: return_date.month
     */,
    ReturnDateMonthYear: {
      ref: idRef("return_date.month", "attribute"),
      identifier: "return_date.month"
      /**
       * Display Form Title: Return date - Month/Year
       * Display Form ID: return_date.month
       */,
      Default: newAttribute("return_date.month"),
    }
    /**
     * Date Attribute: Return date - Month of Year
     * Date Attribute ID: return_date.monthOfYear
     */,
    ReturnDateMonthOfYear: {
      ref: idRef("return_date.monthOfYear", "attribute"),
      identifier: "return_date.monthOfYear"
      /**
       * Display Form Title: Return date - Month of Year
       * Display Form ID: return_date.monthOfYear
       */,
      Default: newAttribute("return_date.monthOfYear"),
    }
    /**
     * Date Attribute: Return date - Quarter/Year
     * Date Attribute ID: return_date.quarter
     */,
    ReturnDateQuarterYear: {
      ref: idRef("return_date.quarter", "attribute"),
      identifier: "return_date.quarter"
      /**
       * Display Form Title: Return date - Quarter/Year
       * Display Form ID: return_date.quarter
       */,
      Default: newAttribute("return_date.quarter"),
    }
    /**
     * Date Attribute: Return date - Quarter of Year
     * Date Attribute ID: return_date.quarterOfYear
     */,
    ReturnDateQuarterOfYear: {
      ref: idRef("return_date.quarterOfYear", "attribute"),
      identifier: "return_date.quarterOfYear"
      /**
       * Display Form Title: Return date - Quarter of Year
       * Display Form ID: return_date.quarterOfYear
       */,
      Default: newAttribute("return_date.quarterOfYear"),
    }
    /**
     * Date Attribute: Return date - Week/Year
     * Date Attribute ID: return_date.week
     */,
    ReturnDateWeekYear: {
      ref: idRef("return_date.week", "attribute"),
      identifier: "return_date.week"
      /**
       * Display Form Title: Return date - Week/Year
       * Display Form ID: return_date.week
       */,
      Default: newAttribute("return_date.week"),
    }
    /**
     * Date Attribute: Return date - Week of Year
     * Date Attribute ID: return_date.weekOfYear
     */,
    ReturnDateWeekOfYear: {
      ref: idRef("return_date.weekOfYear", "attribute"),
      identifier: "return_date.weekOfYear"
      /**
       * Display Form Title: Return date - Week of Year
       * Display Form ID: return_date.weekOfYear
       */,
      Default: newAttribute("return_date.weekOfYear"),
    }
    /**
     * Date Attribute: Return date - Year
     * Date Attribute ID: return_date.year
     */,
    ReturnDateYear: {
      ref: idRef("return_date.year", "attribute"),
      identifier: "return_date.year"
      /**
       * Display Form Title: Return date - Year
       * Display Form ID: return_date.year
       */,
      Default: newAttribute("return_date.year"),
    },
  },
};
export const Insights = {
  /**
   * Insight Title: Gross Profit Margin
   * Insight ID: 03b89e08-ee06-4e1f-88d8-bbd805c691cc
   */
  GrossProfitMargin_1: "03b89e08-ee06-4e1f-88d8-bbd805c691cc"
  /**
   * Insight Title: Active Customers by Country
   * Insight ID: 03c5c0f3-f513-4444-b2b4-267236d88ca1
   */,
  ActiveCustomersByCountry: "03c5c0f3-f513-4444-b2b4-267236d88ca1"
  /**
   * Insight Title: Sales Performance by Product Category Over Time
   * Insight ID: 09a05f3f-d0cd-423a-8844-eba4ba7ca0c4
   */,
  SalesPerformanceByProductCategoryOverTime:
    "09a05f3f-d0cd-423a-8844-eba4ba7ca0c4"
  /**
   * Insight Title: From Search to Sale: Active Customers vs. Orders Placed
   * Insight ID: 0b245f1d-aad7-4089-aaf4-a15e25695e7c
   */,
  FromSearchToSaleActiveCustomersVsOrdersPlaced:
    "0b245f1d-aad7-4089-aaf4-a15e25695e7c"
  /**
   * Insight Title: Top 5 States by Number of Orders
   * Insight ID: 0becb676-5ad6-4d6e-bac4-391536bc7a13
   */,
  Top5StatesByNumberOfOrders: "0becb676-5ad6-4d6e-bac4-391536bc7a13"
  /**
   * Insight Title: Average Sales per Customer
   * Insight ID: 0c7ac154-1766-4d54-ba2b-b6f6913a59dd
   */,
  AverageSalesPerCustomer: "0c7ac154-1766-4d54-ba2b-b6f6913a59dd"
  /**
   * Insight Title: Sales Conversion Rate by Order Status
   * Insight ID: 0f9b8f28-7335-40c5-922f-8a55d00358fe
   */,
  SalesConversionRateByOrderStatus: "0f9b8f28-7335-40c5-922f-8a55d00358fe"
  /**
   * Insight Title: Product Details
   * Insight ID: 1072a9a6-bd90-4af9-ae0f-cd3d41a8db78
   */,
  ProductDetails: "1072a9a6-bd90-4af9-ae0f-cd3d41a8db78"
  /**
   * Insight Title: Product Preferences by Customers
   * Insight ID: 11dabf39-fcbd-4429-8eee-50bd56da5d8b
   */,
  ProductPreferencesByCustomers: "11dabf39-fcbd-4429-8eee-50bd56da5d8b"
  /**
   * Insight Title: Active Customers & Placed Orders by Location
   * Insight ID: 12b824f3-c529-4f2b-97ea-be2a09537768
   */,
  ActiveCustomersAndPlacedOrdersByLocation:
    "12b824f3-c529-4f2b-97ea-be2a09537768"
  /**
   * Insight Title: Order Details
   * Insight ID: 1b9ce816-a4f9-4301-bdfd-d36c6a7a71b6
   */,
  OrderDetails: "1b9ce816-a4f9-4301-bdfd-d36c6a7a71b6"
  /**
   * Insight Title: Product Performance by Orders & Returns
   * Insight ID: 1c0441a9-f0b1-4683-890e-225cf130b8ec
   */,
  ProductPerformanceByOrdersAndReturns: "1c0441a9-f0b1-4683-890e-225cf130b8ec"
  /**
   * Insight Title: Bottom 10 Customers by Revenue
   * Insight ID: 2168550d-8146-472e-9654-db2e08e65a9c
   */,
  Bottom10CustomersByRevenue: "2168550d-8146-472e-9654-db2e08e65a9c"
  /**
   * Insight Title: Profitability Overview
   * Insight ID: 21976049-e470-4e72-a819-a40e8b158911
   */,
  ProfitabilityOverview: "21976049-e470-4e72-a819-a40e8b158911"
  /**
   * Insight Title: Discount Rate by Product Category
   * Insight ID: 23669d9c-091c-4e0f-8412-34d7a8a2fa49
   */,
  DiscountRateByProductCategory: "23669d9c-091c-4e0f-8412-34d7a8a2fa49"
  /**
   * Insight Title: Sales to Net Revenue Breakdown
   * Insight ID: 23a5b515-1b04-4940-bce5-3eeccfda0f83
   */,
  SalesToNetRevenueBreakdown: "23a5b515-1b04-4940-bce5-3eeccfda0f83"
  /**
   * Insight Title: Brand Performance Segments: Sales vs. Orders
   * Insight ID: 2486eb48-0d07-46e6-bc41-0e5ff102dcc8
   */,
  BrandPerformanceSegmentsSalesVsOrders: "2486eb48-0d07-46e6-bc41-0e5ff102dcc8"
  /**
   * Insight Title: Total Sales Over Time
   * Insight ID: 25bdccd8-ef39-40a5-a224-6031d0ab470c
   */,
  TotalSalesOverTime: "25bdccd8-ef39-40a5-a224-6031d0ab470c"
  /**
   * Insight Title: Product Ratings vs. Target
   * Insight ID: 27408dd0-16f9-4069-8562-268f99b9d626
   */,
  ProductRatingsVsTarget: "27408dd0-16f9-4069-8562-268f99b9d626"
  /**
   * Insight Title: Cost vs. Selling Price Correlation in Details
   * Insight ID: 2bd76854-1d97-4b19-b5cf-babce30f6b6b
   */,
  CostVsSellingPriceCorrelationInDetails:
    "2bd76854-1d97-4b19-b5cf-babce30f6b6b"
  /**
   * Insight Title: Brand Performance: Net Sales vs. Orders
   * Insight ID: 2da13424-2a6b-4ed4-916c-9bbc002fdd1b
   */,
  BrandPerformanceNetSalesVsOrders: "2da13424-2a6b-4ed4-916c-9bbc002fdd1b"
  /**
   * Insight Title: Customers by Country and State
   * Insight ID: 2f12ace7-e626-47f1-953d-5ae957ca108e
   */,
  CustomersByCountryAndState: "2f12ace7-e626-47f1-953d-5ae957ca108e"
  /**
   * Insight Title: Total Sales vs Inventory Turnover Rate Over Time
   * Insight ID: 315e1b40-75cb-46e1-a59e-51b57829d786
   */,
  TotalSalesVsInventoryTurnoverRateOverTime:
    "315e1b40-75cb-46e1-a59e-51b57829d786"
  /**
   * Insight Title: Sales Trend
   * Insight ID: 34464ff6-a852-4585-bca8-c59514c23861
   */,
  SalesTrend: "34464ff6-a852-4585-bca8-c59514c23861"
  /**
   * Insight Title: Active Customers by Location
   * Insight ID: 3895bb55-4ddf-4d7e-96ed-7178009fd34e
   */,
  ActiveCustomersByLocation: "3895bb55-4ddf-4d7e-96ed-7178009fd34e"
  /**
   * Insight Title: Orders Processed
   * Insight ID: 3ac5e106-b43e-4c87-9ef0-9315e02282bd
   */,
  OrdersProcessed: "3ac5e106-b43e-4c87-9ef0-9315e02282bd"
  /**
   * Insight Title: Revenue Trend Over Time
   * Insight ID: 3e16ebe3-7753-40c6-abc1-f549e7bf4d6c
   */,
  RevenueTrendOverTime: "3e16ebe3-7753-40c6-abc1-f549e7bf4d6c"
  /**
   * Insight Title: Brand Profitability by Price and Order Volume
   * Insight ID: 405034d6-ab9c-462a-a88e-3172598adc65
   */,
  BrandProfitabilityByPriceAndOrderVolume:
    "405034d6-ab9c-462a-a88e-3172598adc65"
  /**
   * Insight Title: Total Sales Breakdown
   * Insight ID: 41a8d4c3-1ab6-4bab-b531-5893912e9b93
   */,
  TotalSalesBreakdown: "41a8d4c3-1ab6-4bab-b531-5893912e9b93"
  /**
   * Insight Title: Sales Details
   * Insight ID: 469e8936-ca67-4987-8c70-0e35be24be4d
   */,
  SalesDetails: "469e8936-ca67-4987-8c70-0e35be24be4d"
  /**
   * Insight Title: Check
   * Insight ID: 46ceabb7-06c1-4549-bbf7-af5afac7c6ed
   */,
  Check: "46ceabb7-06c1-4549-bbf7-af5afac7c6ed"
  /**
   * Insight Title: Nice overview
   * Insight ID: 4782d807-fa6e-4c70-bc6b-000823ca9d60
   */,
  NiceOverview: "4782d807-fa6e-4c70-bc6b-000823ca9d60"
  /**
   * Insight Title: New vs. Returning Customers
   * Insight ID: 48000537-4586-4a1e-a9a5-8eda7f8151a8
   */,
  NewVsReturningCustomers: "48000537-4586-4a1e-a9a5-8eda7f8151a8"
  /**
   * Insight Title: Returning Customers
   * Insight ID: 4cea4177-37c5-4196-8aab-c6bf60dc1f22
   */,
  ReturningCustomers_1: "4cea4177-37c5-4196-8aab-c6bf60dc1f22"
  /**
   * Insight Title: Product-Level Profitability Breakdown
   * Insight ID: 5297352c-7fd3-4e7e-90ad-026e470f55bd
   */,
  ProductLevelProfitabilityBreakdown: "5297352c-7fd3-4e7e-90ad-026e470f55bd"
  /**
   * Insight Title: Customer Orders and Sales Details
   * Insight ID: 543cadbb-10b4-4153-b810-52586df7aa0e
   */,
  CustomerOrdersAndSalesDetails: "543cadbb-10b4-4153-b810-52586df7aa0e"
  /**
   * Insight Title: Active Customers by State
   * Insight ID: 544ee04b-7fcc-41a3-8323-852de0613815
   */,
  ActiveCustomersByState: "544ee04b-7fcc-41a3-8323-852de0613815"
  /**
   * Insight Title: Overall Revenue Forecast
   * Insight ID: 5afcc5f4-85a5-43cf-b4d4-d244c694b316
   */,
  OverallRevenueForecast: "5afcc5f4-85a5-43cf-b4d4-d244c694b316"
  /**
   * Insight Title: Top Sold Products
   * Insight ID: 603bbd58-ea50-4607-ad20-418bd95c06c8
   */,
  TopSoldProducts: "603bbd58-ea50-4607-ad20-418bd95c06c8"
  /**
   * Insight Title: Top 10 Customers by Revenue
   * Insight ID: 607e9724-37ed-44f6-9fb4-55676d58df6e
   */,
  Top10CustomersByRevenue: "607e9724-37ed-44f6-9fb4-55676d58df6e"
  /**
   * Insight Title: Total Net Sales: Current vs. Last Year
   * Insight ID: 60dd3592-1322-4260-aaad-bd51cdcb1343
   */,
  TotalNetSalesCurrentVsLastYear: "60dd3592-1322-4260-aaad-bd51cdcb1343"
  /**
   * Insight Title: Orders by Product Category and Brand
   * Insight ID: 641cff4d-e46d-4fdb-8070-ffa5d6affa2f
   */,
  OrdersByProductCategoryAndBrand: "641cff4d-e46d-4fdb-8070-ffa5d6affa2f"
  /**
   * Insight Title: Total Sales Breakdown
   * Insight ID: 643699f3-f980-44f6-b618-4b3d3f3f560e
   */,
  TotalSalesBreakdown_1: "643699f3-f980-44f6-b618-4b3d3f3f560e"
  /**
   * Insight Title: Product Details by Product Categories & Brands
   * Insight ID: 65120fa4-2805-4f70-b576-01d138117cf4
   */,
  ProductDetailsByProductCategoriesAndBrands:
    "65120fa4-2805-4f70-b576-01d138117cf4"
  /**
   * Insight Title: Net Sales Goal
   * Insight ID: 68ddf963-edce-4f88-a8d5-09bf3825b124
   */,
  NetSalesGoal_1: "68ddf963-edce-4f88-a8d5-09bf3825b124"
  /**
   * Insight Title: Product Performance Trends
   * Insight ID: 6a23110a-8d0d-4385-99aa-9b829f735314
   */,
  ProductPerformanceTrends: "6a23110a-8d0d-4385-99aa-9b829f735314"
  /**
   * Insight Title: Customer Lifetime Value (CLV) vs. Purchase Frequency
   * Insight ID: 6c1de2b0-0165-4b3f-8b2b-9122f8f24393
   */,
  CustomerLifetimeValueCLVVsPurchaseFrequency:
    "6c1de2b0-0165-4b3f-8b2b-9122f8f24393"
  /**
   * Insight Title: Net Sales by Product Category
   * Insight ID: 6e336114-d0b6-4287-acc4-be6e39e13e30
   */,
  NetSalesByProductCategory: "6e336114-d0b6-4287-acc4-be6e39e13e30"
  /**
   * Insight Title: Net Sales
   * Insight ID: 700d732d-67e1-4658-a6e0-c6b8edbb6d49
   */,
  NetSales: "700d732d-67e1-4658-a6e0-c6b8edbb6d49"
  /**
   * Insight Title: Order Volume Over Time
   * Insight ID: 70d8d521-22ff-468f-924f-4a81a28227c1
   */,
  OrderVolumeOverTime: "70d8d521-22ff-468f-924f-4a81a28227c1"
  /**
   * Insight Title: Top Products by Gross Profit
   * Insight ID: 7b49dbdb-f9ab-41dd-9cb4-cd13627d67c3
   */,
  TopProductsByGrossProfit: "7b49dbdb-f9ab-41dd-9cb4-cd13627d67c3"
  /**
   * Insight Title: Customers Breakdown
   * Insight ID: 7de6202d-2e52-4bed-9e80-6c3ce8cedaaa
   */,
  CustomersBreakdown: "7de6202d-2e52-4bed-9e80-6c3ce8cedaaa"
  /**
   * Insight Title: Customer Retention Rate
   * Insight ID: 8a4f1df3-ca83-4e40-aad3-63b72bbfaa77
   */,
  CustomerRetentionRate_1: "8a4f1df3-ca83-4e40-aad3-63b72bbfaa77"
  /**
   * Insight Title: Bottom 10 Customers by Revenue (Details)
   * Insight ID: 8db91a42-5cd3-4b95-a224-221ac17732d8
   */,
  Bottom10CustomersByRevenueDetails: "8db91a42-5cd3-4b95-a224-221ac17732d8"
  /**
   * Insight Title: Top 10 Purchasing Customers
   * Insight ID: 8e8f236e-1bb2-48b3-828e-48706c684629
   */,
  Top10PurchasingCustomers: "8e8f236e-1bb2-48b3-828e-48706c684629"
  /**
   * Insight Title: Orders by Customer City
   * Insight ID: 8eec84f3-88f7-42d7-9472-da144be7f2c4
   */,
  OrdersByCustomerCity: "8eec84f3-88f7-42d7-9472-da144be7f2c4"
  /**
   * Insight Title: Gross Profit Trend
   * Insight ID: 9570eab0-b451-48be-9e24-3c106fe898a2
   */,
  GrossProfitTrend: "9570eab0-b451-48be-9e24-3c106fe898a2"
  /**
   * Insight Title: Gross Profit by Product Category
   * Insight ID: 9a254b09-91f2-4d36-bc40-bd51d9006a06
   */,
  GrossProfitByProductCategory: "9a254b09-91f2-4d36-bc40-bd51d9006a06"
  /**
   * Insight Title: Top 10 Customers by Revenue (Details)
   * Insight ID: 9bd57223-2ba5-404b-af62-d5b6a418629a
   */,
  Top10CustomersByRevenueDetails: "9bd57223-2ba5-404b-af62-d5b6a418629a"
  /**
   * Insight Title: Price Elasticity by Product Brand
   * Insight ID: 9cc379ca-2d55-4f82-aa5e-e256d7e3580d
   */,
  PriceElasticityByProductBrand: "9cc379ca-2d55-4f82-aa5e-e256d7e3580d"
  /**
   * Insight Title: Sales, Returns & Discounts Over Time
   * Insight ID: a178265c-53ba-4c15-8c1f-d7e168506c92
   */,
  SalesReturnsAndDiscountsOverTime: "a178265c-53ba-4c15-8c1f-d7e168506c92"
  /**
   * Insight Title: Orders by Status Over Time
   * Insight ID: a2b50fff-c7eb-444c-95e6-67037d2544d6
   */,
  OrdersByStatusOverTime: "a2b50fff-c7eb-444c-95e6-67037d2544d6"
  /**
   * Insight Title: Active Customers
   * Insight ID: a347814a-a893-4354-915d-29699b92a6d7
   */,
  ActiveCustomers_1: "a347814a-a893-4354-915d-29699b92a6d7"
  /**
   * Insight Title: Orders by Product Category
   * Insight ID: a63c7679-e577-4e40-9b17-0628eb6ed7e1
   */,
  OrdersByProductCategory: "a63c7679-e577-4e40-9b17-0628eb6ed7e1"
  /**
   * Insight Title: Top 10 States
   * Insight ID: ac004949-ad4d-4678-b03a-2756e3d6a4e3
   */,
  Top10States: "ac004949-ad4d-4678-b03a-2756e3d6a4e3"
  /**
   * Insight Title: Total Sales
   * Insight ID: adf2b786-32bd-4864-b251-7e2cfe9a006f
   */,
  TotalSales_1: "adf2b786-32bd-4864-b251-7e2cfe9a006f"
  /**
   * Insight Title: Order Value by Category and Customer Rating
   * Insight ID: b0c48f40-b8e0-4434-9258-bbd261d6bd34
   */,
  OrderValueByCategoryAndCustomerRating: "b0c48f40-b8e0-4434-9258-bbd261d6bd34"
  /**
   * Insight Title: Order Status Breakdown
   * Insight ID: b4497110-8d8a-4ab3-9cd5-471b60d8e561
   */,
  OrderStatusBreakdown: "b4497110-8d8a-4ab3-9cd5-471b60d8e561"
  /**
   * Insight Title: Gross Profit
   * Insight ID: b666412b-3c13-4e80-9b3f-7787558aa3ce
   */,
  GrossProfit_1: "b666412b-3c13-4e80-9b3f-7787558aa3ce"
  /**
   * Insight Title: Order Fulfillment Funnel
   * Insight ID: b742a152-cf65-436b-bcdf-4e56ec594841
   */,
  OrderFulfillmentFunnel: "b742a152-cf65-436b-bcdf-4e56ec594841"
  /**
   * Insight Title: Completed vs. Canceled Orders Trend
   * Insight ID: bb5c2581-2da9-49b8-b430-b9c2371c79ff
   */,
  CompletedVsCanceledOrdersTrend: "bb5c2581-2da9-49b8-b430-b9c2371c79ff"
  /**
   * Insight Title: Best-selling Product Brands
   * Insight ID: c4acd66e-db92-4e9b-8146-be79fcd50869
   */,
  BestSellingProductBrands: "c4acd66e-db92-4e9b-8146-be79fcd50869"
  /**
   * Insight Title: Daily profile
   * Insight ID: cbe98a17-9065-4b85-85de-903ed044abc5
   */,
  DailyProfile: "cbe98a17-9065-4b85-85de-903ed044abc5"
  /**
   * Insight Title: Customer Activity by Hour
   * Insight ID: cc858402-0650-444e-947a-1e8dfc888435
   */,
  CustomerActivityByHour: "cc858402-0650-444e-947a-1e8dfc888435"
  /**
   * Insight Title: Average Order Volume per Customer
   * Insight ID: dc8575f5-27e5-44be-a2dc-23d54b7777e7
   */,
  AverageOrderVolumePerCustomer: "dc8575f5-27e5-44be-a2dc-23d54b7777e7"
  /**
   * Insight Title: Revenue Trend Details
   * Insight ID: ddc4be59-1ea8-4b9d-86a2-6f389ae217b9
   */,
  RevenueTrendDetails: "ddc4be59-1ea8-4b9d-86a2-6f389ae217b9"
  /**
   * Insight Title: Net Sales by Product Category
   * Insight ID: e32644ad-1921-4b89-a7d2-79f31826e5cf
   */,
  NetSalesByProductCategory_1: "e32644ad-1921-4b89-a7d2-79f31826e5cf"
  /**
   * Insight Title: Net Sales Share by Top 5 City
   * Insight ID: ea6f316e-2d64-489f-8b37-2f031e8bbbbf
   */,
  NetSalesShareByTop5City: "ea6f316e-2d64-489f-8b37-2f031e8bbbbf"
  /**
   * Insight Title: Sales Conversion Rate (%)
   * Insight ID: ec9b9afa-96f7-439a-8ce2-94735173b98a
   */,
  SalesConversionRatePercent: "ec9b9afa-96f7-439a-8ce2-94735173b98a"
  /**
   * Insight Title: Placed Orders by Hour
   * Insight ID: f1027458-1123-4f4d-af20-0e21b1d5e009
   */,
  PlacedOrdersByHour: "f1027458-1123-4f4d-af20-0e21b1d5e009"
  /**
   * Insight Title: Net Sales Breakdown
   * Insight ID: f52cdf0e-dd0a-40cf-b1dd-e7c25dad2b63
   */,
  NetSalesBreakdown: "f52cdf0e-dd0a-40cf-b1dd-e7c25dad2b63"
  /**
   * Insight Title: Product Pricing Breakdown
   * Insight ID: fd4fb308-50d6-4a61-accc-e0f17039d144
   */,
  ProductPricingBreakdown: "fd4fb308-50d6-4a61-accc-e0f17039d144",
};
export const Dashboards = {
  /**
   * Dashboard Title: ssaddsadsa
   * Dashboard ID: 089d2c78-38eb-4353-915a-5cf299fb1fb8
   */
  Ssaddsadsa: "089d2c78-38eb-4353-915a-5cf299fb1fb8"
  /**
   * Dashboard Title: 1. Overview
   * Dashboard ID: 092929af-375a-4e9c-964f-2add8cdbd259
   */,
  _1Overview: "092929af-375a-4e9c-964f-2add8cdbd259"
  /**
   * Dashboard Title: new new new
   * Dashboard ID: 11f99601-f3a6-469e-9e90-000097fa96d0
   */,
  NewNewNew: "11f99601-f3a6-469e-9e90-000097fa96d0"
  /**
   * Dashboard Title: 3. Customers
   * Dashboard ID: 12fa0ef2-676b-41fb-bb91-9e1936097461
   */,
  _3Customers: "12fa0ef2-676b-41fb-bb91-9e1936097461"
  /**
   * Dashboard Title: qqqqqqqqq
   * Dashboard ID: 5acc234e-b76f-4da1-ae73-8ba75913ad63
   */,
  Qqqqqqqqq: "5acc234e-b76f-4da1-ae73-8ba75913ad63"
  /**
   * Dashboard Title: 123
   * Dashboard ID: 6761e7a3-cb95-493c-940f-74faf65d4cab
   */,
  _123: "6761e7a3-cb95-493c-940f-74faf65d4cab"
  /**
   * Dashboard Title: asdsa
   * Dashboard ID: 891a3a95-6ad3-4e37-a8b1-34874cd70485
   */,
  Asdsa: "891a3a95-6ad3-4e37-a8b1-34874cd70485"
  /**
   * Dashboard Title: new focus
   * Dashboard ID: 8c724b4d-9890-4064-a4d6-86e92b02b524
   */,
  NewFocus: "8c724b4d-9890-4064-a4d6-86e92b02b524"
  /**
   * Dashboard Title: nnnnnnnnnnnnnnnnnnnnn
   * Dashboard ID: aa560dde-9b17-44fd-8001-616d3e5d2783
   */,
  Nnnnnnnnnnnnnnnnnnnnn: "aa560dde-9b17-44fd-8001-616d3e5d2783"
  /**
   * Dashboard Title: qqqwqwqew
   * Dashboard ID: ad097e5b-a4f5-479b-90e2-e12ebfbd5d7b
   */,
  Qqqwqwqew: "ad097e5b-a4f5-479b-90e2-e12ebfbd5d7b"
  /**
   * Dashboard Title: new board created
   * Dashboard ID: ae927d9c-e27b-4151-850a-b037a71aae96
   */,
  NewBoardCreated: "ae927d9c-e27b-4151-850a-b037a71aae96"
  /**
   * Dashboard Title: 2. Sales.
   * Dashboard ID: bf439696-d6c6-4d41-a102-dd98e2f3da35
   */,
  _2Sales: "bf439696-d6c6-4d41-a102-dd98e2f3da35"
  /**
   * Dashboard Title: 4. Products
   * Dashboard ID: c1d67cd4-94ad-40aa-91a5-cdf4143f778a
   */,
  _4Products: "c1d67cd4-94ad-40aa-91a5-cdf4143f778a"
  /**
   * Dashboard Title: asdfdsjfkh
   * Dashboard ID: ec161a0d-e861-42d7-886b-f2ecd628cbf7
   */,
  Asdfdsjfkh: "ec161a0d-e861-42d7-886b-f2ecd628cbf7",
};
