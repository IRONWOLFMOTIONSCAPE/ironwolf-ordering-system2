import { configureStore, combineReducers } from '@reduxjs/toolkit';
import usersReducer from '../features/users/usersSlice';
import authReducer from '../features/auth/authSlice';
import type { UsersState } from '../features/users/usersSlice';

export interface AppRootState {
    users: UsersState;
    auth: {
        isAuthenticated: boolean;
        user: {
            id: string;
            name: string;
            role: string;
        } | null;
    };
}

// Load state from localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('appState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

// Save state to localStorage
const saveState = (state: AppRootState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('appState', serializedState);
    } catch (err) {
        // Ignore write errors
        console.error('Failed to save state:', err);
    }
};

const rootReducer = combineReducers({
    users: usersReducer,
    auth: authReducer,
});

const preloadedState = loadState();

const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Subscribe to store changes
store.subscribe(() => {
    saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export default store;
