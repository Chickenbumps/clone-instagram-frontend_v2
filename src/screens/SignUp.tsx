import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

import { routes } from "../routes";
import AuthLayout from "../components/Auth/AuthLayout";

import Button from "../components/Auth/Button";
import Separator from "../components/Auth/Separator";
import Input from "../components/Auth/Input";
import FormBox from "../components/Auth/FormBox";
import BottomBox from "../components/Auth/BottomBox";
import { FatLink } from "../components/shared";
import PageTitle from "../components/PageTitle";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import {
  createAccount,
  createAccountVariables,
} from "../__generated__/createAccount";
import { useHistory } from "react-router-dom";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtilte = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const history = useHistory();
  const { register, handleSubmit, formState, getValues } = useForm({
    mode: "onChange",
  });
  const [createAccount, { loading, data }] = useMutation<
    createAccount,
    createAccountVariables
  >(CREATE_ACCOUNT_MUTATION, {
    variables: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
    },
    onCompleted: (data) => {
      const { username, password } = getValues();
      const {
        createAccount: { ok, error },
      } = data;
      if (!ok) {
        return;
      }
      history.push(routes.home, {
        message: "Account created. Please Log in.",
        username,
        password,
      });
    },
  });

  const onSubmitValid = (data: any) => {
    if (loading) {
      return;
    }
    createAccount({ variables: { ...data } });
  };

  return (
    <AuthLayout>
      <PageTitle title="Sign up" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtilte>
            Sign up to see photos and videos from your friends.
          </Subtilte>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("firstName", { required: "First Name is required." })}
            type="text"
            placeholder="fistName"
          />
          <Input {...register("lastName")} type="text" placeholder="lastName" />
          <Input
            {...register("email", { required: "Eamil is required." })}
            type="text"
            placeholder="Email"
          />
          <Input
            {...register("username", { required: "Username is required." })}
            type="text"
            placeholder="Username"
          />
          <Input
            {...register("password", { required: "Password is required." })}
            type="password"
            placeholder="Password"
          />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign up"}
            disabled={!formState.isValid || loading}
          />
        </form>
        <Separator />
      </FormBox>
      <BottomBox cta="Have an account?" linkText="Log in" link={routes.home} />
    </AuthLayout>
  );
}

export default SignUp;
