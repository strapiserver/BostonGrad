declare module "framer-motion" {
  export type MotionValue<T = any> = {
    get: () => T;
    set: (value: T) => void;
    onChange: (callback: (value: T) => void) => () => void;
  };

  export const motion: any;
  export const AnimatePresence: any;

  export function useTransform(...args: any[]): any;
  export function useMotionValue<T = any>(initial: T): MotionValue<T>;
  export function useAnimation(): any;
}
