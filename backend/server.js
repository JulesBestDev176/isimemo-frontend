require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration SMTP Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Vérifier la connexion SMTP au démarrage
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur connexion SMTP:', error);
  } else {
    console.log('✅ Serveur SMTP prêt à envoyer des emails');
  }
});

// Route d'envoi d'email
app.post('/api/send-email', async (req, res) => {
  const { to, prenom, tempPassword } = req.body;

  console.log(`📨 Tentative d'envoi à: ${to}`);

  if (!to || !prenom || !tempPassword) {
    return res.status(400).json({
      success: false,
      message: 'Paramètres manquants'
    });
  }

  // Version simplifiée du mail pour éviter les filtres anti-spam/limites
  const plainText = `
    Bonjour ${prenom},
    
    Votre compte ISIMemo a été créé.
    Email: ${to}
    Mot de passe temporaire: ${tempPassword}
    
    Veuillez changer votre mot de passe à la première connexion.
    
    L'équipe ISIMemo
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #1e3a5f;">Bienvenue sur ISIMemo</h2>
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Votre compte candidat a été créé avec succès.</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Email:</strong> ${to}</p>
        <p><strong>Mot de passe temporaire:</strong> <span style="font-size: 18px; color: #1e3a5f;">${tempPassword}</span></p>
      </div>
      <p><em>Note: Vous devrez changer ce mot de passe lors de votre première connexion.</em></p>
      <p>Cordialement,<br>L'équipe ISIMemo</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: to,
    subject: 'Identifiants ISIMemo',
    text: plainText,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé avec succès');
    res.json({
      success: true,
      messageId: info.messageId
    });
  } catch (error) {
    console.error('❌ ERREUR NODEMAILER:', error);
    
    // Si c'est une erreur de quota Google, on renvoie un message spécifique
    if (error.message.includes('550 5.4.5')) {
      return res.status(500).json({
        success: false,
        message: 'Quota Gmail dépassé ou envoi bloqué par Google. Veuillez réessayer plus tard ou utiliser un autre compte.',
        error: 'QUOTA_EXCEEDED'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Échec de l\'envoi de l\'email',
      error: error.message
    });
  }
});

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur email ISIMemo opérationnel' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════');
  console.log('   🚀 ISIMemo Email Server');
  console.log('═══════════════════════════════════════════════════');
  console.log(`   📧 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`   🔗 API: http://localhost:${PORT}/api/send-email`);
  console.log('═══════════════════════════════════════════════════');
});
