
import { useState } from 'react';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }
  };

  return (
    <section className="section bg-gradient-to-br from-primary-50 to-blue-50" id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-navy">Contactez-nous</h2>
          <p className="text-lg mb-8 text-navy-700">
            Des questions sur la plateforme ISIMemo ? Nous sommes là pour vous aider.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-primary">location_on</span>
              </div>
              <div>
                <h3 className="font-semibold text-navy">Adresse</h3>
                <p className="text-navy-700">123 Rue de l'ISI, Dakar, Sénégal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-primary">email</span>
              </div>
              <div>
                <h3 className="font-semibold text-navy">Email</h3>
                <p className="text-navy-700">contact@isimemo.edu</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-primary">phone</span>
              </div>
              <div>
                <h3 className="font-semibold text-navy">Téléphone</h3>
                <p className="text-navy-700">+221 33 123 45 67</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 rounded-xl shadow-xl"
        >
          {submitted ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <span className="material-icons text-green-500 text-4xl">check_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-navy mb-4">Message envoyé !</h3>
              <p className="text-navy-700">
                Merci de nous avoir contacté. Notre équipe vous répondra dans les plus brefs délais.
              </p>
              <button 
                onClick={() => setSubmitted(false)} 
                className="mt-6 text-primary hover:text-primary-700 font-medium flex items-center gap-2 mx-auto"
              >
                <span className="material-icons">refresh</span>
                Envoyer un autre message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-navy-800 font-medium mb-2">Nom</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-md border ${errors.name ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="Votre nom"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-navy-800 font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-md border ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="Votre email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-navy-800 font-medium mb-2">Sujet</label>
                <select 
                  id="subject" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-md border ${errors.subject ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white`}
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="information">Demande d'information</option>
                  <option value="probleme">Signaler un problème</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="autre">Autre</option>
                </select>
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-navy-800 font-medium mb-2">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-md border ${errors.message ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none`}
                  placeholder="Votre message"
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
              
              <motion.button 
                type="submit" 
                className="btn-primary w-full py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Envoyer le message
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
