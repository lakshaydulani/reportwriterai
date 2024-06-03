import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect } from 'react';

const Animation = ({ setWelcomeScreenVisible }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setWelcomeScreenVisible(false);
    }, 3000); // Duration for which the welcome screen is visible

    return () => clearTimeout(timer);
  }, [setWelcomeScreenVisible]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -100 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="fixed top-0 left-0 w-full h-full animation flex flex-col items-center justify-center text-white text-2xl z-50"
      >
        <Image src="/images/eylogo.png" alt="Logo" width={100} height={100} />
        <p className="mt-4">Welcome To EY Report Writer</p>
      </motion.div>
    </AnimatePresence>
  );
}

export default Animation;
