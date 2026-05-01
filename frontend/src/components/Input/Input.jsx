import React, { forwardRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import "./Input.css"

const Input = forwardRef(({ Text, name, type, password=false, errors, ...rest }, ref) => {
  const [showPassword,setShowPasword] = useState(false);
  const {error} = useSelector(state => state.user);
  
  return (
    <div className="inputContainer" >
      <div className="inputContainer-inner" id={(errors[name] || error?.target === name || error?.target === "All") ? "invalid" : ""}>
        {
          password && <div id="eye" onClick={()=>setShowPasword(!showPassword)}>
            {
              showPassword ? 
              <FaRegEye /> :
              <FaRegEyeSlash /> 
            }
          </div>
        }{
          (type === "password") ?
          <input type={showPassword ? "text" : type} name={name} id={name} required ref={ref} {...rest} />
          :
          <input type={type} name={name} id={name} ref={ref} required {...rest} />
        }
        <div className="labelLine">{Text}</div>
      </div>
      {errors[name] && <p id="formErrorMsg">{errors[name].message}</p>}
      {(error?.target === name ||  error?.target === "All") && <p id="formErrorMsg">{error.message}</p>}
    </div>
  );
});

export default Input;
