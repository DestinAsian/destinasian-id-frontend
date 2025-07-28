import { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./HalfPage2.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function HalfPage2() {
  useEffect(() => {

  }, []);
  return (
    <div className={cx("halfpage-wrapper")}>
      <div className={cx("halfpage-banner")}>
        {/* HalfPage Banner */}
        <Ad
          adUnit="/6808792/REVAMP_DAI_HALF_PAGE_2_ROS"
          name="div-gpt-ad-1753692936259-0"
          size={[300, 600]}
        />
      </div>
    </div>
  );
}