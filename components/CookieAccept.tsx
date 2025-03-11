import CookieConsent from "react-cookie-consent";
import Link from "next/link";

const CookieAccept = () => {
  return (
    <CookieConsent
      buttonText="Akceptuje"
      cookieName="myAwesomeCookieName"
      // className="cookieInfo"
      style={{
        background: "#18181b",
        fontSize: "14px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        fontFamily: '"Poppins", sans-serif',
        padding: "0.5vh 0",
        zIndex: 999999,
      }}
      buttonStyle={{
        color: "#222",
        fontSize: "16px",
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "5px",
        fontFamily: '"Poppins", sans-serif',
        fontWeight: "600",
      }}
      expires={7}
    >
      Strona korzysta z plików cookies. Pozostając na niej wyrażasz zgodę na ich
      używanie. <br /> Ze szczegółowymi informacjami dotyczącymi cookies na tej
      stronie można się zapoznać tutaj:
      <Link href="/cookie" className="cookieLink">
        (Polityka Prywatności)
      </Link>
      .
    </CookieConsent>
  );
};

export default CookieAccept;
