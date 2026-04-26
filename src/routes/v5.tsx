import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/v5")({
  beforeLoad: () => {
    throw redirect({ to: "/v4" });
  },
});
