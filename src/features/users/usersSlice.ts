import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    name: string;
    role: string;
    pin: string;
    active: boolean;
    reason?: string;
}

export interface UsersState {
    users: User[];
}

const loadInitialState = (): UsersState => {
    try {
        const savedState = localStorage.getItem('appState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            if (parsedState.users && Array.isArray(parsedState.users.users)) {
                return parsedState.users;
            }
        }
    } catch (err) {
        console.error('Error loading initial state:', err);
    }
    
    // Default initial state if nothing in localStorage
    return {
        users: [
            {
                id: '1',
                name: 'Jeffrey',
                role: 'Manager',
                pin: '1234',
                active: true,
                reason: '',
            }
        ],
    };
};

const initialState: UsersState = loadInitialState();

interface ToggleUserActivePayload {
    id: string;
    active: boolean;
    reason: string;
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<Omit<User, 'id'>>) => {
            const newUser = {
                ...action.payload,
                id: Date.now().toString(),
            };
            state.users.push(newUser);
        },
        updateUser: (state, action: PayloadAction<User>) => {
            const index = state.users.findIndex(user => user.id === action.payload.id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        },
        toggleUserActive: (state, action: PayloadAction<ToggleUserActivePayload>) => {
            const { id, active, reason } = action.payload;
            const userIndex = state.users.findIndex(user => user.id === id);
            
            if (userIndex !== -1) {
                state.users[userIndex] = {
                    ...state.users[userIndex],
                    active,
                    reason
                };
            }
        },
    },
});

export const { addUser, updateUser, deleteUser, toggleUserActive } = usersSlice.actions;
export default usersSlice.reducer;
