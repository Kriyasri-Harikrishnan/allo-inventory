import { PrismaClient, Category } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
    console.log("[STEP 1 - Started] Seeding Database . . .")
    await prisma.reservation.deleteMany()
    await prisma.stock.deleteMany()
    await prisma.product.deleteMany()
    await prisma.warehouse.deleteMany()

    /* Warehouse Locations */

    const chennai = await prisma.warehouse.create({
        data : {
            name : "Chennai Hub",
            location : "Chennai, TN",
            pincode : "600001",
            deliveryBaseFee : 39.00,
            deliveryFeePerKg : 9.00, 
        }
    })

    const bangalore = await prisma.warehouse.create({
        data : {
            name : "Bangalore Central",
            location : "Bangalore, KA",
            pincode : "560001",
            deliveryBaseFee : 45.00,
            deliveryFeePerKg : 10.00, 
        }
    })

    const hyderabad = await prisma.warehouse.create({
        data : {
        name : "Hyderabad South",
        location : "Hyderabad, TS",
        pincode : "500001",
        deliveryBaseFee: 42.00,
        deliveryFeePerKg: 11.00,
        }
    })

    /* Products */

    const headphones = await prisma.product.create({
        data : {
            sku : "ELEC-PHN-001",
            name : "Chunky Wireless Headphones",
            description : "Over-ear Noise Cancelling Headphones.",
            price : 2999.99,
            weightKg : 0.3,
            category : Category.ELECTRONICS, 
            imageUrl : "https://images.unsplash.com/photo-1673854623709-52a671f601be?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIxfHx8ZW58MHx8fHx8",
        }
    })

    const tshirt = await prisma.product.create({
        data: {
            sku : "APRL-TSH-001",
            name : "Cotton Crew T-Shirt",
            description : "100% cotton everyday tee. White colour.",
            price : 499.99,
            weightKg : 0.2,
            category : Category.APPAREL,
            imageUrl : "https://images.unsplash.com/photo-1722310752951-4d459d28c678?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }
    })

    const sneakers = await prisma.product.create({
        data: {
            sku : "FOOT-SNK-001",
            name : "Athletic Running Sneakers",
            description : "Lightweight premium running shoes.",
            price : 1999.99,
            weightKg : 0.8,
            category : Category.FOOTWEAR,
            imageUrl : "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXRobGV0aWMlMjBzaG9lc3xlbnwwfHwwfHx8MA%3D%3D",
        }
    })

    const yogaMat = await prisma.product.create({
        data : {
            sku : "SPRT-YGM-001",
            name : "Yoga Mat",
            description : "Non-slip 6mm purple yoga mat.",
            price : 799.99,
            weightKg : 1.2,
            category : Category.SPORTS_AND_FITNESS,
            imageUrl : "https://imgmediagumlet.lbb.in/media/2023/01/63c50a30f4d6cd4ea429dc7f_1673857584071.jpg",
        }
    })

    const lavaLamp = await prisma.product.create({
        data: {
            sku : "HOME-LMP-001",
            name : "Desk Lava Lamp",
            description : " Blue Lava Lamp.",
            price : 899.99,
            weightKg : 0.6,
            category : Category.HOME_AND_LIVING,
            imageUrl : "https://images.unsplash.com/photo-1574882225022-5f45b99d4966?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGF2YSUyMGxhbXB8ZW58MHx8MHx8fDA%3D",
        }
    })

    const cleanser = await prisma.product.create({
        data: {
            sku : "BEAU-MST-001",
            name : "Curology Daily Cleanser Set",
            description : "Lightweight Cleanser from Curology.",
            price : 349.99,
            weightKg : 0.1,
            category : Category.BEAUTY,
            imageUrl : "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xlYW5zZXJ8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000",
        }
    })

    const stockData = [
        {productId: headphones.productId, warehouseId: chennai.warehouseId, totalUnits: 15},
        {productId: headphones.productId, warehouseId: bangalore.warehouseId, totalUnits: 10},
        {productId: headphones.productId, warehouseId: hyderabad.warehouseId, totalUnits: 8 },
        
        {productId: tshirt.productId, warehouseId: chennai.warehouseId, totalUnits: 30},
        {productId: tshirt.productId, warehouseId: bangalore.warehouseId, totalUnits: 25},
        {productId: tshirt.productId, warehouseId: hyderabad.warehouseId, totalUnits: 20},
        
        {productId: sneakers.productId, warehouseId: chennai.warehouseId, totalUnits: 12},
        {productId: sneakers.productId, warehouseId: bangalore.warehouseId, totalUnits: 6},
        {productId: sneakers.productId, warehouseId: hyderabad.warehouseId, totalUnits: 2},
        
        {productId: yogaMat.productId, warehouseId: chennai.warehouseId, totalUnits: 20},
        {productId: yogaMat.productId, warehouseId: bangalore.warehouseId, totalUnits: 15},
        {productId: yogaMat.productId, warehouseId: hyderabad.warehouseId, totalUnits: 8},
        
        {productId: lavaLamp.productId, warehouseId: chennai.warehouseId, totalUnits: 18},
        {productId: lavaLamp.productId, warehouseId: bangalore.warehouseId, totalUnits: 10},
        {productId: lavaLamp.productId, warehouseId: hyderabad.warehouseId, totalUnits: 5},
        
        {productId: cleanser.productId, warehouseId: chennai.warehouseId, totalUnits: 50},
        {productId: cleanser.productId, warehouseId: bangalore.warehouseId, totalUnits: 35},
        {productId: cleanser.productId, warehouseId: hyderabad.warehouseId, totalUnits: 40},
    ]

    await prisma.stock.createMany({
        data : stockData
    })

    console.log("[STEP 1 - ENDED] Seeding complete!")
    console.log(`                  - 3 warehouses`)
    console.log(`                  - 6 products`)
    console.log(`                  - ${stockData.length} stock entries`)
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
  }).finally(async () => {await prisma.$disconnect()})
