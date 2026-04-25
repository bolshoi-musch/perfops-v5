import { Link } from "@tanstack/react-router";
import { Folder, Boxes } from "lucide-react";

interface ProjectContextBarV3Props {
  projectName: string;
  projectId: string;
  productName?: string;
  step?: string;
}

export function ProjectContextBarV3({
  projectName,
  projectId,
  productName,
  step,
}: ProjectContextBarV3Props) {
  return (
    <div className="-mx-6 mb-5 border-b bg-surface/95 px-6 py-2 backdrop-blur lg:-mx-8 lg:px-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <Link
          to="/v3/projects/$projectId"
          params={{ projectId }}
          className="inline-flex items-center gap-1.5 text-foreground hover:underline"
        >
          <Folder className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">{projectName}</span>
        </Link>
        {productName && (
          <>
            <span className="text-muted-foreground">·</span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Boxes className="h-3.5 w-3.5" />
              {productName}
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
