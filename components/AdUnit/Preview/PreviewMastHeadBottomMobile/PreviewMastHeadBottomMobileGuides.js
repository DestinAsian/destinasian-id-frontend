import classNames from "classnames/bind";
import styles from "./PreviewMastHeadBottomMobileGuides.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function PreviewMastHeadBottomMobileGuides() {
  return (
    <div className={cx("mobile-banner")}>
      {/* Masthead Top Mobile */}
      <div className={cx("masthead-banner")}>
        <Ad
          adUnit="/6808792/PREVIEW_DAI_MASTHEAD_BOTTOM_MOBILE_GUIDES"
          name="div-gpt-ad-1753253341803-0"
          size={[
            [320, 330],
            [300, 250],
          ]}
        />
      </div>
    </div>
  );
}
