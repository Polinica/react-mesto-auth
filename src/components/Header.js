import logo from "../images/Vector.svg";

function Header() {
  return (
    // {/* <!-- Header --> */}
    <header className="header content__element">
      <img src={logo} alt="Место. Логотип проекта" className="header__logo" />
    </header>
  );
}

export default Header;
