import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { useForm } from "react-hook-form";
import { routes } from "../routes";
import AuthLayout from "../components/Auth/AuthLayout";

import Button from "../components/Auth/Button";
import Separator from "../components/Auth/Separator";
import Input from "../components/Auth/Input";
import FormBox from "../components/Auth/FormBox";
import BottomBox from "../components/Auth/BottomBox";
import PageTitle from "../components/PageTitle";
import FormError from "../components/Auth/FormError";
import { gql, useMutation } from "@apollo/client";
import { userLogin } from "../apollo";
import { login, loginVariables } from "../__generated__/login";
import { useLocation } from "react-router-dom";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;
const Notification = styled.div`
  color: #2ecc71;
`;
const LoginMutation = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;
// interface loginResultError {
//   username: string | undefined | "";
//   password: string | undefined | "";
// }

function Login() {
  const location: any = useLocation();
  // console.log(location);
  const {
    register,
    watch,
    handleSubmit,
    formState,
    getValues,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: location?.state?.username || "",
      password: location?.state?.password || "",
      loginResult: "",
    },
  });

  const [login, { loading }] = useMutation<login, loginVariables>(
    LoginMutation,
    {
      variables: { username: "", password: "" },
      onCompleted: (data) => {
        console.log("login", data);
        const {
          login: { ok, error, token },
        } = data;
        if (!ok) {
          return setError("loginResult", { message: error });
        }
        userLogin(token);
      },
    }
  );

  const onSubmitValid = (data: any) => {
    if (loading) {
      return;
    }
    const { username, password } = getValues();
    login({ variables: { username, password } });
  };
  // console.log("formState", formState.isValid);

  return (
    <AuthLayout>
      <PageTitle title="Login" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <Notification>{location?.state?.message}</Notification>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("username", {
              required: "Username is required.",
              minLength: {
                value: 5,
                message: "Username should be longer than 5 chars.",
              },
            })}
            type="text"
            placeholder="Username"
            hasError={Boolean(formState.errors?.username?.message)}
            onFocus={() => clearErrors("loginResult")}
          />
          <FormError message={formState.errors?.username?.message} />
          <Input
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password should be longer than 6 chars.",
              },
            })}
            type="password"
            placeholder="Password"
            hasError={Boolean(formState.errors?.password?.message)}
            onFocus={() => clearErrors("loginResult")}
          />
          <FormError message={formState.errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Log in"}
            disabled={!formState.isValid || loading}
          />
          <FormError message={formState.errors?.loginResult?.message} />
        </form>
        <Separator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with Facebook</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta="Don't have an accout?"
        link={routes.signUp}
        linkText="Sign up"
      ></BottomBox>
    </AuthLayout>
  );
}

export default Login;
