"use client";

import Paywall from "@/components/auth/Paywall";
import { splitHtmlForPreview } from "@/lib/utils/splitHtml";

interface PaidPostContentProps {
  html: string;
}

export default function PaidPostContent({ html }: PaidPostContentProps) {
  const { preview, full } = splitHtmlForPreview(html, 0.35);

  return (
    <Paywall
      preview={
        <div
          className="ghost-content max-w-none"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      }
    >
      <div
        className="ghost-content max-w-none"
        dangerouslySetInnerHTML={{ __html: full }}
      />
    </Paywall>
  );
}
