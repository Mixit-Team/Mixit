// src/components/ShareModal.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

declare global {
  interface Window {
    Kakao: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Link: {
        sendDefault: (options: unknown) => void;
      };
    };
  }
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl?: string;
  shareText?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareUrl = typeof window !== 'undefined' ? window.location.href : '',
  shareText = typeof document !== 'undefined' ? document.title : '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // 2) 클립보드 복사 함수
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('URL이 복사되었습니다.');
    } catch {
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  // 3) 카카오톡 공유 함수
  const kakaoShare = () => {
    if (!window.Kakao) {
      alert('카카오 SDK가 준비되지 않았습니다.');
      return;
    }
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY');
    }

    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: shareText,
        description: shareText,
        imageUrl: 'https://example.com/preview-image.png',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '웹에서 보기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
    onClose();
  };

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const bandLink = `https://band.us/plugin/share?body=${encodedText}%20${encodedUrl}`;
  const naverBlogLink = `https://share.naver.com/web/shareView.nhn?url=${encodedUrl}&title=${encodedText}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="relative w-[100vw] max-w-md rounded-lg bg-white p-4 shadow-lg"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="mb-4 text-center text-xl font-medium">공유하기</h2>

        <div className="grid grid-cols-4 gap-4 px-2">

          <button
            onClick={kakaoShare}
            className="flex flex-col items-center gap-1"
          >
            <div className="h-12 w-12">
              <Image src="/images/kakao.png" alt="카카오톡" width={40} height={40} />
            </div>
            <span className="text-xs text-gray-700">카카오톡</span>
          </button>

          <a
            href={naverBlogLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1"
          >
            <div className="h-12 w-12">
              <Image src="/images/naver_blog.png" alt="블로그" width={40} height={40} />
            </div>
            <span className="text-xs text-gray-700">네이버 블로그</span>
          </a>


          <a
            href={bandLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1"
          >
            <div className="h-12 w-12">
              <Image src="/images/naver_band.svg" alt="밴드" width={40} height={40} />
            </div>
            <span className="text-xs text-gray-700">네이버 밴드</span>
          </a>

      
          <a
            href={facebookLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1"
          >
            <div className="h-12 w-12">
              <Image src="/images/facebook.webp" alt="페이스북" width={40} height={40} />
            </div>
            <span className="text-xs text-gray-700">페이스북</span>
          </a>

  


        </div>

        <hr className="my-4 border-gray-200" />

        <div className="flex items-center gap-2 px-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-75 rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="rounded bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            URL 복사
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
