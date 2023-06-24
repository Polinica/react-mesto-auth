import logo from "../images/Vector.svg";

function Header({ children }) {
  let links;
  if (children.length > 1) {
    links = children;
  } else {
    links = [children];
  }

  return (
    // {/* <!-- Header --> */}
    <header className="header content__element">
      <img src={logo} alt="Место. Логотип проекта" className="header__logo" />
      {links && (
        <ul className="header__menu">
          {[...links].map((item, pos) => (
            <li className="header__menu-item" key={pos}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

export default Header;
