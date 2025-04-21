const productService = require('../../src/services/Product.service');

jest.mock('../../src/services/Product.service'); // Mock toàn bộ service

describe('Product Service with Fully Mocked Functions', () => {
  it('should create a new product', async () => {
    const category = { _id: '12345', category_title: 'Electronics' };

    const newProduct = {
      product_title: 'Test Product',
      product_category: category._id,
      product_description: 'Test Description',
      product_display: true,
      product_famous: true,
      product_rate: 4,
      product_brand: 'Test Brand',
      product_img: 'test.jpg',
      product_percent_discount: 10,
      colors: [
        {
          color_name: 'Red',
          variants: [
            {
              variant_price: 100,
              variant_countInStock: 10,
            },
          ],
        },
      ],
    };

    productService.createProduct.mockResolvedValueOnce({
      EC: 0,
      EM: 'Create new product successfully',
      data: { _id: '54321', ...newProduct },
    });

    const result = await productService.createProduct(newProduct);
    expect(result.EC).toBe(0);
    expect(result.data).toHaveProperty('_id');
    expect(result.data.product_title).toBe('Test Product');
  });

  it('should update an existing product', async () => {
    const productId = '54321';

    const updatedData = {
      product_title: 'Updated Product',
      product_rate: 5,
      colors: [
        {
          color_name: 'Blue',
          variants: [
            {
              variant_price: 150,
              variant_countInStock: 20,
            },
          ],
        },
      ],
    };

    productService.updateProduct.mockResolvedValueOnce({
      EC: 0,
      EM: 'Update product successfully',
      data: { _id: productId, ...updatedData },
    });

    const result = await productService.updateProduct(productId, updatedData);
    expect(result.EC).toBe(0);
    expect(result.data.product_title).toBe('Updated Product');
    expect(result.data.product_rate).toBe(5);
  });

  it('should delete a product', async () => {
    const productId = '54321';

    productService.deleteProduct.mockResolvedValueOnce({
      EC: 0,
      EM: 'Product deleted successfully',
    });

    const result = await productService.deleteProduct(productId);
    expect(result.EC).toBe(0);
    expect(result.EM).toBe('Product deleted successfully');
  });

  it('should get all products with filters', async () => {
    const category = { _id: '12345', category_title: 'Toys' };

    const product1 = {
      _id: '11111',
      product_title: 'Toy Car 1',
      product_category: category._id,
      product_description: 'Toy Car 1 description',
      product_display: true,
      product_famous: true,
      product_rate: 4,
      product_brand: 'ToyCo',
      product_img: 'toycar1.jpg',
      product_percent_discount: 15,
      colors: [],
    };
    const product2 = {
      _id: '22222',
      product_title: 'Toy Car 2',
      product_category: category._id,
      product_description: 'Toy Car 2 description',
      product_display: true,
      product_famous: true,
      product_rate: 5,
      product_brand: 'ToyCo',
      product_img: 'toycar2.jpg',
      product_percent_discount: 10,
      colors: [],
    };

    const filters = { category: category._id };

    productService.getAllProduct.mockResolvedValueOnce({
      EC: 0,
      EM: 'Fetched products successfully',
      data: {
        products: [product1, product2],
        total: 2,
      },
    });

    const result = await productService.getAllProduct(filters);
    expect(result.EC).toBe(0);
    expect(result.data.products.length).toBe(2);
    expect(result.data.total).toBe(2);
  });
});
