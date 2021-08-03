import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { ThemeProvider } from "styled-components";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";
import Home from "./screens/Home";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import { routes } from "./routes";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import Profile from "./screens/Profile";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <div>
            <Router>
              <Switch>
                <Route exact path={routes.home}>
                  {isLoggedIn ? (
                    <Layout>
                      <Home />
                    </Layout>
                  ) : (
                    <Login />
                  )}
                </Route>
                {isLoggedIn ? null : (
                  <Route exact path={routes.signUp}>
                    <SignUp />
                  </Route>
                )}
                <Route path={`/user/:username`}>
                  <Layout>
                    <Profile />
                  </Layout>
                </Route>
              </Switch>
            </Router>
          </div>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
