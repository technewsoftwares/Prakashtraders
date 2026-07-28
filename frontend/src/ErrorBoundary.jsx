import React from "react";
import { useLocation } from "react-router-dom";

class ErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.log("🔥🔥🔥 REAL ERROR START 🔥🔥🔥");
    console.log(error);
    console.log(info);
    console.log("🔥🔥🔥 REAL ERROR END 🔥🔥🔥");
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ hasError: false, error: null });
    }
  }

render() {
  if (this.state.hasError) {
    return (
      <div style={{ padding: "20px", background: "#000", color: "#ff5555" }}>
        <h2>Application crashed</h2>
        <p>Check browser console for error details.</p>
      </div>
    );
  }

  return this.props.children;
}

}

export default function ErrorBoundary({ children }) {
  const location = useLocation();
  return (
    <ErrorBoundaryInner location={location}>
      {children}
    </ErrorBoundaryInner>
  );
}
