import { atom } from 'jotai';
import { defaultEditorContent } from "@/lib/content";
import type { JSONContent } from 'novel';
export const generatedContent = atom<JSONContent | null>(defaultEditorContent);
export const initialContent = atom<JSONContent | null>(defaultEditorContent);