export interface CustomerDetails {
    name: string;
    email?: string;
    contact: string;
}

export interface SizeQuantity {
    XS: number;
    S: number;
    M: number;
    L: number;
    XL: number;
    XXL: number;
    XXXL: number;
    custom?: { [key: string]: number };
}

export interface SublimationType {
    type: string;
    quantity: number;
    sizes: SizeQuantity;
    requiresNames: boolean;
    names?: Array<{
        name: string;
        size: string;
    }>;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerDetails: CustomerDetails;
    orderDate: string;
    deadline?: string;
    status: 'Pending' | 'In Progress' | 'Done' | 'Cancelled' | 'Completed';
    sublimationTypes: SublimationType[];
    totalAmount: number;
    billingStatus: 'Unpaid' | 'Partially Paid' | 'Paid';
    depositAmount: number;
    balance: number;
    notes?: string;
    movedToHistory?: boolean;
}

export interface OrderFilters {
    search: string;
    status: string[];
    dateRange: {
        start: string | null;
        end: string | null;
    };
    sortBy: 'date' | 'status' | 'customer';
    sortOrder: 'asc' | 'desc';
}
