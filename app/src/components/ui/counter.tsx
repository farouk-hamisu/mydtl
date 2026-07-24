import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion'

// AnimatedCounter — counts up when in view.
export function AnimatedCounter({
  value, decimals = 0, prefix = '', suffix = '', duration = 1.8, className,
}: { value: number; decimals?: number; prefix?: string; suffix?: string; duration?: number; className?: string }) {
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, v => formatNum(v, decimals))
  const spring = useSpring(mv, { stiffness: 70, damping: 18 })

  useEffect(() => {
    spring.on('change', v => {})
    const controls = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] })
    return () => controls.stop()
  }, [value])

  return (
    <span className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

function formatNum(v: number, decimals: number) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v)
}
