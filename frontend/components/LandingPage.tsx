import Image from "next/image";
import { CustomButton } from "./helper-components/CustomButton";
import { FooterMobile } from "./header_footers/FooterMobile";
import { useMediaQuery } from "usehooks-ts";

interface LandingPageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginClick,
  onSignupClick,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <LandingPageMobile
      onLoginClick={onLoginClick}
      onSignupClick={onSignupClick}
    />
  ) : (
    <LandingPageBase
      onLoginClick={onLoginClick}
      onSignupClick={onSignupClick}
    />
  );
};

const LandingPageBase: React.FC<LandingPageProps> = ({
  onLoginClick,
  onSignupClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-between h-screen">
      <div className="w-full h-16 background-primary items-center justify-start flex">
        <Image src="/cesi-eat-logo.png" alt="logo" width={60} height={60} />
      </div>
      <Image
        src="/home-banner.png"
        alt="home banner"
        layout="responsive"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full"
      />
      <div className="justify-center items-center flex flex-col space-y-5 h-45">
        <CustomButton
          onClick={onSignupClick}
          className="w-50 text-white button-black"
        >
          Sign Up
        </CustomButton>
        <CustomButton
          onClick={onLoginClick}
          className="w-50 text-white button-primary-100"
        >
          Login
        </CustomButton>
      </div>
      <Image
        src="/home-footer-banner.png"
        alt="footer home banner"
        layout="responsive"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full"
      />
      <FooterMobile />
    </div>
  );
};

const LandingPageMobile: React.FC<LandingPageProps> = ({
  onLoginClick,
  onSignupClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-between h-screen">
      <div className="w-full h-16 background-primary items-center justify-start flex">
        <Image src="/cesi-eat-logo.png" alt="logo" width={100} height={100} />
      </div>
      <Image
        src="/home-banner.png"
        alt="home banner"
        layout="responsive"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full"
      />
      <div className="justify-center items-center flex flex-col space-y-5 h-45">
        <CustomButton
          onClick={onSignupClick}
          className="w-50 text-white button-black"
        >
          Sign Up
        </CustomButton>
        <CustomButton
          onClick={onLoginClick}
          className="w-50 text-white button-primary-100"
        >
          Login
        </CustomButton>
      </div>
      <Image
        src="/home-footer-banner.png"
        alt="footer home banner"
        layout="responsive"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full"
      />
      <FooterMobile />
    </div>
  );
};
