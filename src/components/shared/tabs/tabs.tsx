import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs as CNTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { label: string; value: string; description?: string }[];
  children: React.ReactNode[];
}

export const Tabs = ({ tabs, children }: TabsProps) => {
  return (
    <CNTabs defaultValue="protocol">
      <TabsList>
        {tabs.map(({ label, value }) => (
          <TabsTrigger
            key={value}
            value={value}
            className={cn(
              value.includes("danger") &&
                "data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground text-destructive"
            )}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ label, value, description }, index) => (
        <TabsContent key={value} value={value}>
          <Card>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>{children[index]}</CardContent>
          </Card>
        </TabsContent>
      ))}
    </CNTabs>
  );
};
