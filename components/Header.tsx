import React from "react";
import Link from "next/link";
import logo from "../assets/images/logo.png";
import logoSept from "../assets/images/logoSept.jpg";

function Header() {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            className="w-20 object-contain cursor-pointer"
            src={logoSept.src}
            alt="entre nouse logo"
          />
        </Link>

        <div className="hidden md:inline-flex items-center space-x-5">
          <Link href="/">
            <h3>Home</h3>
          </Link>

          <Link href="https://septsommets.csf.bc.ca/contactez-nous/">
            <h3 className="text-white bg-blue-600 px-4 py-1 rounded-full">
              Contact
            </h3>
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-5 text-blue-600">
        <Link href="https://septsommets.csf.bc.ca/">
          <img
            className="w-44 object-contain cursor-pointer"
            src={logo.src}
            alt="Sept sommet logo"
          />
        </Link>
      </div>
    </header>
  );
}

export default Header;
