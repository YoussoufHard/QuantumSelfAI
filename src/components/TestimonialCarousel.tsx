import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Marie Dubois',
      role: 'Entrepreneur',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'Quantum Self AI a transformé ma façon de prendre des décisions. Les conseils de mon futur moi sont incroyables !',
      rating: 5,
      version: 'Futur Sage'
    },
    {
      id: 2,
      name: 'Thomas Rodriguez',
      role: 'Étudiant en Master',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'Parler avec mon moi à 16 ans m\'a redonné la motivation que j\'avais perdue. C\'est magique !',
      rating: 5,
      version: 'Passé Motivé'
    },
    {
      id: 3,
      name: 'Sophie Martin',
      role: 'Coach de vie',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'J\'utilise Quantum Self pour mes propres sessions de coaching. Les insights sont d\'une profondeur remarquable.',
      rating: 5,
      version: 'Parallèle Success'
    },
    {
      id: 4,
      name: 'Alexandre Chen',
      role: 'Développeur Senior',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'L\'interface est intuitive et les conversations semblent vraiment authentiques. Une révolution !',
      rating: 5,
      version: 'Présent Optimisé'
    },
    {
      id: 5,
      name: 'Camille Leroy',
      role: 'Psychologue',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'Un outil puissant pour l\'introspection. Mes patients adorent explorer leurs différentes perspectives.',
      rating: 5,
      version: 'Parallèle Zen'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ce que disent nos utilisateurs
        </h2>
        <p className="text-xl text-slate-300">
          Plus de 10,000 personnes transforment leur vie avec Quantum Self AI
        </p>
      </div>

      <div className="relative h-80 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 h-full flex flex-col justify-center border border-white/20">
              <div className="flex items-center gap-1 mb-6 justify-center">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <blockquote className="text-xl text-white text-center mb-6 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                />
                <div className="text-center">
                  <div className="font-bold text-white text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-slate-300">
                    {testimonials[currentIndex].role}
                  </div>
                  <div className="text-sm text-cyan-400 font-medium">
                    Version: {testimonials[currentIndex].version}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prevTestimonial}
          className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-cyan-400 scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextTestimonial}
          className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;