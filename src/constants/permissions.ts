export const ALL = ["view_topics", "create_topics", "edit_topics", "delete_topics", "view_users", "create_users", "edit_users", "delete_users"] as const;

// export const ADMIN = [...ALL];

export const ADMIN = ["view_topics", "create_topics", "edit_topics", "delete_topics", "view_users", "create_users", "edit_users", "delete_users"];

export const EDITOR = ["view_topics", "edit_topics"];

export const VIEWER = ["get_topics", "get_topics_path"];