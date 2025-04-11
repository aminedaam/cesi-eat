import Image from "next/image";
import Link from "next/link";

export const FooterMobile: React.FC = () => {
  return (
    <div className="w-full background-primary-50 items-center justify-center flex flex-col py-4 space-y-5">
      <div className="flex space-x-5">
        <Image src="/app-store.png" alt="app store" width={100} height={50} />
        <Image src="/play-store.png" alt="play store" width={100} height={50} />
      </div>
      <Image
        src="/social-networks.png"
        alt="social networks"
        width={60}
        height={20}
      />
      <div className="flex items-end justify-between w-full px-5">
        <div className="flex flex-col">
          <p className="text-black"> Politique de confidentialité</p>
          <p className="text-black"> Conditions générales</p>
        </div>
        <Link href="/policy">
          <p className="text-black">© 2025 Cesi Eat</p>
        </Link>
      </div>
    </div>
  );
};
