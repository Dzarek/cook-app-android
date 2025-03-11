const logoJarek = "/images/logoJarek.png";

const Footer = () => {
  return (
    <footer className="w-screen h-[20vh] xl:h-[10vh] bg-stone-900 flex items-center relative bottom-0 left-0">
      <p className="mx-auto text-center text-white font-bodyFont text-lg">
        © {new Date().getFullYear()} Stępki Gotują
      </p>
      <span className="logoJarek">
        <p>projekt i wykonanie</p>
        <a href="https://www.jarekjanas.com">
          <img src={logoJarek} alt="logo Jarosław Janas" />
        </a>{" "}
      </span>
    </footer>
  );
};

export default Footer;
