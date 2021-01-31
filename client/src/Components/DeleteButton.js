import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Confirm, Icon } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

function DeleteButton({ postId, commentsId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    update(proxy, result) {
      setConfirmOpen(false);
      if (!commentsId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        let newData = [...data.getPosts];
        newData = newData.filter((post) => post.id !== postId);
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data,
        });
      }
      if (callback) callback();
    },
    variables: { postId, commentsId },
  });
  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePost}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default DeleteButton;
