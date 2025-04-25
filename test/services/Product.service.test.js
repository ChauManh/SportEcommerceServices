const Product = require("../../src/models/Product.model");
const Category = require("../../src/models/Category.model");
const productService = require("../../src/services/Product.service");

jest.mock("../../src/models/Product.model");
jest.mock("../../src/models/Category.model");

describe("Product Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test cho createProduct
  it("should create a new product", async () => {
    const newProduct = {
      product_title: "Test Product",
      product_category: "12345",
      product_brand: "BrandX",
      product_img: "test.jpg",
      product_description: "Test Description",
      product_display: true,
      product_famous: false,
      product_rate: 4,
      product_percent_discount: 10,
      colors: [
        {
          color_name: "Red",
          variants: [
            {
              variant_price: 100,
              variant_countInStock: 10
            }
          ]
        }
      ]
    };

    Product.create.mockResolvedValueOnce({ _id: "54321", ...newProduct });

    const result = await productService.createProduct(newProduct);
    // console.log(result)
    expect(result.EC).toBe(0);
    expect(result.data.product_title).toBe("Test Product");
    expect(result.data).toHaveProperty("_id");
  });

  // Test cho updateProduct
  it("should update an existing product", async () => {
    const productId = "54321";
    const updatedProduct = {
      product_title: "Updated Product",
      product_rate: 5,
      colors: [
        {
          color_name: "Blue",
          variants: [
            {
              variant_price: 150,
              variant_countInStock: 20
            }
          ]
        }
      ]
    };

    Product.findById.mockResolvedValueOnce({
      _id: productId,
      product_title: "Old Product",
      product_rate: 4,
      colors: []
    });

    Product.findByIdAndUpdate.mockResolvedValueOnce({
      _id: productId,
      ...updatedProduct
    });

    const result = await productService.updateProduct(productId, updatedProduct);
    expect(result.EC).toBe(0);
    expect(result.data.product_title).toBe("Updated Product");
    expect(result.data.product_rate).toBe(5);
  });

  // Test cho getDetailsProduct
  it("should get product details successfully", async () => {
    const productId = "54321";
    const productData = {
      _id: productId,
      product_title: "Test Product",
      product_category: "12345",
      product_rate: 4,
      product_description: "Test Description"
    };

    Product.findById.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(productData)
      });

    const result = await productService.getDetailsProduct(productId);
    // console.log(result)
    expect(result.EC).toBe(0);
    expect(result.data.product_title).toBe("Test Product");
  });

  // Test cho deleteProduct
  it("should delete a product", async () => {
    const productId = "54321";

    Product.findById.mockResolvedValueOnce({
        _id: productId,
        product_category: { _id: "12345", name: "Test Category" },
        deleteOne: jest.fn().mockResolvedValueOnce({})
      });
      

    
    const result = await productService.deleteProduct(productId);
    console.log(result)
    expect(result.EC).toBe(0);
    expect(result.EM).toBe("Product deleted successfully");
  });

  // Test cho getAllProduct
  it("should get products with filters", async () => {
    const filters = {
      category: "top",
      category_gender: ["men"],
      price_min: 50,
      price_max: 150
    };
  
    const mockCategory = { _id: "cat001", category_type: "top", category_gender: ["men"] };
    const mockSubCategories = [
      { _id: "cat002", category_parent_id: "cat001", category_gender: ["men"] }
    ];
  
    Category.findOne.mockResolvedValueOnce(mockCategory);
    Category.find.mockResolvedValueOnce(mockSubCategories);
  
    const mockProducts = [
      { _id: "p1", product_title: "Product A", product_price: 100 },
      { _id: "p2", product_title: "Product B", product_price: 120 }
    ];
  
    Product.find.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce(mockProducts)
    });
  
    Product.countDocuments.mockResolvedValueOnce(mockProducts.length);
  
    const result = await productService.getAllProduct(filters);
    console.log(result);
  
    expect(result.EC).toBe(0);
    expect(result.data.products.length).toBe(2);
  });
  
  
  
});
