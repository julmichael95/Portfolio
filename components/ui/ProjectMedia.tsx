"use client";

import Image from "next/image";
import { useState } from "react";
import { Placeholder } from "./Placeholder";
import type { ProjectImage } from "@/content/projects/_types";

/**
 * ProjectMedia — the single source of truth for all project image rendering.
 *
 * Usage (fill mode — parent div controls aspect ratio):
 *   <div className="relative aspect-[16/10]">
 *     <ProjectMedia image={project.hero} sizes="50vw" />
 *   </div>
 *
 * Usage (intrinsic diagram mode — natural dimensions):
 *   <ProjectMedia image={diagram} intrinsic />
 *
 * Fallback behaviour:
 *   src === ""          → renders Placeholder (expected during development)
 *   src set, 404/error  → graceful onError fallback to Placeholder
 *   src set, loads OK   → renders next/image with optimisation
 */

interface ProjectMediaProps {
  image: ProjectImage;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** If true, renders at intrinsic dimensions rather than fill. Use for diagrams. */
  intrinsic?: boolean;
}

export function ProjectMedia({
  image,
  sizes = "100vw",
  priority = false,
  className = "",
  intrinsic = false,
}: ProjectMediaProps) {
  const [errored, setErrored] = useState(false);

  // No src set — show placeholder (expected dev state)
  if (!image.src || errored) {
    return <Placeholder label={image.placeholder} className={className} />;
  }

  if (intrinsic) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.src}
        alt={image.alt}
        className={`w-full h-auto ${className}`}
        onError={() => setErrored(true)}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      className={`object-cover ${className}`}
      sizes={sizes}
      priority={priority}
      onError={() => setErrored(true)}
    />
  );
}
