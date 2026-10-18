import { describe, it, expect, vi, beforeEach } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createContainer, type BoxNode } from "@/lib/box-model";
import INSPECTOR from "@/config/inspector.json";

/**
 * MS-5b-b · Background → Video in the Inspector (BATCH LE-5). Scenarios: tests/features/components/website/background-video.feature
 * ("In the builder"). The store is stubbed here (jsdom has no IndexedDB); the real one is unit-guarded in media-store.test.ts and
 * driven HEADED in scripts/uat/uat-le5-headed.js, with a real file.
 */
const store = vi.hoisted(() => ({ result: { ref: `media:${"d".repeat(64)}.mp4` } as { ref: string } | { error: string } }));
vi.mock("@/lib/media-store", async (orig) => ({ ...(await orig<typeof import("@/lib/media-store")>()), putMedia: vi.fn(async () => store.result), mediaUrl: vi.fn(async () => "blob:x") }));
import { BackgroundVideoControls, CanvasBgVideo } from "@/components/website/box/BackgroundVideo";

const W = INSPECTOR.bgVideo;
function Harness({ initial = {} as Partial<BoxNode>, seen }: { initial?: Partial<BoxNode>; seen: (n: BoxNode) => void }) {
  const [node, setNode] = useState<BoxNode>({ ...createContainer("column"), id: "s", ...initial } as BoxNode);
  seen(node);
  return <BackgroundVideoControls node={node} onPatch={(p) => setNode((n) => ({ ...n, ...p }))} />;
}
const mount = (initial?: Partial<BoxNode>) => { let last: BoxNode | null = null; render(<Harness initial={initial} seen={(n) => { last = n; }} />); return () => last!; };

beforeEach(() => { store.result = { ref: `media:${"d".repeat(64)}.mp4` }; });

describe("Background → Video, uploaded", () => {
  it("the upload control is a labelled button that opens a file picker for mp4 / webm", () => {
    mount();
    expect(screen.getByRole("button", { name: W.upload })).toBeInTheDocument();
    expect(screen.getByLabelText(W.upload, { selector: "input" })).toHaveAttribute("accept", "video/mp4,video/webm");
  });
  it("a picked file is stored and the block keeps only its name", async () => {
    const node = mount();
    fireEvent.change(screen.getByLabelText(W.upload, { selector: "input" }), { target: { files: [new File(["x"], "loop.mp4", { type: "video/mp4" })] } });
    await waitFor(() => expect(node().bgVideo).toBe(`media:${"d".repeat(64)}.mp4`));
    expect(screen.getByRole("button", { name: W.replace })).toBeInTheDocument();
  });
  it("a store that refuses SAYS so, and the block is unchanged", async () => {
    store.result = { error: "The video could not be kept: this browser's storage is full — quota. Your page is unchanged." };
    const node = mount();
    fireEvent.change(screen.getByLabelText(W.upload, { selector: "input" }), { target: { files: [new File(["x"], "loop.mp4", { type: "video/mp4" })] } });
    expect(await screen.findByRole("alert")).toHaveTextContent(/storage is full/);
    expect(node().bgVideo).toBeUndefined();
  });
});

describe("Background → Video, from a link", () => {
  it("an .mp4 address becomes the block's video", () => {
    const node = mount();
    fireEvent.change(screen.getByLabelText(W.address), { target: { value: "https://example.org/loop.mp4" } });
    expect(node().bgVideo).toBe("https://example.org/loop.mp4");
  });
  it("a YouTube page is refused with the reason, and nothing changes", () => {
    const node = mount();
    fireEvent.change(screen.getByLabelText(W.address), { target: { value: "https://www.youtube.com/watch?v=abc" } });
    expect(screen.getByRole("alert")).toHaveTextContent(W.notAFile);
    expect(node().bgVideo).toBeUndefined();
  });
  it("emptying the address takes a linked video off", () => {
    const node = mount({ bgVideo: "https://example.org/loop.mp4" });
    fireEvent.change(screen.getByLabelText(W.address), { target: { value: "" } });
    expect(node().bgVideo).toBeUndefined();
  });
  it("emptying the address never takes an UPLOADED video off (the field does not show it)", () => {
    const node = mount({ bgVideo: `media:${"d".repeat(64)}.mp4` });
    // LE5-9: typed first — the field already shows "", and "" → "" fires no change at all, so the guard could not fail
    fireEvent.change(screen.getByLabelText(W.address), { target: { value: "h" } });
    fireEvent.change(screen.getByLabelText(W.address), { target: { value: "" } });
    expect(node().bgVideo).toBe(`media:${"d".repeat(64)}.mp4`);
  });
});

