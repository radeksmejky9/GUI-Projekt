export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    profile_picture_url?: string;
    workspaces: Workspace[];
    workspace_users: WorkspaceUser[];
}

export interface Workspace {
    id: number;
    name: string;
    owner_id: number;
    owner: User;
    workspace_users: WorkspaceUser[];
    cards: Card[];
}

export interface WorkspaceUser {
    id: number;
    workspace_id: number;
    user_id: number;
    role: string;
    workspace: Workspace;
    user: User;
}

export interface Card {
    id: number;
    name: string;
    workspace_id: number;
    due_date?: string;
    priority?: string;
    labels?: string;
    workspace: Workspace;
    tasks: Task[];
}

export interface Task {
    id: number;
    name: string;
    description?: string;
    deadline?: string;
    start_date?: string;
    completion_status?: boolean;
    priority?: string;
    card_id: number;
    card: Card;
}