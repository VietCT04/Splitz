import Image from "next/image";

type Props = {
  /** override if you ever want a different pic */
  src?: string;
  /** pixel size of the square */
  size?: number;
  /** square by default (no circles) */
  rounded?: "none" | "sm" | "md" | "lg" | "xl";
  alt?: string;
  className?: string;
};

export default function Avatar({
  src = "/avatar.jpg",
  size = 32,
  rounded = "lg",
  alt = "Avatar",
  className = "",
}: Props) {
  const round = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
  }[rounded];

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`${round} object-cover ${className}`}
    />
  );
}
