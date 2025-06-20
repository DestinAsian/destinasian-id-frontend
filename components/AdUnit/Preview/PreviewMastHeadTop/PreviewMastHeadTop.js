import classNames from "classnames/bind";
import styles from "./PreviewMastHeadTop.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function PreviewMastHeadTop() {
  return (
    <div className={cx("desktop-banner")}>
      {/* MastHead Top Desktop */}
      <div className={cx("masthead-banner")}>
        <Ad
          adUnit="/6808792/DAI_MASTHEAD_TOP"
          name="div-gpt-ad-1737084369962-0"
          size={[970, 250]}
        />
      </div>
    </div>
  );
}
