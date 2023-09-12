import { createCtx } from "@/utils/ctx-helper"
import { useSearchParams } from "next/navigation";


const [useDialogueContext, DialogueProvider] = createCtx<{

}>()


const DialogueContext = ({ children }: { children: React.ReactElement }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const scene = searchParams.get('scene');
}
