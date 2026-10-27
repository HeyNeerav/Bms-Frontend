import { ArrowLeft } from "lucide-react";
import CreateBusinessForm from "@/components/forms/create-business-form";

export default function CreateBusinessPage() {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1280px] lg:grid-cols-[180px_1fr]">
      <aside className="hidden border-r border-border py-8 lg:flex lg:flex-col lg:px-4">
        <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
          Businesses
        </div>
        <div className="mt-auto flex items-center gap-2 px-2 text-xs text-muted-foreground">
          <ArrowLeft className="size-3" />
          Return to businesses
        </div>
      </aside>
      <CreateBusinessForm />
    </div>
  );
}
