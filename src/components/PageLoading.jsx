import logo from '../assets/images/light-vts-hr.png';
const AppLoading = ({ tip = 'Loading...' }) => {
  return (
    <>
      {/* =====================================================
          LOADING ANIMATION
      ===================================================== */}
      <style>
        {`
          @keyframes appLoadingRotate {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes appLoadingPulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 1;
            }

            50% {
              transform: scale(0.96);
              opacity: 0.85;
            }
          }

          @keyframes appLoadingFade {
            0% {
              opacity: 0.35;
            }

            50% {
              opacity: 1;
            }

            100% {
              opacity: 0.35;
            }
          }
        `}
      </style>

      {/* =====================================================
          FULL SCREEN OVERLAY
      ===================================================== */}

      <div
        style={{
          position: 'fixed',

          inset: 0,

          width: '100%',

          height: '100%',

          display: 'flex',

          alignItems: 'center',

          justifyContent: 'center',

          background: 'rgba(15, 23, 42, 0.28)',

          backdropFilter: 'blur(5px)',

          WebkitBackdropFilter: 'blur(5px)',

          zIndex: 9999,
        }}
      >
        {/* =================================================
            LOADING CARD
        ================================================= */}

        <div
          style={{
            minWidth: 180,

            padding: '26px 30px 22px',

            display: 'flex',

            flexDirection: 'column',

            alignItems: 'center',

            justifyContent: 'center',

            background: 'rgba(255, 255, 255, 0.96)',

            border: '1px solid rgba(255,255,255,0.75)',

            borderRadius: 20,

            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.20)',
          }}
        >
          {/* =================================================
              LOGO + CIRCLE
          ================================================= */}

          <div
            style={{
              position: 'relative',

              width: 105,

              height: 105,

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'center',
            }}
          >
            {/* =============================================
                OUTER ROTATING RING
            ============================================= */}

            <div
              style={{
                position: 'absolute',

                inset: 0,

                borderRadius: '50%',

                border: '3px solid #e8edf5',

                borderTopColor: '#1677ff',

                borderRightColor: '#1677ff',

                animation: 'appLoadingRotate 0.9s linear infinite',
              }}
            />

            {/* =============================================
                INNER WHITE CIRCLE
            ============================================= */}

            <div
              style={{
                width: 87,

                height: 87,

                borderRadius: '50%',

                background: '#ffffff',

                display: 'flex',

                alignItems: 'center',

                justifyContent: 'center',

                boxShadow: '0 5px 18px rgba(22,119,255,0.10)',

                animation: 'appLoadingPulse 1.8s ease-in-out infinite',
              }}
            >
              {/* =========================================
                  LOGO
              ========================================= */}

              <img
                src={logo}
                alt="VTS HR"
                style={{
                  width: 67,

                  height: 67,

                  objectFit: 'contain',

                  userSelect: 'none',

                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* =================================================
              LOADING TEXT
          ================================================= */}

          <div
            style={{
              marginTop: 16,

              fontSize: 14,

              fontWeight: 500,

              color: '#4b5563',

              letterSpacing: '0.2px',
            }}
          >
            {tip}
          </div>

          {/* =================================================
              LOADING DOTS
          ================================================= */}

          <div
            style={{
              marginTop: 10,

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'center',

              gap: 5,
            }}
          >
            {[0, 1, 2].map((item) => (
              <span
                key={item}
                style={{
                  width: 5,

                  height: 5,

                  borderRadius: '50%',

                  background: '#1677ff',

                  animation: 'appLoadingFade 1.2s ease-in-out infinite',

                  animationDelay: `${item * 0.18}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLoading;
