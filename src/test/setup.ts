import "@testing-library/jest-dom";

// jsdom doesn't implement Pointer Events APIs that Radix Select / Dialog rely
// on. Patch the prototype with minimal no-op stubs so click interactions don't
// throw inside Radix primitives during tests.
if (typeof window !== "undefined") {
  const proto = window.HTMLElement.prototype as unknown as Record<string, unknown>;
  if (!proto.hasPointerCapture) proto.hasPointerCapture = () => false;
  if (!proto.setPointerCapture) proto.setPointerCapture = () => {};
  if (!proto.releasePointerCapture) proto.releasePointerCapture = () => {};
  if (!proto.scrollIntoView) proto.scrollIntoView = () => {};
}
