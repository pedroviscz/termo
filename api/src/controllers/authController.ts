import bcrypt from 'bcrypt';
import { Controller } from "../interfaces/Controller";
import userCollection from "../models/userModel";

const login: Controller = async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ message: "Username e senha são obrigatórios." });
  }

  const user = await userCollection.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: "Usuário não encontrado." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Senha incorreta." });
  }

  return res.status(200).json({
    user: {
      id: user._id,
      username: user.username
    }
  });
};

export default { login };