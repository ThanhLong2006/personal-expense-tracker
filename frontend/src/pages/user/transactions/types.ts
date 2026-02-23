export interface Transaction {
    id: number;
    amount: number;
    category: {
        id: number;
        name: string;
        icon: string;
        color: string;
        type: "income" | "expense";
    };
    transactionDate: string;
    note?: string;
    location?: string;
    receiptImage?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Filter {
    search: string;
    categoryId: number | null;
    startDate: string | null;
    endDate: string | null;
    minAmount: number | null;
    maxAmount: number | null;
    sortBy: "date" | "amount" | "category";
    sortOrder: "asc" | "desc";
}

export interface Statistics {
    total: number;
    count: number;
    average: number;
    min: number;
    max: number;
}
