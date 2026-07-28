import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { Global, css } from "@emotion/react";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";
import ShopContextProvider from "./Context/Context.jsx"; // Import default export
import ErrorBoundary from "./ErrorBoundary.jsx";


const globalStyles = css`
  body {
    background-color: black;
    color: white;
    margin: 0;
  }
`;

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ErrorBoundary>
      <ShopContextProvider>
        <ChakraProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2000,
              style: {
                background: "#18181b",
                color: "#fff",
                borderRadius: "9999px",
                padding: "10px 16px",
                fontSize: "14px",
              },
            }}
          />
          <Global styles={globalStyles} />
          <App />
        </ChakraProvider>
      </ShopContextProvider>
    </ErrorBoundary>
  </BrowserRouter>
);
