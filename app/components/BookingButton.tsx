"use client";

import { CTAButton } from "./ui/Typography";

interface BookingButtonProps {
  variant?: "primary" | "small";
  label?: string;
  onClick?: () => void;
}

export default function BookingButton({
  variant = "primary",
  label = "View Rooms",
  onClick,
}: BookingButtonProps) {
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
    <CTAButton
      variant="primary"
      size={variant === "primary" ? "md" : "sm"}
      onClick={handleClick}
    >
      {label}
    </CTAButton>
  );
}
