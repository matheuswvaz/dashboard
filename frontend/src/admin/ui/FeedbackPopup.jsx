import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const FeedbackPopup = ({ feedback }) => {
  const { type, message } = feedback;
   
  const iconMap = {
    success: "✔",
    error: "⚠",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className={`app-feedback-popup ${type}`}
          role="alert"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {iconMap[type]} {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackPopup;
