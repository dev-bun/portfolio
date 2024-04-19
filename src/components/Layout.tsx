import { motion } from "framer-motion";
import { ReactNode } from "react";

const Layout = ({ children, className }: { children: ReactNode, className?: any }) => (
  <motion.div
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
    }}
  >
    {children}
  </motion.div>
);
export default Layout;