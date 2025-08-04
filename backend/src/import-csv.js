const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function importUsers() {
    const users = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream('E:\\COURSE\\PROJECTS\\Think41\\users.csv')
            .pipe(csv())
            .on('data', (row) => users.push(row))
            .on('end', async () => {
                for (const user of users) {
                    try {
                        await prisma.user.upsert({
                            where: { email: user.email },
                            update: {
                                first_name: user.first_name,
                                last_name: user.last_name,
                                age: Number(user.age),
                                gender: user.gender,
                                state: user.state,
                                street_address: user.street_address,
                                postal_code: user.postal_code,
                                city: user.city,
                                country: user.country,
                                latitude: Number(user.latitude),
                                longitude: Number(user.longitude),
                                traffic_source: user.traffic_source,
                                created_at: new Date(user.created_at),
                            },
                            create: {
                                first_name: user.first_name,
                                last_name: user.last_name,
                                email: user.email,
                                age: Number(user.age),
                                gender: user.gender,
                                state: user.state,
                                street_address: user.street_address,
                                postal_code: user.postal_code,
                                city: user.city,
                                country: user.country,
                                latitude: Number(user.latitude),
                                longitude: Number(user.longitude),
                                traffic_source: user.traffic_source,
                                created_at: new Date(user.created_at),
                            },
                        });
                    } catch (e) {
                        console.error(e);
                    }
                }
                console.log('Users imported');
                resolve();
            })
            .on('error', reject);
    });
}

function importOrders() {
    const orders = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream('E:\\COURSE\\PROJECTS\\Think41\\orders.csv')
            .pipe(csv())
            .on('data', (row) => orders.push(row))
            .on('end', async () => {
                for (const order of orders) {
                    await prisma.order.create({
                        data: {
                            user_id: Number(order.user_id),
                            status: order.status,
                            gender: order.gender,
                            created_at: new Date(order.created_at),
                            returned_at: order.returned_at ? new Date(order.returned_at) : null,
                            shipped_at: order.shipped_at ? new Date(order.shipped_at) : null,
                            delivered_at: order.delivered_at ? new Date(order.delivered_at) : null,
                            num_of_item: Number(order.num_of_item),
                        },
                    });
                }
                console.log('Orders imported');
                resolve();
            })
            .on('error', reject);
    });
}

async function main() {
    await importUsers();
    await importOrders();
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    prisma.$disconnect();
});