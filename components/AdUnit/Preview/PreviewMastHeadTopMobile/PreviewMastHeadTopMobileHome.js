import classNames from "classnames/bind";
import styles from "./PreviewMastHeadTopMobileHome.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function PreviewMastHeadTopMobileHome() {
  return (
    <div className={cx("mobile-banner")}>
      {/* MastHead Top Mobile */}
      <div className={cx("masthead-banner")}>
        <Ad
          adUnit="/6808792/PREVIEW_DAI_MASTHEAD_TOP_HOME_MOBILE"
          name="div-gpt-ad-1753423588563-0"
          size={[
            [300, 250],
            [320, 330],
          ]}
        />
      </div>
    </div>
  );
}
