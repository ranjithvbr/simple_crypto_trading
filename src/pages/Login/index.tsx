import React, { useCallback, useState } from "react";
import Button from "../../component/Button";
import Input from "../../component/Input";
import Modal from "../../component/Modal";
import "./login.scss";

interface StateParams {
  email: string;
  password: string;
}

interface LoginParams {
  modalVisible: boolean;
  closeModal: any;
  reload?: boolean;
}

export default function Login({ modalVisible, closeModal, reload }: LoginParams) {
  const [states, setState] = useState<StateParams>({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState<StateParams>({
    email: "",
    password: "",
  });

  const doLogin = useCallback(async () => {
    if (states.email === "") {
      setErrorMsg((prevState) => {
        return {
          ...prevState,
          email: "Email is required",
        };
      });
      return;
    }
    if (states.password === "") {
      setErrorMsg((prevState) => {
        return {
          ...prevState,
          password: "Password is required",
        };
      });
      return;
    }
    if (!errorMsg.email && !errorMsg.password) {
      await localStorage.setItem("isLogin", "true");
      await localStorage.setItem("email", states.email);
      if(reload) {
        return window.location.reload();
      }
      closeModal("LoginSuccess");
    }
  }, [closeModal, errorMsg, states, reload]);

  const checkValidation = (fieldName: string) => {
    let valiodationMsg = "";
    if (fieldName === "email") {
      const validEmail = states.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      valiodationMsg =
        validEmail === null && states.email ? "Please enter a valid email" : "";
    } else if (fieldName === "password") {
      valiodationMsg =
        states.password && states?.password?.length < 3
          ? "Minimum password length atleast 4"
          : "";
    }

    setErrorMsg((prevState) => {
      return {
        ...prevState,
        [fieldName]: valiodationMsg,
      };
    });
  };

  const handleChange = useCallback((value: string, name: string) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  return (
    <Modal modalVisible={modalVisible} closeModal={closeModal}>
      <div className="loginContainer">
        <h3>Login</h3>
        <label>Email: </label>
        <Input
          onChange={(data: string) => handleChange(data, "email")}
          onBlur={() => checkValidation("email")}
          errMsg={errorMsg.email ? errorMsg.email : ""}
        />
        <label>Password: </label>
        <Input
          type="password"
          onChange={(data) => handleChange(data, "password")}
          onBlur={() => checkValidation("password")}
          errMsg={errorMsg.password ? errorMsg.password : ""}
        />
        <Button customStyle={"btnStyle"} label="Login" onClick={doLogin} />
      </div>
    </Modal>
  );
}
