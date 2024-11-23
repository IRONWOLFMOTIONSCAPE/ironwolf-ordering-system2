export interface User {
    id: string;
    name: string;
    role: string;
}

export interface Order {
    jobOrder: number;
    jobSerial: string;
    dateOfOrder: string;
    deadline: string;
    layoutArtist: string;
    type: 'NEW' | 'PAHABOL';
    customer: {
        name: string;
        email: string;
        contact: string;
    };
    sublimationOrders: SublimationOrder[];
}

export interface SublimationOrder {
    id: string;
    type: string;
    pricePerUnit: number;
    quantity: number;
    totalPrice: number;
}

export interface AuthState {
    isAuthenticated: boolean;
    currentUser: User | null;
    error: string | null;
}
