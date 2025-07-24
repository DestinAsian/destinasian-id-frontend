import classNames from "classnames/bind";
import styles from "./MastHeadBottomGuides.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function MastHeadBottomGuides() {
  return (
    <div className={cx("desktop-banner")}>
      {/* Masthead Top Desktop */}
      <div className={cx("masthead-banner")}>
        <Ad
          adUnit="/6808792/DAI_MASTHEAD_BOTTOM"
          name="div-gpt-ad-1737088143706-0"
          size={[970, 250]}
        />
      </div>
    </div>
  );
}
