const styles = {
  boxWidth: "xl:max-w-[1280px] w-full",

  heading2: "font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full",
  heading3: "font-poppins font-semibold text-[32px] text-dimWhite leading-[50px] w-full",
  paragraph: "font-inter font-normal text-dimWhite text-[18px] leading-[30.8px]",

  flexCenter: "flex justify-center items-center",
  flexStart: "flex justify-center items-start",

  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-12 py-4",

  marginX: "sm:mx-16 mx-6",
  marginY: "sm:my-16 my-6",

  // Add the new styles here
  carouselContainer: " pl-4 flex overflow-x-scroll scrollbar-hide",
  videoCard: "flex-shrink-0 w-[500px] auto-height m-4 overflow-hidden rounded-[20px] bg-dimBlue transition-transform duration-300 ease-in-out hover:scale-105",
};

export const layout = {
  section: `flex md:flex-row flex-col ${styles.paddingY}`,
  sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,

  sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
  sectionImg: `flex-1 flex ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,

  sectionInfo: `flex-1 ${styles.flexStart} flex-col`,
};

export const colors = {
  primary: '#070A12',       // Deep navy
  dark: '#0C101C',          // Surface
  dimBlue: '#101628',       // Elevated surface
  secondary: '#7DD3FC',     // Light blue (primary accent)
  accent: '#A78BFA',        // Purple (secondary accent)
  highlight: '#F0F7FF',     // Highlight
  dimWhite: '#A6B1C8',      // Muted text
  white: '#F5F8FF',
  success: '#22c55e',
  warning: '#f59e0b'
};

export const gradients = {
  primary: 'linear-gradient(135deg, #070A12 0%, #0C101C 100%)',
  tech: 'linear-gradient(135deg, #7DD3FC 0%, #A78BFA 100%)',
  performance: 'linear-gradient(135deg, #A78BFA 0%, #7DD3FC 100%)'
};

export default styles;
