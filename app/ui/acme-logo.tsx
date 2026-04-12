import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[44px]">Kurunegala Merchants (Pvt) Ltd</p>
    </div>
  );
}
//text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[44px]
// original code    text-[44px]
