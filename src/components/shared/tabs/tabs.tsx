import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
  cardDisplay?: boolean;
}

export const Tabs = ({ tabs, children, cardDisplay = true }: TabsProps) => {
  const filteredChildren = children.filter((child) => child);

  return (
    <CNTabs defaultValue={tabs[0].value}>
      <TabsList>
        {tabs.map(({ label, value }) => (
          <TabsTrigger key={value} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ value, description }, index) => (
        <TabsContent key={value} value={value}>
          <Card className={cardDisplay ? "" : "border-0 shadow-none"}>
            {description && (
              <CardHeader className={cn("p-1", cardDisplay ? "" : "px-0")}>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            )}
            <CardContent className={cardDisplay ? "" : "p-0"}>
              {filteredChildren[index]}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </CNTabs>
  );
};
