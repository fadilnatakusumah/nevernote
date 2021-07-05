import styled from "@emotion/styled";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, Redirect, RouterProps } from "react-router-dom";
import { GENERICS } from "../components/GlobalStyle";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { isAuthenticated, saveToken } from "../helper/auth";
import { useRequired } from "../helper/hooks";

export function Login({ history }: RouterProps) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [submitLogin, { error, loading }] = useLoginMutation();
  const { isValid } = useRequired(form);

  if (isAuthenticated()) {
    return <Redirect to="/" />;
  }

  const onSubmitHander = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    try {
      const data = await submitLogin({
        variables: {
          ...form,
        },
      });
      saveToken(data.data?.login.access_token!);
      history.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeHandler =
    (name: string) =>
    ({ target }: ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [name]: target.value });

  return (
    <Wrapper center={true}>
      <FormWrapper className="login-container">
        <div className="left-side">
          <img
            src="https://businesstemplates.co.nz/wp-content/uploads/2020/12/login-concept-illustration_114360-739.jpg"
            alt="login"
          />
        </div>
        <div className="right-side">
          <div>
            <img
              src="https://www.freeiconspng.com/uploads/evernote-icon-2.png"
              alt=""
            />
            <h2>Nevernote</h2>
          </div>
          <form onSubmit={onSubmitHander}>
            <div>
              <input
                placeholder="Email"
                value={form.email}
                onChange={onChangeHandler("email")}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={onChangeHandler("password")}
              />
            </div>

            {error &&
              error.graphQLErrors.map(({ message }, i) => (
                <div key={i}>
                  <small className="error-message">{message}</small>
                </div>
              ))}

            <div>
              <button disabled={!isValid || loading} type="submit">
                {loading ? "..." : "Submit"}
              </button>
            </div>

            <p>
              Don't have an account? Signup&nbsp;
              <span>
                <Link to="/signup">here</Link>
              </span>
            </p>
          </form>
        </div>
      </FormWrapper>
    </Wrapper>
  );
}

const FormWrapper = styled("div")`
  display: flex;
  align-items: center;
  border: ${GENERICS.border};
  border-radius: 5px;
  padding: 50px;
  user-select: none;
  gap: 20px;

  > div {
    flex: 0.5;
  }

  .left-side {
    img {
      width: 200px;
    }
  }

  .right-side {
    > div:first-of-type {
      text-align: center;
      img {
        width: 50px;
        border-radius: 10px;
      }
      margin-bottom: 20px;
    }

    form {
      div {
        margin-bottom: 10px;

        input {
          border: 2px solid gray;
          border-radius: 5px;
          padding: 10px 20px;
          outline: none;
          transition: 0.5s;
          &:focus {
            border-color: blue;
          }
        }

        button {
          border-radius: 5px;
          width: 100%;
          color: white;
          background-color: ${GENERICS.primaryColor};
          padding: 8px 20px;

          &:disabled {
            background-color: #ccc;
          }
        }
        small.error-message {
          color: red;
        }
      }

      p {
        font-size: 12px;
        a {
          color: ${GENERICS.primaryColor};
        }
      }
    }
  }
`;
