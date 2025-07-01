export interface Product {
    _id: string;          // Unique product ID (usually from the database)
    name: string;         // Product name
    description: string;  // Detailed description of the product
    price: number;        // Product price
    inStock: boolean;     // Indicates if the product is currently in stock
}
