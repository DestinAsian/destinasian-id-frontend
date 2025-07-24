import classNames from "classnames/bind";
import styles from "./PreviewMastHeadTopGuides.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function PreviewMastHeadTopGuides() {
  return (
    <div className={cx("desktop-banner")}>
      {/* MastHead Top Desktop */}
      <div className={cx("masthead-banner")}>
        <Ad
          adUnit="/6808792/PREVIEW_DAI_MASTHEAD_TOP_GUIDES"
          name="div-gpt-ad-1753253419614-0"
          size={[970, 250]}
        />
      </div>
    </div>
  );
}
