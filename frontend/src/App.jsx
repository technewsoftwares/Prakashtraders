import { useLocation } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import AllRoutes from "./Routes/AllRoutes";
import { useContext, useEffect } from "react";
import { ShopContext } from "./Context/Context"




const App = () => {
  const location = useLocation();
  const { role } = useContext(ShopContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const hideLayout =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin-login");

  return (
    <>
      {!hideLayout && <Navbar />}
      <AllRoutes />
      {!hideLayout && <Footer />}
    </>
  );
};



export default App;
