import { ArrowDownWideNarrow, CheckCheck, RefreshCcwDot, WrapText,Atom, Bug, AlignJustify, FerrisWheel, SquareAsterisk } from "lucide-react";

export const aiOptions = [
    {
      value: "improve",
      label: "Improve writing",
      icon: RefreshCcwDot,
    },
  
    {
      value: "fix",
      label: "Fix grammar",
      icon: CheckCheck,
    },
    {
      value: "shorter",
      label: "Make shorter",
      icon: ArrowDownWideNarrow,
    },
    {
      value: "longer",
      label: "Make longer",
      icon: WrapText,
    },
  ];

export const sectionOptions = [
  {
    label: "detailedobservation",
    value: "Detailed observation",
    icon: FerrisWheel
  },
  {
    label: "background",
    value: "Background",
    icon: Atom
  },
  {
    label: "issuesummary",
    value: "Issue Summary",
    icon: Bug
  },
  {
    label: "header",
    value: "Header",
    icon: AlignJustify
  },
  {
    label: "riskimpact",
    value: "Risk/ Impact",
    icon: SquareAsterisk
  },
  {
    label: "rootcause",
    value: "Root cause",
    icon: SquareAsterisk
  },
  {
    label: "recommendation",
    value: "Recommendation",
    icon: SquareAsterisk
  },
  {
    label: "managementcomment",
    value: "Management Comment",
    icon: SquareAsterisk
  },
];
  