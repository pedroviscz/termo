import { Controller } from "../interfaces/Controller";
import userCollection from "../models/userModel";
import bcrypt from "bcrypt";

// POST - CRIA UM NOVO USUÁRIO
const create: Controller = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: "Username e senha são obrigatórios." });
    }

    const existing = await userCollection.findOne({ username });
    if (existing) {
        return res.status(409).json({ msg: "Esse username já está em uso." });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await userCollection.create({
            username,
            passwordHash,
            stats: {
                histo: [],
                games: 0,
                wins: 0,
                curstreak: 0,
                maxstreak: 0,
                avgAttempts: 0,
                mintime: 0,
                maxtime: 0
            }
        });

        return res.status(201).json({
            id: newUser._id,
            username: newUser.username,
            msg: "Usuário criado com sucesso."
        });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json({ msg: "Erro interno no servidor." });
    }
};

// POST - CADASTRA deviceId
const registerDeviceId: Controller = async (req, res) => {
    const { username, deviceId } = req.body;

    if (!username || !deviceId) return res.status(400).json({ message: 'Usuário ou deviceId não recebidos' })

    const user = await userCollection.findOne({ username });
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

    user.deviceId = deviceId;
    await user.save();

    return res.status(200).json({ msg: 'Dispositivo registrado com sucesso' });
};

// DELETE - Remove usuário
const remove: Controller = async (req, res) => {
    const { username } = req.params;

    const deleted = await userCollection.findOneAndDelete({ username });

    if (!deleted) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    return res.status(200).json({ msg: "Usuário deletado com sucesso." });
};

// PUT - Atualiza senha
const updatePassword: Controller = async (req, res) => {
    const { username } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ msg: "Nova senha é obrigatória." });
    }

    const user = await userCollection.findOne({ username });
    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;

    await user.save();

    return res.status(200).json({ msg: "Senha atualizada com sucesso." });
};

// GET - BUSCAR TODOS OS USUÁRIOS
const getAllUsers: Controller = async (req, res) => {

    const users = await userCollection.find({}, { passwordHash: 0 }).lean();

    if (!users || users.length === 0) {
        return res.status(404).json({ msg: "Nenhum usuário encontrado." });
    }

    return res.json(users);
};

// GET - Buscar usuário por username
const getByUsername: Controller = async (req, res) => {
    const { username } = req.params;

    const user = await userCollection.findOne({ username }, { passwordHash: 0 });

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    return res.status(200).json(user);
};

// PUT - Atualizar deviceId
const updateDeviceId: Controller = async (req, res) => {
    const { username } = req.params;
    const { deviceId } = req.body;

    const user = await userCollection.findOne({ username });
    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    user.deviceId = deviceId;
    await user.save();

    return res.status(200).json({ msg: "Device ID atualizado com sucesso." });
};

// PATCH - Atualizar estatísticas
const updateStats: Controller = async (req, res) => {
    const { username } = req.params;
    const { stats } = req.body;

    const user = await userCollection.findOne({ username });
    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    user.stats = { ...user.stats, ...stats };
    await user.save();

    return res.status(200).json({ msg: "Estatísticas atualizadas com sucesso." });
};

export default {
    create,
    remove,
    registerDeviceId,
    updatePassword,
    getByUsername,
    updateDeviceId,
    updateStats,
    getAllUsers
};