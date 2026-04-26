import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/v5/$")({
  beforeLoad: ({ params }) => {
    const rest = params._splat ?? "";
    throw redirect({ href: `/v4/${rest}` });
  },
});
