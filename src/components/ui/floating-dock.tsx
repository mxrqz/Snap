import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FloatingDockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface FloatingDockProps {
  items: FloatingDockItem[];
  className?: string;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  items,
  className,
}) => {
  return (
    <div
      className={cn(
        "mx-auto flex h-16 items-end gap-4 rounded-2xl bg-gray-900/80 backdrop-blur-md px-4 pb-3 border border-gray-700/50",
        className
      )}
    >
      {items.map((item, idx) => (
        <IconContainer key={idx} {...item} />
      ))}
    </div>
  );
};

function IconContainer({ title, icon, href, onClick }: FloatingDockItem) {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const mouseDistance = e.clientX - centerX;
    distance.set(mouseDistance);
  };

  const handleMouseLeave = () => {
    distance.set(0);
    setHovered(false);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.open(href, '_blank');
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="relative flex aspect-square cursor-pointer items-center justify-center rounded-full bg-gray-800/60 hover:bg-gray-700/80 transition-colors duration-200"
    >
      <motion.div
        className="flex items-center justify-center text-white"
        animate={{ scale: hovered ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {icon}
      </motion.div>
      
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 2, x: "-50%" }}
          className="absolute left-1/2 top-[-40px] whitespace-pre rounded-md border bg-gray-900 px-2 py-0.5 text-xs text-white border-gray-700"
        >
          {title}
        </motion.div>
      )}
    </motion.div>
  );
}