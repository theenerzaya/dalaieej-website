import NextImage, { type ImageProps } from "next/image";
import { assetUrl } from "@/lib/assetUrl";

function resolveSrc(src: ImageProps["src"]): ImageProps["src"] {
  if (typeof src === "string" && src.startsWith("/")) {
    return assetUrl(src);
  }
  return src;
}

/** Next.js Image for same-origin `/public` assets. */
export default function SiteImage(props: ImageProps) {
  return <NextImage {...props} src={resolveSrc(props.src)} />;
}
