import classNames from "classnames/bind";
import styles from "./PreviewMastHeadBottomMobile.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function PreviewMastHeadBottomMobile() {
  return (
    <div className={cx("mobile-banner")}>
      {/* Masthead Top Mobile */}
      <div className={cx("masthead-banner")}>
        <Ad
          adUnit="/6808792/PREVIEW_DAI_MASTHEAD_BOTTOM_MOBILE"
          name="div-gpt-ad-1753174024437-0"
          size={[
            [320, 330],
            [300, 250],
          ]}
        />
      </div>
    </div>
  );
}
