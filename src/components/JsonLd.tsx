"use client";

import { useMemo } from "react";
import type { JsonLdThing } from "@/lib/seo";

export function JsonLd({ data }: { data: JsonLdThing | JsonLdThing[] }) {
  const json = useMemo(() => JSON.stringify(data), [data]);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

