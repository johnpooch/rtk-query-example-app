import React, { useState } from "react";
import { useCreateGameMutation } from "../hooks/service";

type FormData = {
  name: string;
  description: string;
  private: boolean;
  variant: string;
};

const initialData: FormData = {
  name: "",
  description: "",
  private: false,
  variant: "",
};

const CreateGameForm = (): React.ReactElement => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [createGame, { isLoading, isError, isSuccess, data }] =
    useCreateGameMutation();

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    void createGame(formData);
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
        {isLoading && <div>Creating game...</div>}
        {isError && <div>An error occurred</div>}
        {isSuccess && <div>Game created successfully!</div>}
        {data && (
          <>
            <div>
              <strong>Your new game:</strong>
            </div>
            <div>ID: {data.id}</div>
            <div>Name: {data.name}</div>
            <div>Description: {data.description}</div>
          </>
        )}
      </form>
    </>
  );
};

export default CreateGameForm;
