import { Button, FormControl, Input, Textarea } from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import StatusIcon from "../StatusIcon";

import "./styles.sass";

interface IMyProps {
  user: {
    username: String;
    messages: { content: String; fromSelf: Boolean }[];
    connected: Boolean;
    self: Boolean;
    hasNewMessages: Boolean;
    userID: String;
  };
  input: Function;
}

export default function MessagePanel(props: IMyProps) {
  const displaySender = (message: String, index: number) => {
    return (
      index === 0 ||
      props.user.messages[index - 1].fromSelf !==
        props.user.messages[index].fromSelf
    );
  };
  const formik = useFormik({
    initialValues: {
      input: "",
    },
    onSubmit: (values: any, bag: any) => {
      try {
        props.input(values.input);
      } catch (e: any) {}
      bag.resetForm();
    },
  });

  useEffect(() => {}, [formik.values.input,props]);

  const isValid: boolean = Boolean(formik.values.input.length > 0);

  return (
    <div>
      <div className="header">
        <StatusIcon connected={props.user.connected} />
        {props.user.username}
      </div>
      <ul className="messages">
        {props.user.messages.map((item, index) => (
          <li key={index} className="message">
            {displaySender(item.content, index) && (
              <div className="sender">
                {item.fromSelf ? "(yourself)" : props.user.username}
              </div>
            )}
            {item.content}
          </li>
        ))}
      </ul>
      <form className="form" onSubmit={formik.handleSubmit}>
        <FormControl>
          <Input
            id="input"
            name="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.input}
            placeholder="Your message..."
            className="input"
          />
        </FormControl>
        <Button type="submit" disabled={!Boolean(isValid)}>
          Send
        </Button>
      </form>
    </div>
  );
}
