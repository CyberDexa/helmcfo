import { NextResponse } from "next/server";
import { controls, collectEvidence, getControlsSummary } from "@/lib/security/soc2/controls";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const controlId = searchParams.get("controlId");

  if (controlId) {
    const control = controls.find((c) => c.id === controlId);
    if (!control) return NextResponse.json({ error: "Control not found" }, { status: 404 });
    const evidence = collectEvidence(controlId);
    return NextResponse.json({ control, evidence });
  }

  const summary = getControlsSummary();
  return NextResponse.json({ summary, controls: controls.map(({ id, category, criteria, title, status, owner }) => ({ id, category, criteria, title, status, owner })) });
}
