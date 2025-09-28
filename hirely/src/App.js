import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import './App.css';
import CVBuilder from './CVBuilder';
import logo from './logos/mainLogo.png';

function App() {
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);

  return (
    <div className={`App ${isEditingTemplate ? 'editing-mode' : ''}`}>
      <AnimatePresence>
        {!isEditingTemplate && (
          <motion.header
            className="App-header"
            initial={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ 
              opacity: 0, 
              y: -100,
              height: 0,
              transition: { duration: 0.4, ease: "easeInOut" }
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <motion.img 
              className='header-logo' 
              src={logo} 
              alt='CV Builder Logo'
              initial={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.3 } }}
            />
          </motion.header>
        )}
      </AnimatePresence>
      
      <motion.main
        className={isEditingTemplate ? 'full-height' : ''}
        layout
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <CVBuilder onEditingStateChange={setIsEditingTemplate} />
      </motion.main>
    </div>
  );
}

export default App;