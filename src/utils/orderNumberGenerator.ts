// Function to generate a 6-digit random number
const generate6DigitNumber = (): string => {
    const min = 100000; // 6 digits
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

// Function to get the next order number
export const getNextOrderNumber = (layoutArtist: string): { orderNumber: string; jobSerial: string } => {
    const lastOrderNumber = parseInt(localStorage.getItem('orderNumber') || '0');
    const nextNumber = String(lastOrderNumber + 1).padStart(4, '0');
    
    return {
        orderNumber: `JO-${nextNumber}`,
        jobSerial: `IRONWOLF-${generate6DigitNumber()}-${layoutArtist}`
    };
};

// Function to save the current order number
export const saveOrderNumber = (orderNumber: string) => {
    const number = parseInt(orderNumber.split('-')[1]);
    localStorage.setItem('orderNumber', number.toString());
};

// Function to reset order numbers (for testing or admin purposes)
export const resetOrderNumbers = () => {
    localStorage.setItem('orderNumber', '0');
};
