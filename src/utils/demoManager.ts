import { format, addDays, subDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const sampleSublimationTypes = [
    { id: '1', type: 'T-Shirt', price: 350 },
    { id: '2', type: 'Jersey', price: 450 },
    { id: '3', type: 'Mug', price: 200 },
    { id: '4', type: 'Phone Case', price: 250 },
    { id: '5', type: 'Mouse Pad', price: 180 }
];

const sampleUsers = [
    { id: '1', name: 'Demo Manager', role: 'Manager', username: 'manager', password: 'demo123' },
    { id: '2', name: 'Demo Staff', role: 'Staff', username: 'staff', password: 'demo123' }
];

const generateSampleOrders = () => {
    const orders = [];
    const today = new Date();
    const statuses = ['Pending', 'In Progress', 'Completed', 'Delivered'];
    const billingStatuses = ['Unpaid', 'Partially Paid', 'Paid'];
    
    // Generate 20 sample orders
    for (let i = 0; i < 20; i++) {
        const orderDate = subDays(today, Math.floor(Math.random() * 30)); // Random date within last 30 days
        const deadline = addDays(orderDate, Math.floor(Math.random() * 14) + 1); // Random deadline 1-14 days after order
        const totalAmount = Math.floor(Math.random() * 5000) + 1000;
        const depositAmount = Math.floor(totalAmount * (Math.random() * 0.7));
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const billingStatus = billingStatuses[Math.floor(Math.random() * billingStatuses.length)];

        const order = {
            jobOrderNumber: `JO-${2023}-${(i + 1).toString().padStart(4, '0')}`,
            serialJobNumber: `${(i + 1).toString().padStart(4, '0')}`,
            customerName: `Demo Customer ${i + 1}`,
            status,
            orderType: Math.random() > 0.8 ? 'PAHABOL' : 'NEW',
            deadline: format(deadline, 'yyyy-MM-dd'),
            billingStatus,
            totalAmount,
            depositAmount,
            balance: totalAmount - depositAmount,
            customerDetails: {
                name: `Demo Customer ${i + 1}`,
                email: `customer${i + 1}@demo.com`,
                contact: `09${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`
            },
            orderDetails: {
                type: Math.random() > 0.8 ? 'PAHABOL' : 'NEW',
                layoutArtist: Math.random() > 0.5 ? 'Demo Manager' : 'Demo Staff',
                dateOfOrder: format(orderDate, 'yyyy-MM-dd'),
                sublimationOrders: Array(Math.floor(Math.random() * 3) + 1).fill(null).map(() => {
                    const type = sampleSublimationTypes[Math.floor(Math.random() * sampleSublimationTypes.length)];
                    const quantity = Math.floor(Math.random() * 50) + 1;
                    return {
                        type: type.type,
                        pricePerUnit: type.price,
                        quantity,
                        totalPrice: type.price * quantity
                    };
                })
            }
        };

        orders.push(order);
    }

    return orders;
};

export const loadDemoData = () => {
    try {
        // Save original data
        const originalData = {
            orders: localStorage.getItem('orders'),
            users: localStorage.getItem('users'),
            sublimationTypes: localStorage.getItem('sublimationTypes'),
            currentUser: localStorage.getItem('currentUser'),
            orderNumber: localStorage.getItem('orderNumber')
        };
        localStorage.setItem('originalData', JSON.stringify(originalData));

        // Set demo data
        localStorage.setItem('orders', JSON.stringify(generateSampleOrders()));
        localStorage.setItem('users', JSON.stringify(sampleUsers));
        localStorage.setItem('sublimationTypes', JSON.stringify(sampleSublimationTypes));
        localStorage.setItem('isDemoMode', 'true');

        // Reset order number for demo
        localStorage.setItem('orderNumber', '0');

        return true;
    } catch (error) {
        console.error('Failed to load demo data:', error);
        return false;
    }
};

export const exitDemoMode = () => {
    try {
        // Restore original data
        const originalData = JSON.parse(localStorage.getItem('originalData') || '{}');
        
        // Restore each item, or remove if it didn't exist originally
        if (originalData.orders) localStorage.setItem('orders', originalData.orders);
        else localStorage.removeItem('orders');

        if (originalData.users) localStorage.setItem('users', originalData.users);
        else localStorage.removeItem('users');

        if (originalData.sublimationTypes) localStorage.setItem('sublimationTypes', originalData.sublimationTypes);
        else localStorage.removeItem('sublimationTypes');

        if (originalData.currentUser) localStorage.setItem('currentUser', originalData.currentUser);
        else localStorage.removeItem('currentUser');

        if (originalData.orderNumber) localStorage.setItem('orderNumber', originalData.orderNumber);
        else localStorage.removeItem('orderNumber');

        // Clean up
        localStorage.removeItem('originalData');
        localStorage.removeItem('isDemoMode');

        return true;
    } catch (error) {
        console.error('Failed to exit demo mode:', error);
        return false;
    }
};

export const isDemoMode = () => {
    return localStorage.getItem('isDemoMode') === 'true';
};
