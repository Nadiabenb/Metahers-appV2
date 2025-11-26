import { motion } from "framer-motion";
import { FileText, Download, CheckSquare, FileSpreadsheet, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Resource = {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "checklist" | "template" | "spreadsheet" | "workbook";
  isPro: boolean;
  downloadUrl?: string;
};

type DownloadableResourcesProps = {
  experienceTitle: string;
  resources: Resource[];
  isProUser?: boolean;
};

const RESOURCE_ICONS = {
  pdf: FileText,
  checklist: CheckSquare,
  template: FileText,
  spreadsheet: FileSpreadsheet,
  workbook: FileText,
};

const RESOURCE_COLORS = {
  pdf: "text-red-500",
  checklist: "text-green-500",
  template: "text-blue-500",
  spreadsheet: "text-emerald-500",
  workbook: "text-purple-500",
};

export default function DownloadableResources({
  experienceTitle,
  resources,
  isProUser = false,
}: DownloadableResourcesProps) {
  if (resources.length === 0) return null;

  const handleDownload = (resource: Resource) => {
    if (!resource.downloadUrl) {
      console.log(`Downloading ${resource.title}...`);
      return;
    }
    
    const link = document.createElement('a');
    link.href = resource.downloadUrl;
    link.download = `${resource.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-serif font-bold mb-2">Resources & Templates</h3>
        <p className="text-foreground">
          Downloadable materials to help you apply what you've learned
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((resource, index) => {
          const Icon = RESOURCE_ICONS[resource.type];
          const colorClass = RESOURCE_COLORS[resource.type];
          const isLocked = resource.isPro && !isProUser;

          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`h-full ${isLocked ? 'opacity-75' : 'hover-elevate'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-1 ${colorClass}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </div>
                    </div>
                    {resource.isPro && (
                      <Badge variant={isLocked ? "secondary" : "outline"} className="gap-1">
                        {isLocked ? <Lock className="w-3 h-3" /> : null}
                        PRO
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleDownload(resource)}
                    disabled={isLocked}
                    className="w-full gap-2"
                    variant={isLocked ? "outline" : "default"}
                    data-testid={`button-download-${resource.id}`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Upgrade to Download
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download {resource.type.toUpperCase()}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {resources.some(r => r.isPro && !isProUser) && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold mb-1">Unlock All Resources</p>
                <p className="text-sm text-foreground">
                  Upgrade to Pro to download premium templates and workbooks
                </p>
              </div>
              <Button variant="default" data-testid="button-upgrade-for-resources">
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
