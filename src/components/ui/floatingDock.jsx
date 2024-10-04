/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "../../lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from 'react-router-dom';
import { useRef, useState } from "react";

export const ChestCarousel = ({
  items,
  desktopClassName,
  mobileClassName,
  active
}) => {
  return (<>
    <FloatingDockDesktop items={items} className={desktopClassName} active={active} />
    <FloatingDockMobile items={items} className={mobileClassName} active={active} />
  </>);
};

const FloatingDockMobile = ({
  items,
  className,
  active
}) => {
  const [open, setOpen] = useState(false);
  return (
    (<div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2">
            {items.map((item, idx) => (
              active === item.title && <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}>
                <Link
                  href={item.href}
                  key={item.title}
                  className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
                  <div className="h-4 w-4">{item.icon}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center">
        <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>)
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  active
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    (<motion.div
      // onMouseMove={(e) => mouseX.set(e.pageX)}
      // onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden md:flex h-[15rem] border-2 w-full mx-auto gap-4 items-center justify-center rounded-2xl bg-gray-50 dark:bg-neutral-900 px-4 pb-3",
        className
      )}>
      {items.map((item) => (
        active === item.title && (<IconContainer mouseX={mouseX} key={item.title} active={active} {...item} />
      )))}
    </motion.div>)
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}) {
  let ref = useRef(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [-150, 0, 150]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [-150, 0, 150]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [-150, 0, 150]);
  let heightTransformIcon = useTransform(distance, [-150, 0, 150], [-150, 0, 150]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  // const [hovered, setHovered] = useState(false);

  return (
    (<Link to={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        // onMouseEnter={() => setHovered(true)}
        // onMouseLeave={() => setHovered(false)}
        className="border-2 border-red-500 aspect-square rounded-2 bg-gray-200 dark:bg-neutral-800 flex items-center justify-center relative top-[-1.4rem]">
        <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-2 py-0.5 text-3xl font-bold whitespace-pre rounded-md bg-yellow-100 border-4 dark:bg-neutral-800 border-red-500 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 top-[10rem] w-fit">
              {title}
            </motion.div>
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center">
          {icon}
        </motion.div>
      </motion.div>
    </Link>)
  );
}