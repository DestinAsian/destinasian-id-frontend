import classNames from "classnames/bind";
import styles from "./MastHeadBottomMobileGuides.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function MastHeadBottomMobileGuides() {
  return (
    <div className={cx("mobile-banner")}>
      {/* Masthead Top Mobile */}
      <div className={cx("masthead-banner")}>
        <Ad
          adUnit="/6808792/REVAMP_DAI_MASTHEAD_BOTTOM_MOBILE_GUIDE"
          name="div-gpt-ad-1753693088090-0"
          size={[
            [320, 330],
            [300, 250],
          ]}
        />
      </div>
    </div>
  );
}
