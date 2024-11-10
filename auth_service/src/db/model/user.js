// userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // 'admin' ou 'user'
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Créer un utilisateur admin par défaut si la collection est vide
userSchema.statics.initializeAdmin = async function () {
  const adminExists = await this.findOne({ role: 'admin' });
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin', 10);
    await this.create({ username: 'admin', password: hashedPassword, role: 'admin' });
    console.log('[+] Admin user created with username: admin, password: admin');
  }
};

const User = mongoose.model('User', userSchema);

export default User;
