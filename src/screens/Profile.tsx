import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Auth/Button";
import PageTitle from "../components/PageTitle";
import { FatText } from "../components/shared";
import useUser from "../hooks/useUser";
import { followUser, followUserVariables } from "../__generated__/followUser";

import {
  seeProfile,
  seeProfileVariables,
  seeProfile_seeProfile,
} from "../__generated__/seeProfile";
import {
  unfollowUser,
  unfollowUserVariables,
} from "../__generated__/unfollowUser";

const SEE_PROFILE_MUTATION = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      id
      firstName
      lastName
      username
      bio
      avatar
      photos {
        id
        file
        likes
        commentNumber
        isLiked
      }
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
`;

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
    }
  }
`;
const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
    }
  }
`;

const Header = styled.div`
  display: flex;
`;
const ProfileAvatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: #2c2c2c;
`;
const Column = styled.div``;

const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;
const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
`;
const List = styled.ul`
  display: flex;
`;
const Item = styled.li`
  margin-right: 20px;
`;
const Value = styled(FatText)`
  font-size: 18px;
`;
const Name = styled(FatText)`
  font-size: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;
interface photoDiv {
  bg: string;
}

const Photo = styled.div<photoDiv>`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
`;
const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;
const ProfileBtn = styled(Button).attrs({
  as: "span",
})`
  margin-left: 10px;
  margin-top: 0px;
  border-radius: 30px;
  cursor: pointer;
`;

function Profile() {
  const { username }: any = useParams();
  const { data: userData } = useUser();
  const client = useApolloClient();
  const { data, loading } = useQuery<seeProfile, seeProfileVariables>(
    SEE_PROFILE_MUTATION,
    {
      variables: {
        username,
      },
    }
  );

  const updateFollowUser = (cache: any, result: any) => {
    const {
      data: { followUser: ok },
    } = result;

    if (!ok) {
      return;
    }

    cache.modify({
      id: `User:${data?.seeProfile?.id}`,
      fields: {
        isFollowing(prev: any) {
          return true;
        },
        totalFollowers(prev: any) {
          return prev + 1;
        },
      },
    });

    cache.modify({
      id: `User:${userData?.me?.id}`,
      fields: {
        totalFollowing(prev: any) {
          return prev + 1;
        },
      },
    });
  };

  const onCompletedUnfollow = (result: unfollowUser) => {
    const { unfollowUser: ok } = result;
    if (!ok) {
      return;
    }

    const { cache } = client;
    cache.modify({
      id: `User:${data?.seeProfile?.id}`,
      fields: {
        isFollowing(prev) {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });
    cache.modify({
      id: `User:${userData?.me?.id}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };

  const [followUser] = useMutation<followUser, followUserVariables>(
    FOLLOW_USER_MUTATION,
    {
      variables: {
        username,
      },
      update: updateFollowUser,
    }
  );

  const [unfollowUser] = useMutation<unfollowUser, unfollowUserVariables>(
    UNFOLLOW_USER_MUTATION,
    {
      variables: {
        username,
      },
      onCompleted: onCompletedUnfollow,
    }
  );

  const getButton = (seeProfile: seeProfile_seeProfile) => {
    const { isMe, isFollowing } = seeProfile;
    if (isMe) {
      return <ProfileBtn>Edit Profile</ProfileBtn>;
    }
    console.log(isFollowing);
    if (isFollowing) {
      return <ProfileBtn onClick={() => unfollowUser()}>Unfollow</ProfileBtn>;
    } else {
      return <ProfileBtn onClick={() => followUser()}>Follow</ProfileBtn>;
    }
  };
  return (
    <div>
      <PageTitle
        title={
          loading ? "Loading..." : `${data?.seeProfile?.username}'s Profile`
        }
      />
      <Header>
        <ProfileAvatar src={data?.seeProfile?.avatar} />
        <Column>
          <Row>
            <Username>{data?.seeProfile?.username}</Username>
            {data?.seeProfile ? getButton(data?.seeProfile) : null}
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing}</Value> follwing
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>
              {data?.seeProfile?.firstName}
              {"  "}
              {data?.seeProfile?.lastName}
            </Name>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
        </Column>
      </Header>
      <Grid>
        {data?.seeProfile?.photos?.map((photo) => (
          <Photo key={photo.id} bg={photo.file}>
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo.likes}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo.commentNumber}
              </Icon>
            </Icons>
          </Photo>
        ))}
      </Grid>
    </div>
  );
}

export default Profile;
