
import { motion } from 'framer-motion';

const partners = [
  { name: 'Huawei', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Huawei.svg/1200px-Huawei.svg.png' },
  { name: 'Cisco', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/1200px-Cisco_logo_blue_2016.svg.png' },
  { name: 'Microsoft', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png' },
  { name: 'Google', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png' }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Partners = () => {
  return (
    <section className="section bg-gray-50">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h2 
          className="text-3xl font-bold mb-4 text-navy"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Nos Partenaires
        </motion.h2>
        <motion.p 
          className="text-lg text-navy-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Nous collaborons avec les leaders mondiaux du secteur technologique.
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {partners.map((partner, index) => (
          <motion.div 
            key={index}
            className="bg-white p-8 rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
            variants={item}
            whileHover={{ y: -5 }}
          >
            <img 
              src={partner.image} 
              alt={partner.name} 
              className="max-h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Partners;
