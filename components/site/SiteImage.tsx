import Image, { type ImageProps } from "next/image";
import { resolvePublicImageUrl } from "@/lib/uploads/stored-uploads";

type SiteImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

export function SiteImage({ src, alt = "", ...props }: SiteImageProps) {
  const resolvedSrc = resolvePublicImageUrl(src);
  const isStoredUpload = resolvedSrc.startsWith("/api/uploads/");

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      unoptimized={isStoredUpload || props.unoptimized}
    />
  );
}
