import { Folder, Wrench } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface ProjectContextBarProps {
  projectName: string;
  client: string;
  toolName?: string;
  step?: string;
}

export function ProjectContextBar({
  projectName,
  client,
  toolName,
  step,
}: ProjectContextBarProps) {
  return (
    <div className="-mx-6 mb-5 border-b bg-surface/95 px-6 py-2 backdrop-blur lg:-mx-8 lg:px-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <Link
          to="/projects/$projectId"
          params={{ projectId: "spring-campaign-optimization" }}
          className="inline-flex items-center gap-1.5 text-foreground hover:underline"
        >
          <Folder className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">{projectName}</span>
        </Link>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{client}</span>
        {toolName && (
          <>
            <span className="text-muted-foreground">·</span>
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
              {toolName}
            </span>
          </>
        )}
        {step && (
          <>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">Шаг: {step}</span>
          </>
        )}
      </div>
    </div>
  );
}
