export interface IGoal {
    _id: string;
    userId: string;
    title: string;
    description: string;
    subject: string;
    progress: number;
    targetDate: string;
    milestones: { title: string; isCompleted: boolean }[];
    status: 'active' | 'completed' | 'archived';
    createdAt: string;
    updatedAt: string;
}

export interface IUser {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface IMessage {
    messageId: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    subject?: string;
}

export interface IConversation {
    _id: string;
    title: string;
    messages: IMessage[];
    updatedAt: string;
}
