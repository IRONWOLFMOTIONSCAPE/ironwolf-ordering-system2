import { format } from 'date-fns';

interface BackupData {
    orders: any[];
    timestamp: string;
    backupId: string;
}

const BACKUP_KEY_PREFIX = 'order_backup_';
const MAX_BACKUPS = 50; // Keep last 50 backups

export const createBackup = () => {
    try {
        // Get current orders
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Create backup object
        const backup: BackupData = {
            orders,
            timestamp: new Date().toISOString(),
            backupId: `backup_${format(new Date(), 'yyyyMMdd_HHmmss')}`
        };

        // Save backup
        const backupKey = `${BACKUP_KEY_PREFIX}${backup.backupId}`;
        localStorage.setItem(backupKey, JSON.stringify(backup));

        // Clean up old backups
        cleanupOldBackups();

        console.log(`Backup created: ${backup.backupId}`);
        return backup.backupId;
    } catch (error) {
        console.error('Failed to create backup:', error);
        return null;
    }
};

export const restoreBackup = (backupId: string): boolean => {
    try {
        // Get backup data
        const backupKey = `${BACKUP_KEY_PREFIX}${backupId}`;
        const backupData = localStorage.getItem(backupKey);
        
        if (!backupData) {
            console.error('Backup not found:', backupId);
            return false;
        }

        const backup: BackupData = JSON.parse(backupData);

        // Create a backup of current state before restoring
        const currentBackupId = createBackup();
        console.log(`Created safety backup before restore: ${currentBackupId}`);

        // Restore orders
        localStorage.setItem('orders', JSON.stringify(backup.orders));

        // Trigger update events
        window.dispatchEvent(new Event('ordersUpdated'));
        window.dispatchEvent(new Event('storage'));

        console.log(`Restored backup: ${backupId}`);
        return true;
    } catch (error) {
        console.error('Failed to restore backup:', error);
        return false;
    }
};

export const listBackups = (): BackupData[] => {
    const backups: BackupData[] = [];
    
    // Iterate through localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(BACKUP_KEY_PREFIX)) {
            try {
                const backup: BackupData = JSON.parse(localStorage.getItem(key) || '');
                backups.push(backup);
            } catch (error) {
                console.error('Failed to parse backup:', error);
            }
        }
    }

    // Sort backups by timestamp (newest first)
    return backups.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
};

export const clearAllBackups = () => {
    try {
        // Get all keys from localStorage
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(BACKUP_KEY_PREFIX)) {
                keys.push(key);
            }
        }

        // Remove all backup keys
        keys.forEach(key => localStorage.removeItem(key));
        console.log(`Cleared ${keys.length} backups`);
        return true;
    } catch (error) {
        console.error('Failed to clear backups:', error);
        return false;
    }
};

// Reset all data to initial state
export const resetAllData = () => {
    try {
        // Create a backup before resetting
        const backupId = createBackup();
        console.log(`Created safety backup before reset: ${backupId}`);

        // Clear all data
        localStorage.setItem('orders', '[]');
        localStorage.setItem('sublimationTypes', JSON.stringify([
            { id: '1', type: 'T-Shirt', price: 350 },
            { id: '2', type: 'Jersey', price: 450 },
            { id: '3', type: 'Mug', price: 200 },
            { id: '4', type: 'Phone Case', price: 250 },
            { id: '5', type: 'Mouse Pad', price: 180 }
        ]));
        localStorage.setItem('orderNumber', '0');

        // Keep user data intact for authentication
        // But you might want to reset other app-specific data here

        // Trigger update events
        window.dispatchEvent(new Event('ordersUpdated'));
        window.dispatchEvent(new Event('storage'));

        console.log('All data has been reset to initial state');
        return true;
    } catch (error) {
        console.error('Failed to reset data:', error);
        return false;
    }
};

const cleanupOldBackups = () => {
    const backups = listBackups();
    
    // If we have more than MAX_BACKUPS, remove the oldest ones
    if (backups.length > MAX_BACKUPS) {
        const toRemove = backups.slice(MAX_BACKUPS);
        toRemove.forEach(backup => {
            const key = `${BACKUP_KEY_PREFIX}${backup.backupId}`;
            localStorage.removeItem(key);
        });
    }
};
