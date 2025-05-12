export const ALL = [
    "view_topics",
    "create_topics",
    "edit_topics",
    "delete_topics",
    "view_users",
    "create_users",
    "edit_users",
    "delete_users",
    "view_resources",
    "create_resources",
    "edit_resources",
    "delete_resources"
] as const;

export const ADMIN = [...ALL];

export const EDITOR = ["view_topics", "edit_topics", "view_resources", "create_resources", "edit_resources"];

export const VIEWER = ["view_topics", "view_resources"];