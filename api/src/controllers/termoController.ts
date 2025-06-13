import { Controller } from "../interfaces/Controller";
import { TermoPayload } from "../interfaces/GameData";
import userCollection from "../models/userModel";

// POST - CRIA UM NOVO REGISTRO DE TERMO
const create: Controller = async (req, res) => {
  const data: TermoPayload = req.body;

  console.dir(data, { depth: null, colors: true})

  if (!data.termo || !data.termo.state?.[0]) {
    return res.status(400).json({ msg: "Dados do termo ausentes ou malformados" });
  }

  const curday = data.termo.state[0].curday;

  if (curday == null || typeof curday !== 'number') {
    return res.status(400).json({ msg: "Campo 'curday' ausente ou inválido" });
  }

  if (data.termo.state[0].curRow !== 1) {
    return res.status(400).json({ msg: "O registro só pode acontecer na primeira linha" });
  }

  const existing = await termoCollection.findOne({ curday: curday });

  if (existing) {
    if (existing.state[0].gameOver === 1) {
      return res.status(409).json({
        msg: `Registro do dia ${curday} já existe e já está encerrado.`
      });
    }

    // Atualiza como encerrado sem vitória
    await termoCollection.updateOne(
      { _id: existing._id },
      { $set: { 'state.0.won': 0, 'state.0.gameOver': 1 } }
    );

    return res.status(409).json({
      msg: `Registro do dia ${curday} já existe e foi marcado como encerrado sem vitória.`
    });
  }


  const newTermo = await termoCollection.create({
    curday: curday,
    ...data.termo
  });

  return res.status(201).json(newTermo);
};

// GET - RETORNA TODOS OS REGISTROS
const getAllRecords: Controller = async (req, res) => {

  const records = await termoCollection.find().lean();

  if (!records || records.length === 0) {
    return res.status(404).json({ msg: "Nenhum termo encontrado." });
  }

  return res.json(records);
};

// PUT - ATUALIZA O REGISTRO DE UM TERMO
const update: Controller = async (req, res) => {
  const data: TermoPayload = req.body;

  if (!data.termo || !data.termo.state?.[0]) {
    return res.status(400).json({ msg: "Dados do termo ausentes ou malformados" });
  }

  const curday = data.termo.state[0].curday;

  const existing = await termoCollection.findOne({ curday: curday });

  if (!existing) {
    return res.status(404).json({ msg: `Registro do dia ${curday} não encontrado.` });
  }

  // bloqueia se o jogo já foi encerrado
  if (existing.state[0].gameOver === 1) {
    return res.status(403).json({ msg: "O jogo já foi finalizado. Não é possível atualizar." });
  }

  const updated = await termoCollection.findOneAndUpdate(
    { curday: curday },
    { $set: { curday: curday, ...data.termo } },
    { new: true }
  );

  return res.status(200).json(updated);
};

// GET - PEGA UM REGISTRO DO TERMO PELO curday
const getByCurday: Controller = async (req, res) => {
  const { curday } = req.params;

  const termo = await termoCollection.findOne({ curday: Number(curday) });

  if (termo) return res.json(termo);

  return res.status(404).json({ msg: "Não foi possível encontrar o termo" });
};

// GET - VERIFICA SE UM CURDAY JÁ FOI CADASTRADO
const verifyCurdayExistance: Controller = async (req, res) => {
  const { curday } = req.params;

  const exists = await termoCollection.exists({ curday: Number(curday) });

  return res.json({ exists: exists });
};

// DELETE - DELETA UM REGISTRO PELO CURDAY
const deleteByCurday: Controller = async (req, res) => {
  const { curday } = req.params;

  const exists = await termoCollection.exists({ curday: Number(curday) });

  if (!exists) {
    return res.status(404).json({ msg: "Registro não encontrado" });
  }

  await termoCollection.findOneAndDelete({ curday: Number(curday) });

  return res.status(200).json({ msg: "Termo deletado com sucesso" });
};

export default {
  create,
  getAll: getAllRecords,
  getByCurday,
  update,
  verifyCurdayExistance,
  delete: deleteByCurday
};