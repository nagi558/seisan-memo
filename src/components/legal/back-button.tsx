"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

// /terms・/privacyは未ログイン（/loginから）・ログイン済み双方からアクセスされ得るため、
// 遷移元を固定したLinkではなくブラウザ履歴に戻るボタンにする。
export function BackButton() {
  const router = useRouter();

  return (
    <Button variant="ghost" size="icon" aria-label="前の画面に戻る" onClick={() => router.back()}>
      <ArrowLeft />
    </Button>
  );
}
