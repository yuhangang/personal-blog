export const RouteStyles = () => (
  <style>{`
    :root {
      --hero-width: 92vw;
      --hero-height: 120vw;
    }

    @media (min-width: 768px) {
      :root {
        --hero-width: 60vw;
        --hero-height: 40vw;
      }

      main {
        --nav-px: 2.5rem !important;
        --nav-py: 1.25rem !important;
      }
    }

    @keyframes pantaiScrollDown {
      0% { transform: translateY(-100%); }
      50% { transform: translateY(0%); }
      100% { transform: translateY(100%); }
    }

    .pantai-no-scrollbar::-webkit-scrollbar {
      display: none;
    }

    .pantai-no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    #pantai-timor-scroller {
      overscroll-behavior: none;
      touch-action: pan-x;
      -webkit-overflow-scrolling: touch;
    }
  `}</style>
);
