import NextImage, { type ImageProps } from "next/image";
import { assetUrl } from "@/lib/assetUrl";

function resolveSrc(src: ImageProps["src"]): ImageProps["src"] {
  if (typeof src === "string" && src.startsWith("/")) {
    return assetUrl(src);
  }
  return src;
}

/**
 * Next.js Image with optional CDN prefix for same-origin `/...` paths from `/public`
 * (see NEXT_PUBLIC_IMAGES_CDN_URL / NEXT_PUBLIC_ASSET_CDN_URL).
 */
export default function SiteImage(props: ImageProps) {
  return <NextImage {...props} src={resolveSrc(props.src)} />;
}
