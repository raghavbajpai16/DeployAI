import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    googleId?: string;
    avatar?: string;
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
            required: function (this: any) { return !this.googleId; }, // Required only if not Google OAuth
            minlength: 6,
            select: false,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        avatar: {
            type: String,
            default: '',
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
    const user = this as any; // Cast to any to access document properties easily
    if (!user.isModified('passwordHash')) return next();

    if (user.passwordHash) {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
    }
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const user = this as any;
    return bcrypt.compare(candidatePassword, user.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
