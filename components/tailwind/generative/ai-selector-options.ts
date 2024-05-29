import { ArrowDownWideNarrow, CheckCheck, RefreshCcwDot, StepForward, WrapText } from "lucide-react";

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
  