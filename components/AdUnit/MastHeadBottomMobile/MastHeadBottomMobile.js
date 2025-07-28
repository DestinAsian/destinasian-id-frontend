import classNames from "classnames/bind";
import styles from "./MastHeadBottomMobile.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function MastHeadBottomMobile() {
  return (
    <div className={cx("mobile-banner")}>
      {/* Masthead Top Mobile */}
      <div className={cx("masthead-banner")}>
        <Ad
          adUnit="/6808792/REVAMP_DAI_MASTHEAD_BOTTOM_MOBILE_ROS"
          name="div-gpt-ad-1753693177916-0"
          size={[
            [320, 330],
            [300, 250],
          ]}
        />
      </div>
    </div>
  );
}
