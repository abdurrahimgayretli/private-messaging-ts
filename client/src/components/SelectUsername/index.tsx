import { Button, FormControl, Input } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect } from "react";

import "./styles.sass";

interface IMyProps {
  input: Function;
}

export default function SelectUsername(props: IMyProps) {
  const formik = useFormik({
    initialValues: {
      username: "",
    },
    onSubmit: async (values: any, bag: any) => {
      try {
        props.input(String(formik.values.username));
      } catch (e: any) {}
      bag.resetForm();
    },
  });

  const buttonValid = () => {
    return formik.values.username.length < 2 ? true : false;
  };


  return (
    <div className="select-username">
      <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <Input
            placeholder="Your username..."
            id="username"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          ></Input>
        </FormControl>
        <Button mt={5} type="submit" disabled={buttonValid()}>
          Submit
        </Button>
      </form>
    </div>
  );
}
