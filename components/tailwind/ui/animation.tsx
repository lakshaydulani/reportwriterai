import { motion, AnimatePresence } from "framer-motion"

const Animation = () => {
  return (
    <AnimatePresence>
        <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -100 }}
        transition={{ duration: 1, delay: 0 }}
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            zIndex: 1000
        }}
        >
            Welcome To EY Report Writting
        </motion.div>
    </AnimatePresence>
  )
}

export default Animation