describe("with a video", () => {
  it("offers a poster, a tint and Remove — Remove takes the video and its poster off", () => {
    const node = mount({ bgVideo: "https://example.org/loop.mp4", bgVideoPoster: "data:image/jpeg;base64,AA==" });
    expect(screen.getByRole("button", { name: W.poster })).toBeInTheDocument();
    expect(screen.getByLabelText("Tint over background hex value")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: W.remove }));
    expect(node().bgVideo).toBeUndefined();
    expect(node().bgVideoPoster).toBeUndefined();
  });
  it("without one there is no poster, tint or Remove to confuse", () => {
    mount();
    expect(screen.queryByRole("button", { name: W.remove })).toBeNull();
    expect(screen.queryByRole("button", { name: W.poster })).toBeNull();
  });
});

describe("CanvasBgVideo — the canvas draws the published markup", () => {
  it("a silent, inline, looping video with the published classes; the disc is drawn but not a control here", async () => {
    const { container } = render(<CanvasBgVideo node={{ ...createContainer("column"), id: "s", bgVideo: `media:${"d".repeat(64)}.mp4`, bgOverlay: "#000000" } as BoxNode} />);
    const v = container.querySelector("video.eu-bgvideo") as HTMLVideoElement;
    expect(v).not.toBeNull();
    expect(v.muted).toBe(true);
    expect(v.loop).toBe(true);
    expect(v).toHaveAttribute("aria-hidden", "true");
    await waitFor(() => expect(v).toHaveAttribute("src", "blob:x"));
    expect(container.querySelector(".eu-bgvideo__shade")).not.toBeNull();
    expect(container.querySelector(".eu-bgvideo__toggle")).toHaveAttribute("aria-hidden", "true");
  });
  it("nothing for a block with no playable video", () => {
    const { container } = render(<CanvasBgVideo node={{ ...createContainer("column"), id: "s", bgVideo: "https://youtu.be/x" } as BoxNode} />);
    expect(container.innerHTML).toBe("");
  });
});

describe("LE5-7 · a poster that cannot be made never loses the upload", () => {
  it("firstFrame resolves to null — not a throw — when the browser cannot read the video", async () => {
    const { firstFrame } = await import("@/components/website/box/BackgroundVideo");
    await expect(firstFrame(new Blob(["not a video"], { type: "video/mp4" }), 50)).resolves.toBeNull();
  });
  it("LE5-8: a video the browser never finishes reading ends at the time limit, not never", async () => {
    const { firstFrame } = await import("@/components/website/box/BackgroundVideo");
    const made = URL.createObjectURL, gone = URL.revokeObjectURL;
    URL.createObjectURL = () => "blob:never"; URL.revokeObjectURL = () => {}; // jsdom: a <video> that never loads
    try { await expect(firstFrame(new Blob(["x"], { type: "video/mp4" }), 50)).resolves.toBeNull(); }
    finally { URL.createObjectURL = made; URL.revokeObjectURL = gone; }
  }, 2000);
  it("…and the video is still set on the block", async () => {
    const node = mount();
    fireEvent.change(screen.getByLabelText(W.upload, { selector: "input" }), { target: { files: [new File(["x"], "loop.mp4", { type: "video/mp4" })] } });
    await waitFor(() => expect(node().bgVideo).toMatch(/^media:/), { timeout: 3000 });
    expect(node().bgVideoPoster).toBeUndefined();
  });
});
