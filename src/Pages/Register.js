import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { checkUserExists, createUser } from "./Api.js";

export default function Register() {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isValidate = () => {
    let isproceed = true;
    let errormessage = "Please enter the";
    if (id == null || id === "") {
      isproceed = false;
      errormessage += " Username";
    }
    if (email == null || email === "") {
      isproceed = false;
      errormessage += " Email";
    }
    if (password == null || password === "") {
      isproceed = false;
      errormessage += " Password";
    }
    if (!isproceed) {
      alert(errormessage);
    } else {
      if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
      } else {
        isproceed = false;
        alert("Please enter a valid email");
      }
    }
    return isproceed;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkUserExists(id, email)
      .then((userExists) => {
        if (userExists) {
          alert("User already exists.");
        } else {
          if (isValidate()) {
            const userData = { id, email, password };
            createUser(userData)
              .then(() => {
                navigate("/login");
                alert("Registered successfully");
              })
              .catch((err) => {
                alert("Failed: " + err.message);
              });
          }
        }
      })
      .catch((err) => {
        alert("Failed: " + err.message);
      });
  };
  return (
    <div className="bg">
    <div className="container">
      <div className="offset-lg-3 col-lg-6 center3 post">
        <form className="container" onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-header .login_center">
              <h1>User Registration</h1>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>
                      User Name:<span className="errmsg"> *</span>
                    </label>
                    <input value={id} onChange={e=>setId(e.target.value)} className="form-control"></input>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>
                      Email:<span className="errmsg"> *</span>
                    </label>
                    <input value={email} onChange={e=>setEmail(e.target.value)} className="form-control"></input>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>
                      Password:<span className="errmsg"> *</span>
                    </label>
                    <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="form-control"></input>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer ">
              <button 
                type="submit"
                className="btn btn-primary loginsubmit"><Link to="/login"></Link>
                Register
              </button>
              <Link
                className="btn btn-success regLogin"
                to={"/login"}
              >
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
