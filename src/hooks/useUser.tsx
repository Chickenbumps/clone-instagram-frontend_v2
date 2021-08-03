import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { isLoggedInVar, userLogout } from "../apollo";
import { me } from "../__generated__/me";

const ME_QUERY = gql`
  query me {
    me {
      id
      username
      avatar
    }
  }
`;

function useUser() {
  const history = useHistory();
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data } = useQuery<me>(ME_QUERY, {
    skip: !hasToken,
  });

  useEffect(() => {
    // console.log(data);
    if (data?.me === null) {
      userLogout(history);
    }
    return;
  }, [data]);
  return { data };
}

export default useUser;
