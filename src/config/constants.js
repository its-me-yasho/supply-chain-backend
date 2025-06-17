// Application constants
export const APP_NAME = 'Supply Chain Backend';

export const JWT_EXPIRES_IN = '7d';

// Status Codes
export const ORDER_STATUSES = {
    CREATED: 'created',
    INSPECTION_PENDING: 'inspection_pending',
    INSPECTION_DONE: 'inspection_done',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
};

// User Roles
export const ROLES = {
    ADMIN: 'admin',
    PROCUREMENT: 'procurement',
    INSPECTION: 'inspection',
    CLIENT: 'client',
};

export const MODEL_NAMES = {
    USER: 'User',
    ORDER: 'Order',
    CHECKLIST: 'Checklist',
    CHECKLIST_ANSWER: 'ChecklistAnswer',
    CHARECTER: 'Charecter'
};

export const allowedCreation = {
  admin: ["admin","procurement", "inspection", "client"],
  procurement: ["inspection", "client"],
};

export const ANSWER_TYPES = {
    BOOLEAN: 'boolean',
    SINGLE_CHOICE: 'single_choice',
    MULTIPLE_CHOICE: 'multiple_choice',
    STRING: 'string',
    IMAGE: 'image',
    DROPDOWN: 'dropdown',
    NUMBER: 'number',
    TEXT: 'text',
};
