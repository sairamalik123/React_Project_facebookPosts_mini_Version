import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserByUsername } from "./Api.js";
import "../App.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const validate = () => {
    if (username.trim() === "" || password.trim() === "" || email.trim() === "") {
      alert("Please enter username, password, and email.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const userData = await fetchUserByUsername(username);
        if (Object.keys(userData).length === 0) {
          alert("Invalid username");
        } else {
          if (userData.password === password && userData.email === email) {
            alert("Successfully logged in");
            sessionStorage.setItem("username", username);
            navigate("/");
          } else {
            alert("Invalid credentials");
          }
        }
      } catch (err) {
        alert("Login failed due to: " + err.message);
      }
    }
  };
  return (
    <div className="bg">
    <div className="container">
      <div className="offset-lg-4 col-lg-4 center3 post1">
        <form className="container" onSubmit={handleLogin}>
          <div className="card">
            <div className="card-header login_center">
              <h1>User Login</h1>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>
                      User Name:<span className="errmsg"> *</span>
                    </label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-control"
                    ></input>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>
                      Email:<span className="errmsg"> *</span>
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      className="form-control"
                    ></input>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>
                      Password:<span className="errmsg"> *</span>
                    </label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      className="form-control"
                    ></input>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button type="submit"
                className="btn btn-primary loginsubmit">
                Login
              </button>
              <Link
                className="btn btn-success loginsubmit"
                to={"/register"}>
                New User
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}


