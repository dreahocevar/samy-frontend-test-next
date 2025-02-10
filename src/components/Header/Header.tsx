import React, { useState } from "react";
import Image from "next/image";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("searching", searchTerm);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image src="/logo.svg" alt="Logo" width={80} height={30} />
      </div>

      <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <Image
            src="/searchicon.png"
            alt="Search Icon"
            width={20}
            height={20}
            className={styles.searchIcon}
          />
          <input
            type="text"
            placeholder="You're looking for something?"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
      </form>
    </header>
  );
};

export default Header;
