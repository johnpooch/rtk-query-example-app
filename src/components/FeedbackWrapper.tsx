import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useFeedback } from "../hooks/selectors";
import { actions as feedbackActions } from "../store/feedback";

interface FeedbackWrapperProps {
  children: React.ReactNode;
}

const FeedbackWrapper = ({
  children,
}: FeedbackWrapperProps): React.ReactElement => {
  const feedback = useFeedback();
  const dispatch = useDispatch();

  const handleClose = (id: number) => dispatch(feedbackActions.clear(id));

  return (
    <>
      {children}
      {feedback.map(({ id, message, severity }) => (
        <Snackbar
          key={id}
          open={true}
          onClose={() => handleClose(id)}
          message={message}
        >
          <Alert severity={severity}>{message}</Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default FeedbackWrapper;
