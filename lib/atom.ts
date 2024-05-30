import { atom } from 'jotai';
import { defaultEditorContent } from "@/lib/content";
import type { JSONContent } from 'novel';
export const generatedContent = atom<JSONContent | null>(defaultEditorContent);
export const initialEditorContent = atom<JSONContent | null>(defaultEditorContent);