import classNames from "classnames/bind";
import styles from "./MastHeadTopHome.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function MastHeadTopHome() {
  return (
    <div className={cx("desktop-banner")}>
      {/* MastHead Top Desktop */}
      <div className={cx("masthead-banner")}>
        <Ad
          adUnit="/6808792/REVAMP_DAI_MASTHEAD_TOP_HOME_PAGE"
          name="div-gpt-ad-1753693343796-0"
          size={[970, 250]}
        />
      </div>
    </div>
  );
}
