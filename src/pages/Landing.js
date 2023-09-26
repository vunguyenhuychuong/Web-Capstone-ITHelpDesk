import React from "react";
import tw from "twin.macro";
import AnimationRevealPage from './helpers/AnimationRevealPage';
import Hero from './helpers/TwoColumnWithInput';
import Features from "../components/landing/ThreeColWithSideImage";
import MainFeature2 from "../components/landing/TwoColWithTwoHorizontalFeaturesAndButton.js";
//import heroScreenshotImageSrc from "../assets/images/hero-screenshot-1.png";
import Pricing from "../components/landing/ThreePlans";
//import Testimonial from "../components/headers/TwoColumnWithImageAndRating.js";
import { ReactComponent as MoneyIcon } from "feather-icons/dist/icons/dollar-sign.svg";
import { ReactComponent as BriefcaseIcon } from "feather-icons/dist/icons/briefcase.svg";
import FAQ from "../components/landing/SingleCol.js";
import Footer from "../components/landing/FiveColumnWithBackground.js";
import prototypeIllustrationImageSrc from "../assets/images/prototype-illustration.svg";


const Landing = () => {
  const Subheading = tw.span`uppercase tracking-widest font-bold text-primary-500`;
  const HighlightedText = tw.span`text-primary-500`;

  return (
    <AnimationRevealPage>
      <Hero roundedHeaderButton={true} />
      <Features
        subheading={<Subheading>Features</Subheading>}
        heading={
          <>
            We have Amazing <HighlightedText>Service.</HighlightedText>
          </>
        }
      />
      <MainFeature2
        subheading={<Subheading>VALUES</Subheading>}
        heading={
          <>
            We Always Abide by Our <HighlightedText>Principles.</HighlightedText>
          </>
        }
        imageSrc={prototypeIllustrationImageSrc}
        showDecoratorBlob={false}
        features={[
          {
            Icon: MoneyIcon,
            title: "Affordable",
            description: "We promise to offer you the best rate we can - at par with the industry standard.",
            iconContainerCss: tw`bg-green-300 text-green-800`
          },
          {
            Icon: BriefcaseIcon,
            title: "Professionalism",
            description: "We assure you that our templates are designed and created by professional designers.",
            iconContainerCss: tw`bg-red-300 text-red-800`
          }
        ]}
      />
      <Pricing
        subheading={<Subheading>Pricing</Subheading>}
        heading={
          <>
            Reasonable & Flexible <HighlightedText>Plans.</HighlightedText>
          </>
        }
        plans={[
          {
            name: "Basic Package",
            price: "$17.99",
            duration: "Monthly",
            mainFeature: "For Individuals",
            features: ["Unlimited IT Helpdesk support", "Technology Consulting", "Service time: 8x5"]
          },
          {
            name: "Standard Package",
            price: "$37.99",
            duration: "Monthly",
            mainFeature: "For Small Businesses",
            features: ["Unlimited IT Helpdesk support", "Network Infrastructure Support", "Periodically check on-site", "Periodic Service Reports", "Service time: 8x5"],
            featured: true
          },
          {
            name: "Professional Package",
            price: "$57.99",
            duration: "Monthly",
            mainFeature: "For Large Companies",
            features: ["Unlimited IT Helpdesk support", "Network Infrastructure Support", "Periodically check on-site", "Periodic Service Reports", "Network Infrastructure","Service time: 8x5"]
          }
        ]}
      />
      <FAQ
        subheading={<Subheading>FAQS</Subheading>}
        heading={
          <>
            You have <HighlightedText>Questions ?</HighlightedText>
          </>
        }
        faqs={[
          {
            question: "Are all the templates easily customizable ?",
            answer:
              "Yes, they all are. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          {
            question: "How long do you usually support an standalone template for ?",
            answer:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          {
            question: "What kind of payment methods do you accept ?",
            answer:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          {
            question: "Is there a subscribption service to get the latest templates ?",
            answer:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          {
            question: "Are the templates compatible with the React ?",
            answer:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          },
          {
            question: "Do you really support Internet Explorer 11 ?",
            answer:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          }
        ]}
      />
      <Footer />
    </AnimationRevealPage>
  );
};

export default Landing;
