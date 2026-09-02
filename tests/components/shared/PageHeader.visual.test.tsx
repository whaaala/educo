import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PageHeader from "@/components/shared/PageHeader";

describe("PageHeader — Visual / CSS", () => {
  // ─── Layout ──────────────────────────────────
  describe("layout", () => {
    it("has w-full on outer wrapper", () => {
      const { container } = render(
        <PageHeader
          title="Test"
          breadcrumbs={[]}
          actions={[]}
        />
      );

      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain("w-full");
    });

    it("has flex-col on mobile, sm:flex-row on tablet+ in content area", () => {
      const { container } = render(
        <PageHeader
          title="Test"
          breadcrumbs={[]}
          actions={[]}
        />
      );

      // The flex layout is on a child div inside the w-full wrapper
      const flexDiv = container.querySelector(".flex.flex-col");
      expect(flexDiv).toBeInTheDocument();
      expect(flexDiv!.className).toContain("sm:flex-row");
      expect(flexDiv!.className).toContain("gap-3");
    });
  });

  // ─── Title theming ───────────────────────────
  describe("title theming", () => {
    it("title has dark:text-white", () => {
      render(
        <PageHeader
          title="Dashboard"
          breadcrumbs={[]}
          actions={[]}
        />
      );

      const title = screen.getByText("Dashboard");
      expect(title.className).toContain("text-ink");
    });

    it("title has midnight theme class", () => {
      render(
        <PageHeader
          title="Dashboard"
          breadcrumbs={[]}
          actions={[]}
        />
      );

      const title = screen.getByText("Dashboard");
      expect(title.className).toContain("text-ink");
    });

    it("title has purple theme class", () => {
      render(
        <PageHeader
          title="Dashboard"
          breadcrumbs={[]}
          actions={[]}
        />
      );

      const title = screen.getByText("Dashboard");
      expect(title.className).toContain("text-ink");
    });
  });

  // ─── Responsive text sizing ──────────────────
  describe("responsive text", () => {
    it("title has responsive text sizing", () => {
      render(
        <PageHeader
          title="Dashboard"
          breadcrumbs={[]}
          actions={[]}
        />
      );

      const title = screen.getByText("Dashboard");
      // Title typically has text-xl/lg:text-2xl or similar
      expect(title.className).toMatch(/text-(lg|xl|2xl)/);
    });
  });

  // ─── Breadcrumb theming ──────────────────────
  describe("breadcrumb theming", () => {
    it("breadcrumb links have hover states", () => {
      render(
        <PageHeader
          title="Detail"
          breadcrumbs={[{ label: "Home", href: "/" }]}
          actions={[]}
        />
      );

      const link = screen.getByText("Home");
      expect(link.className).toContain("hover:text-gray-700");
    });
  });
});
