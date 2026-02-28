"use client";

import { type PropsWithChildren } from "react";
import { useDidMount } from "@/hooks/useDidMount";

function RootInner({ children }: PropsWithChildren) {
  return <div style={{ minHeight: "100vh" }}>{children}</div>;
}

export function Root(props: PropsWithChildren) {
  const didMount = useDidMount();
  return didMount ? <RootInner {...props} /> : <div>Loading...</div>;
}
