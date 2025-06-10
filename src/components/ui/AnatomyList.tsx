import { ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./sidebar.tsx";
import {
  ChevronRight,
  Brain,
  Eye,
  Ear,
  Heart,
  TreesIcon as Lungs,
  StickerIcon as Stomach,
  Bone,
  Hand,
  Footprints,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
// Anatomy data structure
const anatomyData = {
  head: {
    title: "Head",
    icon: Brain,
    items: [
      { title: "Brain", icon: Brain },
      { title: "Eyes", icon: Eye },
      { title: "Ears", icon: Ear },
      { title: "Skull", icon: Bone },
      { title: "Jaw", icon: Bone },
      { title: "Nose", icon: Brain },
    ],
  },
  torso: {
    title: "Torso",
    icon: Heart,
    items: [
      { title: "Heart", icon: Heart },
      { title: "Lungs", icon: Lungs },
      { title: "Stomach", icon: Stomach },
      { title: "Liver", icon: Stomach },
      { title: "Kidneys", icon: Stomach },
      { title: "Ribs", icon: Bone },
      { title: "Spine", icon: Bone },
    ],
  },
  arms: {
    title: "Arms",
    icon: Hand,
    items: [
      { title: "Shoulders", icon: Bone },
      { title: "Upper Arm", icon: Bone },
      { title: "Elbow", icon: Bone },
      { title: "Forearm", icon: Bone },
      { title: "Wrist", icon: Hand },
      { title: "Hands", icon: Hand },
      { title: "Fingers", icon: Hand },
    ],
  },
  legs: {
    title: "Legs",
    icon: Footprints,
    items: [
      { title: "Hips", icon: Bone },
      { title: "Thigh", icon: Bone },
      { title: "Knee", icon: Bone },
      { title: "Shin", icon: Bone },
      { title: "Calf", icon: Bone },
      { title: "Ankle", icon: Footprints },
      { title: "Feet", icon: Footprints },
      { title: "Toes", icon: Footprints },
    ],
  },
};

export default function AnatomyList() {
  const [open, setOpen] = useState(false);
  const expandButtonRef = useRef<HTMLSpanElement>(null);
  const handleExpand = useCallback(() => {
    if (expandButtonRef.current) {
      // Logic to expand or collapse the part selector
      console.log("Expand button clicked");
      setOpen((prev) => !prev);
    }
  }, [expandButtonRef]);
  const onPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    e.preventDefault();
    handleExpand();
  };

  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  useEffect(() => {
    console.log("Selected part:", selectedPart);
  }, [selectedPart]);

  return (
    <Sidebar className="pointer-events-auto " side="right">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Anatomy Explorer</span>
            <span className="text-xs text-muted-foreground">
              Interactive Learning
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {Object.entries(anatomyData).map(([key, section]) => (
          <Collapsible key={key} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-950 dark:hover:text-orange-300"
              >
                <CollapsibleTrigger
                  className="flex w-full items-center justify-between"
                  onPointerEnter={() => setSelectedPart(key)}
                  onPointerLeave={() => setSelectedPart(null)}
                  onPointerDown={onPointerDown}
                >
                  <div className="flex items-center gap-2">
                    <section.icon className="h-4 w-4" />
                    {section.title}
                  </div>
                  <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent className="ml-4">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem
                        key={item.title}
                        onPointerEnter={() => setSelectedPart(item.title)}
                        onPointerLeave={() => setSelectedPart(null)}
                      >
                        <SidebarMenuButton className="hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-950 dark:hover:text-orange-300 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-800 dark:data-[active=true]:bg-orange-900 dark:data-[active=true]:text-orange-200">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      {selectedPart}
      <SidebarRail />
    </Sidebar>
  );
}
