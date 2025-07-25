import classNames from "classnames/bind";
import styles from "./PreviewMastHeadTopHome.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function PreviewMastHeadTopHome() {
  return (
    <div className={cx("desktop-banner")}>
      {/* MastHead Top Desktop */}
      <div className={cx("masthead-banner")}>
        <Ad
          adUnit="/6808792/PREVIEW_DAI_MASTHEAD_TOP_HOME"
          name="div-gpt-ad-1753423532773-0"
          size={[970, 250]}
        />
      </div>
    </div>
  );
}
