// Seed database with test data

const { MongoClient } = require('mongodb');
// Note: In a real environment, you would need to install bcryptjs
// const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/StudentMentorDB';

async function seedDatabase() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('StudentMentorDB');

        console.log('🌱 Seeding database...');

        // Create test user
        // const hashedPassword = await bcrypt.hash('test@123', 10);
        const hashedPassword = "$2b$10$e0MYzXy5..."; // Mock hash for now

        const usersCollection = db.collection('users');
        const userResult = await usersCollection.insertOne({
            email: 'test@example.com',
            passwordHash: hashedPassword,
            googleId: null,
            firstName: 'Test',
            lastName: 'User',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('✓ Test user created:', userResult.insertedId);

        // Create test conversation
        const conversationsCollection = db.collection('conversations');
        const convResult = await conversationsCollection.insertOne({
            userId: userResult.insertedId.toString(),
            title: 'Sample DSA Question',
            messages: [
                {
                    messageId: 'msg-1',
                    role: 'user',
                    content: 'Explain binary search',
                    subject: 'DSA',
                    type: 'question',
                    timestamp: new Date()
                },
                {
                    messageId: 'msg-2',
                    role: 'assistant',
                    content: 'Binary search is an efficient algorithm...',
                    subject: 'DSA',
                    type: 'question',
                    timestamp: new Date()
                }
            ],
            summary: 'Discussion about binary search algorithm',
            keyTopics: ['binary search', 'searching algorithms'],
            createdAt: new Date(),
            lastMessageAt: new Date(),
            isArchived: false
        });

        console.log('✓ Test conversation created:', convResult.insertedId);
        console.log('✓ Database seeding complete!');

    } catch (error) {
        console.error('✗ Error seeding database:', error);
    } finally {
        await client.close();
    }
}

seedDatabase();
