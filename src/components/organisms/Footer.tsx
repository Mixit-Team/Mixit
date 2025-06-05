import Image from 'next/image';

const Footer = () => (
  <footer className="mt-30 bg-[#F7F7F8] py-8">
    <div className="mx-auto w-full max-w-[767px] space-y-4 px-4">
      <div className="flex flex-col items-start space-y-2">
        <div className="flex items-center space-x-2">
          <Image
            src="/images/symbol.png"
            alt="Mixit"
            width={32}
            height={32}
            style={{ objectFit: 'contain' }}
          />

          <span className="pt-1 text-4xl font-bold text-[#C2C4C8]">Mixit</span>
        </div>
        <p className="text-sm text-[#A1A3A6]">
          문의, 비즈니스 제안 :{' '}
          <a href="mailto:mixitofficialmixit@gmail.com" className="underline">
            mixitofficialmixit@gmail.com
          </a>
        </p>
      </div>

      <div className="flex space-x-6">
        <a
          href="/terms/service"
          target="_blank"
          className="text-sm text-[#6D6F72] underline hover:text-[#333]"
        >
          이용약관
        </a>
        <a
          href="/terms/privacy"
          target="_blank"
          className="text-sm text-[#6D6F72] underline hover:text-[#333]"
        >
          개인정보 처리방침
        </a>
      </div>

      <p className="text-start text-xs text-[#B0B2B5]">
        Copyright ⓒ 2025 Mixit All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
