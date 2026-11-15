import { PREVIEW } from "@/lib/config";

/** While the form isn't connected to anything, say so at the top of the page. */
export function PreviewStrip() {
  if (!PREVIEW) return null;
  return (
    <div className="lp-preview">
      <p>Design preview. The form on this page does not send or save anything yet.</p>
    </div>
  );
}
