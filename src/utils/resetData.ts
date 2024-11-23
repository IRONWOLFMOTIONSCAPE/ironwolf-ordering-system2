export const resetAllData = () => {
    // Clear all orders
    localStorage.removeItem('orders');
    
    // Clear order history
    localStorage.removeItem('orderHistory');
    
    // Reset order number counter
    localStorage.setItem('lastOrderNumber', '0');
    
    // Clear any other related data
    localStorage.removeItem('completedOrders');
    localStorage.removeItem('pendingOrders');
    
    // Dispatch an event to notify components of the change
    window.dispatchEvent(new Event('ordersUpdated'));
    window.dispatchEvent(new Event('storage'));
};
