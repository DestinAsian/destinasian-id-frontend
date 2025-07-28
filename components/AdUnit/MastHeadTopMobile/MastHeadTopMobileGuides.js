import classNames from "classnames/bind";
import styles from "./MastHeadTopMobileGuides.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function MastHeadTopMobileGuides() {
  return (
    <div className={cx("mobile-banner")}>
      {/* MastHead Top Mobile */}
      <div className={cx("masthead-banner")}>
        <Ad
          adUnit="/6808792/REVAMP_DAI_MASTHEAD_TOP_MOBILE_GUIDE"
          name="div-gpt-ad-1753693385231-0"
          size={[
            [300, 250],
            [320, 330],
          ]}
        />
      </div>
    </div>
  );
}
