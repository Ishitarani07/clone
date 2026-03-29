import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { User, Category, Product, Cart } from "../src/models/index.js";
import { DEFAULT_USER_ID } from "../src/utils/constants.js";

const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Mobiles", slug: "mobiles" },
  { name: "Fashion", slug: "fashion" },
  { name: "Home & Furniture", slug: "home-furniture" },
  { name: "Appliances", slug: "appliances" },
  { name: "Beauty & Personal Care", slug: "beauty-personal-care" },
];

const getProducts = (categoryMap) => [
  {
    title: "Apple iPhone 15 Pro (256 GB) - Natural Titanium",
    slug: "apple-iphone-15-pro-256gb-natural-titanium",
    description:
      "iPhone 15 Pro features a strong and light aerospace-grade titanium design with a textured matte-glass back. It also features the A17 Pro chip, a new 48MP camera system, and Action button.",
    highlights: [
      "A17 Pro chip",
      "48MP Main camera",
      "Titanium design",
      "Action button",
      "USB-C",
    ],
    specifications: new Map([
      ["Display", "6.1 inch Super Retina XDR"],
      ["Processor", "A17 Pro Bionic"],
      ["RAM", "8 GB"],
      ["Storage", "256 GB"],
      ["Battery", "3274 mAh"],
    ]),
    categoryId: categoryMap["mobiles"],
    brand: "Apple",
    price: 149900,
    discountPercent: 8,
    finalPrice: 137900,
    stock: 25,
    images: [
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/mobile/p/b/q/-original-imahggex2ye98xfn.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/mobile/6/j/1/-original-imahggexhnfhg2zs.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/mobile/g/0/w/-original-imahggexgjtd2yju.jpeg?q=90",
      },
    ],
    ratingAverage: 4.6,
    ratingCount: 1250,
  },
  {
    title: "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)",
    slug: "samsung-galaxy-s24-ultra-5g-titanium-gray-256gb",
    description:
      "Galaxy S24 Ultra with Galaxy AI, 200MP camera, Snapdragon 8 Gen 3 processor, and S Pen.",
    highlights: [
      "200MP Camera",
      "Galaxy AI",
      "S Pen included",
      "Snapdragon 8 Gen 3",
      "5000mAh Battery",
    ],
    specifications: new Map([
      ["Display", "6.8 inch Dynamic AMOLED 2X"],
      ["Processor", "Snapdragon 8 Gen 3"],
      ["RAM", "12 GB"],
      ["Storage", "256 GB"],
      ["Battery", "5000 mAh"],
    ]),
    categoryId: categoryMap["mobiles"],
    brand: "Samsung",
    price: 134999,
    discountPercent: 10,
    finalPrice: 121499,
    stock: 30,
    images: [
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/mobile/j/m/z/-original-imahgfmxumntk7sy.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/mobile/5/c/x/-original-imahggevnsn9ubah.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/mobile/l/u/t/-original-imahggevfhnjjmvf.jpeg?q=90",
      },
    ],
    ratingAverage: 2.5,
    ratingCount: 890,
  },
  {
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    slug: "sony-wh-1000xm5-wireless-headphones",
    description:
      "Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones.",
    highlights: [
      "30-hour battery",
      "Industry-leading NC",
      "Multipoint connection",
      "Speak-to-Chat",
    ],
    specifications: new Map([
      ["Driver", "30mm"],
      ["Frequency Response", "4Hz-40,000Hz"],
      ["Battery Life", "30 hours"],
      ["Weight", "250g"],
    ]),
    categoryId: categoryMap["electronics"],
    brand: "Sony",
    price: 34990,
    discountPercent: 20,
    finalPrice: 27990,
    stock: 50,
    images: [
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/headphone/v/d/g/-original-imahgr295uvptwq7.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/headphone/w/q/w/-original-imahgr296huaxwty.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/headphone/m/9/r/-original-imahgr29snkwgqqn.jpeg?q=90",
      },
    ],
    ratingAverage: 4.7,
    ratingCount: 2100,
  },
  {
    title: "Apple MacBook Air M3 (15-inch, 8GB RAM, 256GB SSD)",
    slug: "apple-macbook-air-m3-15inch-8gb-256gb",
    description:
      "MacBook Air with M3 chip. Strikingly thin design, up to 18 hours of battery life, and a brilliant 15.3-inch Liquid Retina display.",
    highlights: [
      "M3 chip",
      "15.3-inch Liquid Retina",
      "18-hour battery",
      "MagSafe charging",
      "1080p FaceTime HD camera",
    ],
    specifications: new Map([
      ["Display", "15.3 inch Liquid Retina"],
      ["Processor", "Apple M3"],
      ["RAM", "8 GB"],
      ["Storage", "256 GB SSD"],
      ["Battery", "Up to 18 hours"],
    ]),
    categoryId: categoryMap["electronics"],
    brand: "Apple",
    price: 154900,
    discountPercent: 5,
    finalPrice: 147155,
    stock: 15,
    images: [
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/computer/z/p/w/-original-imagypv6egkruwgg.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/computer/r/c/j/-original-imagypv6fyzyaj4z.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/computer/s/q/p/-original-imagypv6a3fczzyb.jpeg?q=90",
      },
    ],
    ratingAverage: 3.8,
    ratingCount: 560,
  },
  {
    title: "Nike Air Max 270 React Men's Shoes",
    slug: "nike-air-max-270-react-mens-shoes",
    description:
      "The Nike Air Max 270 React combines lifestyle Nike Air Max cushioning with React foam for a soft, responsive feel.",
    highlights: [
      "Air Max cushioning",
      "React foam",
      "Lightweight",
      "Breathable mesh upper",
    ],
    specifications: new Map([
      ["Upper Material", "Mesh and synthetic"],
      ["Sole", "Rubber"],
      ["Closure", "Lace-up"],
    ]),
    categoryId: categoryMap["fashion"],
    brand: "Nike",
    price: 14995,
    discountPercent: 30,
    finalPrice: 10497,
    stock: 100,
    images: [
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/shoe/j/2/o/14-ah8050-602-14-nike-gym-red-white-black-original-imahd2vvg7xnncgz.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/shoe/s/7/k/14-ah8050-602-14-nike-gym-red-white-black-original-imahd2vvzuezbq4g.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/shoe/f/0/m/14-ah8050-602-14-nike-gym-red-white-black-original-imahd2vvydgtn3j4.jpeg?q=90",
      },
    ],
    ratingAverage: 4.4,
    ratingCount: 3200,
  },
  {
    title: "Levi's Men's 511 Slim Fit Jeans",
    slug: "levis-mens-511-slim-fit-jeans",
    description:
      "The 511 Slim Fit Jeans are a modern slim with room to move. Sits below waist with a slim fit from hip to ankle.",
    highlights: ["Slim fit", "Stretch fabric", "5-pocket styling", "Zip fly"],
    specifications: new Map([
      ["Material", "99% Cotton, 1% Elastane"],
      ["Fit", "Slim"],
      ["Rise", "Mid-rise"],
      ["Closure", "Zip fly with button"],
    ]),
    categoryId: categoryMap["fashion"],
    brand: "Levi's",
    price: 3999,
    discountPercent: 40,
    finalPrice: 2399,
    stock: 200,
    images: [
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/jean/j/e/d/-original-imah2mvtsxdvmthe.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/jean/s/v/c/-original-imah2mvtqw85udqx.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/jean/h/k/0/-original-imah2mvtuafzmyuh.jpeg?q=90",
      },
    ],
    ratingAverage: 4.3,
    ratingCount: 5600,
  },
  {
    title: "IKEA MALM Bed Frame with Storage",
    slug: "ikea-malm-bed-frame-storage",
    description:
      "Ample storage space is hidden neatly under the bed in 4 large drawers. Perfect for extra quilts, pillows and bed linen.",
    highlights: [
      "4 storage drawers",
      "Adjustable bed sides",
      "Queen size",
      "White finish",
    ],
    specifications: new Map([
      ["Size", "Queen"],
      ["Material", "Particleboard, Fiberboard"],
      ["Color", "White"],
      ["Dimensions", "209x176 cm"],
    ]),
    categoryId: categoryMap["home-furniture"],
    brand: "IKEA",
    price: 29990,
    discountPercent: 15,
    finalPrice: 25492,
    stock: 20,
    images: [
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/bed/p/x/e/-original-imahh4x8zswvtaf3.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/bed/t/h/u/queen-209-5-na-no-159-6-particle-board-yes-108-56101515sd00833-original-imah8ew7znavr9jf.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/bed/t/k/q/queen-209-5-na-no-159-6-particle-board-yes-108-56101515sd00833-original-imah8ew7b2cnukcj.jpeg?q=90",
      },
    ],
    ratingAverage: 4.2,
    ratingCount: 890,
  },
  {
    title: "LG 655 L Frost Free Side by Side Refrigerator",
    slug: "lg-655l-frost-free-side-by-side-refrigerator",
    description:
      "LG Side by Side Refrigerator with InstaView Door-in-Door, Linear Cooling, and Smart Diagnosis.",
    highlights: [
      "InstaView Door-in-Door",
      "Linear Cooling",
      "Smart ThinQ",
      "Hygiene Fresh+",
    ],
    specifications: new Map([
      ["Capacity", "655 L"],
      ["Type", "Side by Side"],
      ["Star Rating", "3 Star"],
      ["Compressor", "Smart Inverter"],
    ]),
    categoryId: categoryMap["appliances"],
    brand: "LG",
    price: 89990,
    discountPercent: 25,
    finalPrice: 67493,
    stock: 10,
    images: [
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/refrigerator-new/r/k/b/-original-imagw3zmxxdfpf9u.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/refrigerator-new/z/p/2/-original-imah44cp9hyfkq4v.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/refrigerator-new/d/z/r/-original-imah4meg8fqbup8d.jpeg?q=90",
      },
    ],
    ratingAverage: 4.4,
    ratingCount: 1200,
  },
  {
    title: "Dyson V15 Detect Cordless Vacuum Cleaner",
    slug: "dyson-v15-detect-cordless-vacuum",
    description:
      "Dyson's most powerful, intelligent cordless vacuum. Reveals invisible dust with a laser.",
    highlights: [
      "Laser dust detection",
      "60 min runtime",
      "LCD screen",
      "HEPA filtration",
    ],
    specifications: new Map([
      ["Suction Power", "230 AW"],
      ["Runtime", "Up to 60 minutes"],
      ["Bin Volume", "0.76 L"],
      ["Weight", "3.1 kg"],
    ]),
    categoryId: categoryMap["appliances"],
    brand: "Dyson",
    price: 62900,
    discountPercent: 10,
    finalPrice: 56610,
    stock: 15,
    images: [
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/l3ahpjk0/vacuum-cleaner/q/s/o/omni-glide-dyson-original-imagegfrzyhynzsj.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/l3ahpjk0/vacuum-cleaner/e/q/a/omni-glide-dyson-original-imagegfrkqkezxdq.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/vacuum-cleaner/a/y/v/-original-imah4n63dhfs4feg.jpeg?q=90",
      },
    ],
    ratingAverage: 4.6,
    ratingCount: 450,
  },
  {
    title: "Maybelline New York Fit Me Foundation",
    slug: "maybelline-fit-me-foundation",
    description:
      "Lightweight foundation that fits skin tone and texture. Natural coverage that lets skin breathe.",
    highlights: ["Matte finish", "Poreless", "Oil-free", "SPF 22"],
    specifications: new Map([
      ["Volume", "30 ml"],
      ["Finish", "Matte"],
      ["Coverage", "Medium"],
      ["Skin Type", "Normal to Oily"],
    ]),
    categoryId: categoryMap["beauty-personal-care"],
    brand: "Maybelline",
    price: 599,
    discountPercent: 25,
    finalPrice: 449,
    stock: 500,
    images: [
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/foundation/y/6/v/-original-imahk8gyz5yeywta.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/foundation/x/q/l/-original-imah62bph9ghvnhx.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/foundation/c/u/l/-original-imahk8gymkq96ezn.jpeg?q=90",
      },
    ],
    ratingAverage: 4.1,
    ratingCount: 12500,
  },
  {
    title: "OnePlus 12 5G (Silky Black, 256 GB)",
    slug: "oneplus-12-5g-silky-black-256gb",
    description:
      "OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad Camera, and 100W SUPERVOOC charging.",
    highlights: [
      "Snapdragon 8 Gen 3",
      "Hasselblad Camera",
      "100W SUPERVOOC",
      "5400mAh Battery",
    ],
    specifications: new Map([
      ["Display", "6.82 inch 2K LTPO AMOLED"],
      ["Processor", "Snapdragon 8 Gen 3"],
      ["RAM", "12 GB"],
      ["Storage", "256 GB"],
      ["Battery", "5400 mAh"],
    ]),
    categoryId: categoryMap["mobiles"],
    brand: "OnePlus",
    price: 69999,
    discountPercent: 7,
    finalPrice: 65099,
    stock: 40,
    images: [
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/mobile/6/6/p/12-cph2573-oneplus-original-imahhg7buwavsvxp.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/mobile/z/8/s/12-cph2573-oneplus-original-imahhg7b2mgsfnag.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/mobile/d/v/a/12-cph2573-oneplus-original-imahhg7bd94ashqz.jpeg?q=90",
      },
    ],
    ratingAverage: 3.9,
    ratingCount: 2300,
  },
  {
    title: "boAt Airdopes 141 TWS Earbuds",
    slug: "boat-airdopes-141-tws-earbuds",
    description:
      "boAt Airdopes 141 with 42H playtime, ENx Technology, BEAST Mode, and IPX4 water resistance.",
    highlights: ["42H Playtime", "ENx Technology", "BEAST Mode", "IPX4"],
    specifications: new Map([
      ["Driver", "8mm"],
      ["Playback Time", "42 hours total"],
      ["Charging", "Type-C"],
      ["Bluetooth", "5.1"],
    ]),
    categoryId: categoryMap["electronics"],
    brand: "boAt",
    price: 2990,
    discountPercent: 60,
    finalPrice: 1199,
    stock: 300,
    images: [
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/headphone/o/t/n/-original-imahgnf4vmxqhqym.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/speaker/h/g/e/-original-imahed7herhzzqtb.jpeg?q=90",
      },
      {
        url: "https://rukminim1.flixcart.com/image/1464/1464/xif0q/headphone/s/9/8/-original-imahdt83dz6ujdxx.jpeg?q=90",
      },
    ],
    ratingAverage: 4.0,
    ratingCount: 45000,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});

    console.log("Cleared existing data");

    // Create default user
    const defaultUser = await User.create({
      _id: new mongoose.Types.ObjectId(DEFAULT_USER_ID),
      name: "Alok",
      email: "alok953280@gmail.com",
      password: "Alok4488",
      phone: "9876543210",
      addresses: [
        {
          fullName: "Default User",
          mobile: "9876543210",
          pincode: "560001",
          city: "Bangalore",
          state: "Karnataka",
          line1: "123, MG Road",
          line2: "Near Metro Station",
          landmark: "Opposite City Mall",
          isDefault: true,
        },
      ],
    });

    console.log("Created default user");

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log("Created categories");

    // Create products
    const productsData = getProducts(categoryMap);
    await Product.insertMany(productsData);

    console.log("Created products");

    // Create empty cart for default user
    await Cart.create({
      userId: defaultUser._id,
      items: [],
    });

    console.log("Created empty cart for default user");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
