import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCompletion } from "ai/react";
import { useAtom } from "jotai";
import { isEditorLoading as isEditorLoadingAtom } from "@/lib/atom";

const useCompletionJotai = (id: string = "novel"): any => {
  const [isEditorLoading, setIsEditorLoading] = useAtom(isEditorLoadingAtom);

  const { completion, complete, isLoading } = useCompletion({
    // id: id,
    api: "/api/generate",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  useEffect(() => {
    console.log("setting global isLoading",isLoading);
    setIsEditorLoading(isLoading);
  }, [isLoading]);

  return { completion, complete, isLoading };
};

export default useCompletionJotai;
