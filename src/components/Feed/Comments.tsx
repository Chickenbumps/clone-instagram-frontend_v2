import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import {
  createComment,
  createCommentVariables,
} from "../../__generated__/createComment";
import {
  seeFeed_seeFeed,
  seeFeed_seeFeed_comments,
} from "../../__generated__/seeFeed";
import Comment from "./Comment";

const CommentsContainer = styled.div`
  margin-top: 20px;
`;

const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  display: block;
  font-weight: 600;
  font-size: 10px;
`;

const PostCommentContainer = styled.div`
  margin-top: 10px;
  padding-top: 15px;
  padding-bottom: 10px;
  border-top: 1px solid ${(props) => props.theme.borderColor};
`;

const PostCommentInput = styled.input`
  width: 100%;
  &::placeholder {
    font-size: 12px;
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      id
      error
    }
  }
`;

type PickComments = Pick<
  seeFeed_seeFeed,
  "id" | "user" | "caption" | "commentNumber" | "comments"
>;

function Comments({
  id: photoId,
  user,
  caption,
  commentNumber,
  comments,
}: PickComments) {
  const { data }: any = useUser();
  const mutationUpdate = (cache: any, result: any) => {
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;
    if (ok) {
      const newComment: seeFeed_seeFeed_comments = {
        __typename: "Comment",
        createdAt: Date.now() + "",
        id,
        isMine: true,
        payload: caption,
        user: {
          ...data,
        },
      };
      // const newCacheComment = cache.writeFragment({
      //   data: newComment,
      //   fragment: gql`
      //     fragment fragNewCacheComment on Comment {
      //       id
      //       createdAt
      //       isMine
      //       payload
      //       user {
      //         username
      //         avatar
      //       }
      //     }
      //   `,
      // });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(prev: seeFeed_seeFeed_comments[]) {
            return [...prev, newComment];
          },
          commentNumber(prev: number) {
            return prev + 1;
          },
        },
      });
    }
  };

  const [createComment, { loading }] = useMutation<
    createComment,
    createCommentVariables
  >(CREATE_COMMENT_MUTATION, { update: mutationUpdate });
  const { register, handleSubmit, setValue } = useForm();
  const onValid = (data: any) => {
    const { payload } = data;
    if (loading) {
      return;
    }
    createComment({
      variables: {
        photoId,
        payload,
      },
    });
    setValue("payload", "");
  };
  return (
    <CommentsContainer>
      <Comment photoId={photoId} user={user} payload={caption} />
      <CommentCount>
        {commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
      </CommentCount>
      {comments?.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
          photoId={photoId}
          user={comment.user}
          payload={comment.payload}
          isMine={comment.isMine}
        />
      ))}
      <PostCommentContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <PostCommentInput
            {...register("payload", {
              required: true,
            })}
            type="text"
            placeholder="Write a comment..."
          />
        </form>
      </PostCommentContainer>
    </CommentsContainer>
  );
}

export default Comments;
