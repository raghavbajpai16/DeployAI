import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    googleId?: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Email required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        passwordHash: {
            type: String,
            required: [true, 'Password required'],
            minlength: 6,
            select: false, // Don't return by default
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        firstName: {
            type: String,
            required: [true, 'First name required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name required'],
            trim: true,
        },
    },
    { timestamps: true }
);

// Hash password before save
UserSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
