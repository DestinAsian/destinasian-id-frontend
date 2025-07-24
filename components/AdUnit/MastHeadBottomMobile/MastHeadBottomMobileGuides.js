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
          adUnit="/6808792/DAI_MASTHEAD_BOTTOM_MOBILE"
          name="div-gpt-ad-1737101226800-0"
          size={[
            [320, 330],
            [300, 250],
          ]}
        />
      </div>
    </div>
  );
}
