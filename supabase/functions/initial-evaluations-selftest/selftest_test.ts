import { assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { runSelfTest } from "./index.ts";

Deno.test("initial_evaluations save & read flow", async () => {
  const report = await runSelfTest();
  if (!report.ok) {
    console.error("Self-test steps:", report.steps);
  }
  assert(report.ok, "All save/read steps must succeed");
  for (const step of report.steps) {
    assert(step.ok, `Step failed: ${step.name} - ${step.detail ?? ""}`);
  }
});