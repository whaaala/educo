"use client";

import { SignatureConfig, TranscriptDesignConfig } from "@/types/tenant";
import Image from "next/image";

interface TranscriptFooterProps {
  signatures: SignatureConfig;
  design: TranscriptDesignConfig;
  verificationCode: string;
  verificationUrl?: string;
}

export default function TranscriptFooter({
  signatures,
  design,
  verificationCode,
  verificationUrl,
}: TranscriptFooterProps) {
  return (
    <div
      className="mt-12 pt-6"
      style={{
        borderTop: design.borderStyle === "double"
          ? `2px double ${design.primaryColor}`
          : design.borderStyle === "solid"
            ? `2px solid ${design.primaryColor}`
            : "none"
      }}
    >
      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Registrar Signature */}
        <div>
          {signatures.registrarSignature ? (
            <div className="mb-2">
              <Image
                src={signatures.registrarSignature}
                alt="Registrar Signature"
                width={150}
                height={60}
                className="mb-2"
              />
            </div>
          ) : (
            <div className="h-16 mb-2" />
          )}
          <div
            className="border-t-2 pt-2"
            style={{ borderColor: design.primaryColor }}
          >
            <p className="font-semibold text-sm text-gray-900">{signatures.registrarName}</p>
            <p className="text-xs text-gray-600">{signatures.registrarTitle}</p>
            <p className="text-xs text-gray-500 mt-1">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Principal Signature */}
        <div>
          {signatures.principalSignature ? (
            <div className="mb-2">
              <Image
                src={signatures.principalSignature}
                alt="Principal Signature"
                width={150}
                height={60}
                className="mb-2"
              />
            </div>
          ) : (
            <div className="h-16 mb-2" />
          )}
          <div
            className="border-t-2 pt-2"
            style={{ borderColor: design.primaryColor }}
          >
            <p className="font-semibold text-sm text-gray-900">{signatures.principalName}</p>
            <p className="text-xs text-gray-600">{signatures.principalTitle}</p>
            <p className="text-xs text-gray-500 mt-1">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Official Seal */}
      {signatures.showOfficialSeal && (
        <div className="text-center mb-6">
          {signatures.sealImage ? (
            <Image
              src={signatures.sealImage}
              alt="Official Seal"
              width={120}
              height={120}
              className="mx-auto"
            />
          ) : (
            <div className="inline-block">
              <div
                className="border-4 rounded-full px-8 py-6"
                style={{ borderColor: design.primaryColor }}
              >
                <div
                  className="font-bold text-xl"
                  style={{ color: design.primaryColor }}
                >
                  OFFICIAL SEAL
                </div>
                <div className="text-xs text-gray-600 mt-1">Authenticated</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Verification Code */}
      <div className="bg-gray-100 p-4 rounded text-center">
        <p className="text-xs text-gray-600 mb-1">Verification Code</p>
        <p className="font-mono font-bold text-sm text-gray-900 mb-1">{verificationCode}</p>
        {verificationUrl && (
          <p className="text-xs text-gray-500">
            Verify this transcript at: <span className="font-semibold">{verificationUrl}</span>
          </p>
        )}
      </div>

      {/* QR Code Placeholder */}
      {design.includeQRCode && (
        <div className="mt-4 text-center">
          <div className="inline-block border-2 border-gray-300 p-2 bg-white">
            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
              QR Code
              <br />
              (Production)
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Scan to verify transcript authenticity</p>
        </div>
      )}

      {/* Footer Notice */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 italic">
          This document is issued by the school and contains confidential information.
          <br />
          Unauthorized use, reproduction, or distribution is prohibited.
        </p>
      </div>
    </div>
  );
}
