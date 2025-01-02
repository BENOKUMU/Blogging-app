import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/GlobalContext";

const Logo = ({ to, type }) => {
    const { theme } = useStateContext();
  
    const content = (
      <>
        THEHYPER
        <span
          className={`text-3xl ${
            theme === "dark" ? "text-purple" : "text-twitter"
          } ${type && "text-5xl font-bold"}`}
        >
          scope
        </span>
      </>
    );
  
    return to ? (
      <Link to={to} className="text-2xl font-semibold">
        {content}
      </Link>
    ) : (
      <div className="text-2xl font-semibold">{content}</div>
    );
  };
  

export default Logo;
