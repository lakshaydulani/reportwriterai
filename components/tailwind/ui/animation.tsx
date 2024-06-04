import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect } from 'react';

const Animation = () => {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setWelcomeScreenVisible(false);
  //   }, 3000); // Duration for which the welcome screen is visible

  //   return () => clearTimeout(timer);
  // }, [setWelcomeScreenVisible]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100vh" }}
        transition={{ duration: 0.75, delay: 2 }}
        className="fixed top-0 left-0 w-full h-full animation flex flex-col items-center justify-center text-white text-2xl z-50"
      >
        <Image src="/images/eylogo.png" alt="Logo" width={100} height={100} />
        <p className="mt-3 text-3xl">AI Report Writer</p>
        <p className="mt-3 text-sm">Preparing the editor..</p>
      </motion.div>
    </AnimatePresence>
  );
}

export default Animation;
