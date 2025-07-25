import classNames from "classnames/bind";
import styles from "./PreviewMastHeadBottomHome.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function PreviewMastHeadBottomHome() {
  return (
    <div className={cx("desktop-banner")}>
      {/* Masthead Top Desktop */}
      <div className={cx("masthead-banner")}>
        <Ad
          adUnit="/6808792/PREVIEW_DAI_MASTHEAD_BOTTOM_HOME"
          name="div-gpt-ad-1753423362608-0"
          size={[970, 250]}
        />
      </div>
    </div>
  );
}
