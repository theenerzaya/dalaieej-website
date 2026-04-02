"use client";

interface BookingButtonProps {
  variant?: "primary" | "small";
  label?: string;
  onClick?: () => void;
}

export default function BookingButton({ 
  variant = "primary", 
  label = "View Rooms",
  onClick
}: BookingButtonProps) {
  const baseClasses = "bg-surface-alt text-leaf font-serif uppercase tracking-widest hover:bg-white transition-all cursor-pointer";
  
  const variantClasses = variant === "primary" 
    ? "px-8 py-3" 
    : "px-6 py-3 text-sm";

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const roomsSection = document.getElementById("rooms");
      if (roomsSection) {
        roomsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses}`}
    >
      {label}
    </button>
  );
}
