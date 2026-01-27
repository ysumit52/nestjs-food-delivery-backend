// ===================================
// File: apps/catalog-service/src/seed.ts
// ===================================

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { MenuItem } from './entities/menu-item.entity';

async function seed() {
  // Create database connection
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5434,
    username: 'postgres',
    password: 'postgres',
    database: 'catalog_db',
    entities: [Category, Restaurant, MenuItem],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('✅ Database connected');

  const categoryRepo = dataSource.getRepository(Category);
  const restaurantRepo = dataSource.getRepository(Restaurant);
  const menuItemRepo = dataSource.getRepository(MenuItem);

  console.log('🌱 Starting seed...');

  // Clear existing data (delete child records first)
  const menuItemCount = await menuItemRepo.count();
  if (menuItemCount > 0) {
    await menuItemRepo.createQueryBuilder().delete().execute();
  }
  
  const categoryCount = await categoryRepo.count();
  if (categoryCount > 0) {
    await categoryRepo.createQueryBuilder().delete().execute();
  }
  
  const restaurantCount = await restaurantRepo.count();
  if (restaurantCount > 0) {
    await restaurantRepo.createQueryBuilder().delete().execute();
  }
  
  console.log('✅ Cleared existing data');

  // Create Categories
  const categories = await categoryRepo.save([
    {
      name: 'Pizza',
      description: 'Delicious pizzas with various toppings',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    },
    {
      name: 'Burgers',
      description: 'Juicy burgers with fresh ingredients',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    },
    {
      name: 'Indian',
      description: 'Authentic Indian cuisine',
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
    },
    {
      name: 'Chinese',
      description: 'Traditional Chinese dishes',
      imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e',
    },
    {
      name: 'Italian',
      description: 'Classic Italian pasta and more',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
    },
    {
      name: 'Mexican',
      description: 'Spicy and flavorful Mexican food',
      imageUrl: 'https://images.unsplash.com/photo-1599974464964-d65e32c2a54c',
    },
    {
      name: 'Desserts',
      description: 'Sweet treats and desserts',
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
    },
    {
      name: 'Beverages',
      description: 'Refreshing drinks and beverages',
      imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e',
    },
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create Restaurants
  const restaurants = await restaurantRepo.save([
    {
      name: "Pizza Paradise",
      address: "123 Main St, Downtown",
      city: "Mumbai",
      phone: "9876543210",
      rating: 4.5,
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    },
    {
      name: "Burger Bistro",
      address: "456 Park Ave, Central",
      city: "Mumbai",
      phone: "9876543211",
      rating: 4.3,
      imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add",
    },
    {
      name: "Spice Route",
      address: "789 Gandhi Road, Bandra",
      city: "Mumbai",
      phone: "9876543212",
      rating: 4.7,
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    },
    {
      name: "Dragon Wok",
      address: "321 Marine Drive, South",
      city: "Mumbai",
      phone: "9876543213",
      rating: 4.4,
      imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    },
    {
      name: "Pasta House",
      address: "654 Link Road, Andheri",
      city: "Mumbai",
      phone: "9876543214",
      rating: 4.6,
      imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    },
  ]);

  console.log(`✅ Created ${restaurants.length} restaurants`);

  // Helper to get category and restaurant by name
  const getCategory = (name: string) => categories.find(c => c.name === name);
  const getRestaurant = (name: string) => restaurants.find(r => r.name === name);

  // Create Menu Items (30+ items)
  const menuItems = await menuItemRepo.save([
    // Pizza Paradise - Pizza Items
    {
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
      price: 299,
      categoryId: getCategory('Pizza').id,
      restaurantId: getRestaurant('Pizza Paradise').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    },
    {
      name: "Pepperoni Pizza",
      description: "Loaded with pepperoni, mozzarella, and Italian herbs",
      price: 399,
      categoryId: getCategory('Pizza').id,
      restaurantId: getRestaurant('Pizza Paradise').id,
      isVegetarian: false,
      imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
    },
    {
      name: "Vegetarian Supreme",
      description: "Bell peppers, onions, mushrooms, olives, and cheese",
      price: 349,
      categoryId: getCategory('Pizza').id,
      restaurantId: getRestaurant('Pizza Paradise').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f",
    },
    {
      name: "BBQ Chicken Pizza",
      description: "Grilled chicken with BBQ sauce and red onions",
      price: 449,
      categoryId: getCategory('Pizza').id,
      restaurantId: getRestaurant('Pizza Paradise').id,
      isVegetarian: false,
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    },

    // Burger Bistro - Burger Items
    {
      name: "Classic Beef Burger",
      description: "Juicy beef patty with lettuce, tomato, and special sauce",
      price: 249,
      categoryId: getCategory('Burgers').id,
      restaurantId: getRestaurant('Burger Bistro').id,
      isVegetarian: false,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    },
    {
      name: "Chicken Burger",
      description: "Crispy chicken fillet with mayo and pickles",
      price: 229,
      categoryId: getCategory('Burgers').id,
      restaurantId: getRestaurant('Burger Bistro').id,
      isVegetarian: false,
      imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086",
    },
    {
      name: "Veggie Burger",
      description: "Plant-based patty with fresh veggies",
      price: 199,
      categoryId: getCategory('Burgers').id,
      restaurantId: getRestaurant('Burger Bistro').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1520072959219-c595dc870360",
    },
    {
      name: "Double Cheese Burger",
      description: "Two beef patties with double cheese",
      price: 349,
      categoryId: getCategory('Burgers').id,
      restaurantId: getRestaurant('Burger Bistro').id,
      isVegetarian: false,
      imageUrl: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9",
    },

    // Spice Route - Indian Items
    {
      name: "Butter Chicken",
      description: "Creamy tomato-based curry with tender chicken",
      price: 329,
      categoryId: getCategory('Indian').id,
      restaurantId: getRestaurant('Spice Route').id,
      isVegetarian: false,
      imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
    },
    {
      name: "Paneer Tikka Masala",
      description: "Grilled cottage cheese in rich masala gravy",
      price: 299,
      categoryId: getCategory('Indian').id,
      restaurantId: getRestaurant('Spice Route').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
    },
    {
      name: "Biryani - Chicken",
      description: "Aromatic basmati rice with spiced chicken",
      price: 349,
      categoryId: getCategory('Indian').id,
      restaurantId: getRestaurant('Spice Route').id,
      isVegetarian: false,
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8",
    },
    {
      name: "Dal Makhani",
      description: "Black lentils cooked in butter and cream",
      price: 249,
      categoryId: getCategory('Indian').id,
      restaurantId: getRestaurant('Spice Route').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d",
    },
    {
      name: "Naan Bread",
      description: "Traditional Indian flatbread",
      price: 49,
      categoryId: getCategory('Indian').id,
      restaurantId: getRestaurant('Spice Route').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1619897992360-c5edd5e44d4a",
    },

    // Dragon Wok - Chinese Items
    {
      name: "Hakka Noodles",
      description: "Stir-fried noodles with vegetables",
      price: 199,
      categoryId: getCategory('Chinese').id,
      restaurantId: getRestaurant('Dragon Wok').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246",
    },
    {
      name: "Manchurian",
      description: "Crispy vegetable balls in spicy sauce",
      price: 229,
      categoryId: getCategory('Chinese').id,
      restaurantId: getRestaurant('Dragon Wok').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec",
    },
    {
      name: "Sweet and Sour Chicken",
      description: "Crispy chicken in tangy sweet sauce",
      price: 299,
      categoryId: getCategory('Chinese').id,
      restaurantId: getRestaurant('Dragon Wok').id,
      isVegetarian: false,
      imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
    },
    {
      name: "Fried Rice",
      description: "Classic fried rice with eggs and vegetables",
      price: 179,
      categoryId: getCategory('Chinese').id,
      restaurantId: getRestaurant('Dragon Wok').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1603133872768-67e1e31eafd1",
    },
    {
      name: "Spring Rolls",
      description: "Crispy vegetable spring rolls",
      price: 149,
      categoryId: getCategory('Chinese').id,
      restaurantId: getRestaurant('Dragon Wok').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb",
    },

    // Pasta House - Italian Items
    {
      name: "Spaghetti Carbonara",
      description: "Classic pasta with bacon, egg, and parmesan",
      price: 329,
      categoryId: getCategory('Italian').id,
      restaurantId: getRestaurant('Pasta House').id,
      isVegetarian: false,
      imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3",
    },
    {
      name: "Penne Arrabbiata",
      description: "Spicy tomato sauce with penne pasta",
      price: 279,
      categoryId: getCategory('Italian').id,
      restaurantId: getRestaurant('Pasta House').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    },
    {
      name: "Lasagna",
      description: "Layered pasta with meat sauce and cheese",
      price: 399,
      categoryId: getCategory('Italian').id,
      restaurantId: getRestaurant('Pasta House').id,
      isVegetarian: false,
      imageUrl: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3",
    },
    {
      name: "Fettuccine Alfredo",
      description: "Creamy white sauce with fettuccine pasta",
      price: 349,
      categoryId: getCategory('Italian').id,
      restaurantId: getRestaurant('Pasta House').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a",
    },

    // Mexican Items across restaurants
    {
      name: "Chicken Tacos",
      description: "Soft tacos with grilled chicken and salsa",
      price: 249,
      categoryId: getCategory('Mexican').id,
      restaurantId: getRestaurant('Burger Bistro').id,
      isVegetarian: false,
      imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
    },
    {
      name: "Veggie Burrito",
      description: "Bean and veggie burrito with guacamole",
      price: 229,
      categoryId: getCategory('Mexican').id,
      restaurantId: getRestaurant('Burger Bistro').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f",
    },
    {
      name: "Nachos Supreme",
      description: "Loaded nachos with cheese and jalapenos",
      price: 199,
      categoryId: getCategory('Mexican').id,
      restaurantId: getRestaurant('Pizza Paradise').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d",
    },

    // Desserts across restaurants
    {
      name: "Chocolate Brownie",
      description: "Rich chocolate brownie with ice cream",
      price: 149,
      categoryId: getCategory('Desserts').id,
      restaurantId: getRestaurant('Pizza Paradise').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1607920591413-4ec007e70023",
    },
    {
      name: "Tiramisu",
      description: "Classic Italian coffee-flavored dessert",
      price: 179,
      categoryId: getCategory('Desserts').id,
      restaurantId: getRestaurant('Pasta House').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
    },
    {
      name: "Gulab Jamun",
      description: "Sweet Indian dessert in sugar syrup",
      price: 99,
      categoryId: getCategory('Desserts').id,
      restaurantId: getRestaurant('Spice Route').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be",
    },

    // Beverages
    {
      name: "Mango Lassi",
      description: "Sweet yogurt drink with mango",
      price: 79,
      categoryId: getCategory('Beverages').id,
      restaurantId: getRestaurant('Spice Route').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4",
    },
    {
      name: "Fresh Lime Soda",
      description: "Refreshing lime and soda water",
      price: 49,
      categoryId: getCategory('Beverages').id,
      restaurantId: getRestaurant('Dragon Wok').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc",
    },
    {
      name: "Iced Coffee",
      description: "Cold brew coffee with ice",
      price: 99,
      categoryId: getCategory('Beverages').id,
      restaurantId: getRestaurant('Pasta House').id,
      isVegetarian: true,
      imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7",
    },
  ]);

  console.log(`✅ Created ${menuItems.length} menu items`);
  console.log('🎉 Seed completed successfully!');

  await dataSource.destroy();
}

seed()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });

// ===================================
// Add to package.json scripts:
// ===================================
/*
{
  "scripts": {
    "seed:catalog": "ts-node apps/catalog-service/src/seed.ts"
  }
}
*/