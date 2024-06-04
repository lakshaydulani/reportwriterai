import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CrazySpinner from "@/components/tailwind/ui/icons/crazy-spinner";

const Animation = () => {

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100vh" }}
        transition={{ duration: 0.75, delay: 20 }}
        className="fixed top-0 left-0 w-full h-full animation flex flex-col items-center justify-center text-white z-50"
      >
        <Image src="/images/eylogo.png" alt="Logo" width={100} height={100} />
        <p className="mt-5 text-3xl">AI Report Writer</p>
        <p className="mt-3 text-sm">Preparing the editor</p>
        <p className="mt-5"><CrazySpinner color="white" /></p>

      </motion.div>
    </AnimatePresence>
  );
}

export default Animation;
