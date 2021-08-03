import { gql, useQuery } from "@apollo/client";

import Photo from "../components/Feed/Photo";
import PageTitle from "../components/PageTitle";

import { seeFeed, seeFeed_seeFeed } from "../__generated__/seeFeed";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      id
      file
      likes
      commentNumber
      isLiked
      user {
        username
        avatar
      }
      caption
      comments {
        id
        user {
          username
          avatar
        }
        payload
        isMine
        createdAt
      }
      createdAt
      isMine
    }
  }
`;

function Home() {
  const { data } = useQuery<seeFeed>(FEED_QUERY);
  console.log(data);
  return (
    <div>
      <PageTitle title={"Home"} />
      {data?.seeFeed?.map((photo: seeFeed_seeFeed) => {
        return <Photo key={photo?.id} {...photo} />;
      })}
    </div>
  );
}

export default Home;
