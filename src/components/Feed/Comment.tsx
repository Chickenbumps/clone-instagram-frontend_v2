import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  seeFeed_seeFeed,
  seeFeed_seeFeed_comments,
} from "../../__generated__/seeFeed";
import { FatText } from "../shared";

const CommentContainer = styled.div`
  margin-bottom: 7px;
`;
const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
      error
    }
  }
`;

type PickComment = Partial<seeFeed_seeFeed_comments> &
  Partial<seeFeed_seeFeed> & { photoId: seeFeed_seeFeed["id"] };

function Comment({ id, photoId, user, payload, isMine }: PickComment) {
  const updateDeleteComment = (cache: any, result: any) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      cache.evict({ id: `Comment:${id}` });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev: any) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      id,
    },
    update: updateDeleteComment,
  });

  const onClickDelete = () => {
    deleteComment();
  };
  return (
    <CommentContainer>
      <Link to={`/user/${user?.username}`}>
        <FatText>{user?.username}</FatText>
      </Link>
      <CommentCaption>
        {payload?.split(" ").map((word, index) =>
          /#[\w]+/.test(word) ? (
            <React.Fragment key={index}>
              <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>{word + " "} </React.Fragment>
          )
        )}
      </CommentCaption>
      {isMine ? <button onClick={onClickDelete}>❎</button> : null}
    </CommentContainer>
  );
}

export default Comment;
