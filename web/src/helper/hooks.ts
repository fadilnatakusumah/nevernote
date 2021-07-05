import { useEffect, useState } from "react";

interface FormTypeObjectKey {
  [key: string]: string | undefined;
}

export interface FormType extends FormTypeObjectKey {
  email: string;
  password: string;
}

export const useRequired = (form: FormType) => {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (Object.keys(form).length > 0) {
      let isAllValid = true;
      for (let key in form) {
        if (!form[key]) {
          isAllValid = false;
          break;
        }
      }
      setIsValid(isAllValid);
    }
  }, [form]);

  return { isValid };
};
