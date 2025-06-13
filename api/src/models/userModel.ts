import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserStats } from '../interfaces/GameData';
import { GameData } from '../interfaces/GameData';

export interface IUserDocument extends Document {
    username: string;
    deviceId?: string;
    passwordHash: string;
    stats: UserStats;
    records: {
        termo: IGameDocument[];
        dueto: IGameDocument[];
        quarteto: IGameDocument[];
    };
}

interface IGameDocument extends GameData, Document { curday: number; }

const GameSchema = new Schema<IGameDocument>(
    {
        curday: { type: Number, required: true, unique: true },
        config: { hardMode: { type: Number, required: true } },
        meta: {
            startTime: { type: Number, required: true },
            endTime: { type: Number, required: true },
        },
        state: {
            type: [
                new Schema({
                    solution: String,
                    normSolution: String,
                    tries: [[String]],
                    invalids: [String],
                    curRow: Number,
                    gameOver: { type: Number, enum: [0, 1] },
                    won: { type: Number, enum: [0, 1, null], default: null }
                }, { _id: false })
            ],
            required: true
        }
    }, { _id: false });

const StatsSchema = new Schema<UserStats>({
    histo: [{
        attempts: { type: Number, required: true },
        time: { type: Number, required: false },
    }],
    games: { type: Number, required: true },
    wins: { type: Number, required: true },
    curstreak: { type: Number, required: true },
    maxstreak: { type: Number, required: true },
    avgAttempts: { type: Number, required: true },
    mintime: { type: Number, required: true },
    maxtime: { type: Number, required: true },
}, { _id: false });

const UserSchema = new Schema<IUserDocument>({
    username: { type: String, required: true, unique: true },
    deviceId: { type: String, required: false },
    passwordHash: { type: String, required: true },
    stats: StatsSchema,
    records: {
        termo: [GameSchema],
        dueto: [GameSchema],
        quarteto: [GameSchema]
    }
}, {
    collection: 'user',
    timestamps: false,
    versionKey: false,
});

const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);

export default UserModel;