import React, { useEffect } from "react";
import "./style.css";

const PopUp = ({ title, open, setOpen, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "initial";
    }
  }, [open]);

  if (!open) return null;

  const closeModal = () => {
    document.querySelector(".modalOverlay").classList.add("hide");
    document.querySelector(".modalOverlay").classList.remove("show");
    document.querySelector(".modalContainer").classList.add("hide");
    document.querySelector(".modalContainer").classList.remove("show");
  };

  return (
    <div>
      <div
        className={`modalOverlay ${open ? "show" : "hide"}`}
        onClick={closeModal}
      ></div>
      <div className={`modalContainer ${open ? "show" : "hide"}`}>
        <div className="modalHeader">
          <span className="modalTitle">{title}</span>
          <span className="exitModal" onClick={closeModal}>
            {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="72"
                height="72"
                viewBox="0 0 72 72"
                fill="none"
              >
                <g filter="url(#filter0_d_512_18315)">
                  <circle cx="36" cy="32" r="32" fill="white" />
                  <path
                    d="M47.3137 40.4853L38.8284 32L47.3137 23.5147C47.6888 23.1396 47.8995 22.6309 47.8995 22.1005C47.8995 21.57 47.6888 21.0613 47.3137 20.6863C46.9386 20.3112 46.4299 20.1005 45.8995 20.1005C45.3691 20.1005 44.8604 20.3112 44.4853 20.6863L36 29.1715L27.5147 20.6863C27.1396 20.3112 26.6309 20.1005 26.1005 20.1005C25.5701 20.1005 25.0614 20.3112 24.6863 20.6863C24.3112 21.0613 24.1005 21.57 24.1005 22.1005C24.1005 22.6309 24.3112 23.1396 24.6863 23.5147L33.1716 32L24.6863 40.4853C24.3112 40.8603 24.1005 41.369 24.1005 41.8995C24.1005 42.4299 24.3112 42.9386 24.6863 43.3137C25.0614 43.6888 25.5701 43.8995 26.1005 43.8995C26.6309 43.8995 27.1396 43.6888 27.5147 43.3137L36 34.8284L44.4853 43.3137C44.8604 43.6888 45.3691 43.8995 45.8995 43.8995C46.4299 43.8995 46.9386 43.6888 47.3137 43.3137C47.6888 42.9386 47.8995 42.4299 47.8995 41.8995C47.8995 41.369 47.6888 40.8603 47.3137 40.4853Z"
                    fill="#E81E23"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_512_18315"
                    x="0"
                    y="0"
                    width="72"
                    height="72"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.909804 0 0 0 0 0.117647 0 0 0 0 0.137255 0 0 0 0.15 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_512_18315"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_512_18315"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            }
          </span>
        </div>
        <div className="modalChildren">{children}</div>
      </div>
    </div>
  );
};

export default PopUp;
