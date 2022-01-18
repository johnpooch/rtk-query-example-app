import React from "react";
import { useListVariantsQuery } from "../hooks/service";

const VariantsList = (): React.ReactElement => {
  const { isLoading, isError, data } = useListVariantsQuery(undefined);

  return (
    <>
      {isLoading && <span>Loading variants...</span>}
      {isError && <span>An error occurred</span>}
      {data &&
        data.map((variant) => (
          <div key={variant.name}>
            <div>Name: {variant.name}</div>
            <div>Description: {variant.description}</div>
            <div>Created by: {variant.createdBy}</div>
          </div>
        ))}
    </>
  );
};

export default VariantsList;
