import { Provider } from "react-redux";
import Layout from "../components/layout/Layout";
import "../styles/globals.css";
import store from "../components/store/index";
import { db } from "../firebase.config";
import { AuthProvider } from "../components/context/auth-context";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </Provider>
  );
}

export default MyApp;
