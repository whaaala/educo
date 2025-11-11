"use client";

import { SchoolBranding, TranscriptDesignConfig } from "@/types/tenant";
import Image from "next/image";

interface TranscriptHeaderProps {
  branding: SchoolBranding;
  design: TranscriptDesignConfig;
  transcriptType: "official" | "unofficial";
}

export default function TranscriptHeader({ branding, design, transcriptType }: TranscriptHeaderProps) {
  const borderColor = design.primaryColor;

  // Render header based on headerStyle
  const renderLogo = () => {
    if (!design.showSchoolLogo) return null;

    return (
      <div className="flex-shrink-0">
        {branding.schoolLogo ? (
          <Image
            src={branding.schoolLogo}
            alt={branding.schoolName}
            width={80}
            height={80}
            className="rounded-full"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
            style={{ backgroundColor: design.primaryColor }}
          >
            {branding.schoolNameShort?.charAt(0) || branding.schoolName.charAt(0)}
          </div>
        )}
      </div>
    );
  };

  const renderSchoolInfo = () => (
    <div className="flex-1">
      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: design.primaryColor || "#000" }}
      >
        {branding.schoolName}
      </h1>
      {design.showSchoolMotto && branding.schoolMotto && (
        <p className="text-sm text-gray-600 italic mb-2">{branding.schoolMotto}</p>
      )}
      <p className="text-xs text-gray-500">
        {branding.address}, {branding.city}, {branding.state}, {branding.country}
      </p>
      <p className="text-xs text-gray-500">
        Email: {branding.email} | Phone: {branding.phone}
        {branding.website && ` | ${branding.website}`}
      </p>
    </div>
  );

  const getHeaderLayout = () => {
    switch (design.headerStyle) {
      case "logo-left":
        return (
          <div className="flex items-center gap-6">
            {renderLogo()}
            {renderSchoolInfo()}
          </div>
        );

      case "logo-right":
        return (
          <div className="flex items-center gap-6">
            {renderSchoolInfo()}
            {renderLogo()}
          </div>
        );

      case "centered":
      default:
        return (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {renderLogo()}
            </div>
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: design.primaryColor || "#000" }}
              >
                {branding.schoolName}
              </h1>
              {design.showSchoolMotto && branding.schoolMotto && (
                <p className="text-sm text-gray-600 italic mb-2">{branding.schoolMotto}</p>
              )}
              <p className="text-xs text-gray-500">
                {branding.address}, {branding.city}, {branding.state}, {branding.country}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Email: {branding.email} | Phone: {branding.phone}
                {branding.website && ` | ${branding.website}`}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="mb-8 pb-6"
      style={{
        borderBottom: design.borderStyle === "double"
          ? `4px double ${borderColor}`
          : design.borderStyle === "solid"
            ? `4px solid ${borderColor}`
            : "none"
      }}
    >
      {getHeaderLayout()}

      {/* Transcript Title */}
      <div className="text-center mt-6">
        <h2
          className="text-2xl font-bold uppercase tracking-wide"
          style={{ color: design.primaryColor || "#000" }}
        >
          {transcriptType === "official" ? "OFFICIAL TRANSCRIPT" : "UNOFFICIAL TRANSCRIPT"}
        </h2>
        <p className="text-sm text-gray-600 mt-1">Academic Record</p>
      </div>
    </div>
  );
}
