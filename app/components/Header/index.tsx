import Image from "next/image";
import Logo from "../../assets/logo.png";
import { FormattedDate } from "@/utils/ConvertDate";
import styles from "./header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <Image src={Logo} alt="Logo FocalPoint" width={150} height={36} />
      <div className={styles.titleContainer}>
        <h1 className={styles.headline}>Bem-vindo de volta, Marcus</h1>
      </div>
      <p className={styles.date}>{FormattedDate(Date.now())}</p>
    </header>
  );
};

export default Header;