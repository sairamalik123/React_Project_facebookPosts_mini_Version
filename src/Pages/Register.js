import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [id, idchange] = useState("");
  const [email, emailchange] = useState("");
  const [password, passwordchange] = useState("");
  const navigate = useNavigate();

  const IsValidate = () => {
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

  const checkUserExists = () => {
    return fetch(`http://localhost:8000/user?username=${id}&email=${email}`)
      .then((response) => response.json())
      .then((data) => {
        return data.length > 0; // If data.length > 0, user with the same username or email exists
      });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    let regobj = { id, email, password };

    // Check if the user with the same username or email already exists
    checkUserExists()
      .then((userExists) => {
        if (userExists) {
          alert("User already exists.");
        } else {
          if (IsValidate()) {
            fetch("http://localhost:8000/user", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(regobj),
            })
              .then((resp) => {
                navigate("/login");
                console.log(resp);
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
    <div className="container-fluid bg">
      <div className="offset-lg-3 col-lg-6 center3 post">
        <form className="container" onSubmit={handlesubmit}>
          <div className="card">
            <div className="card-header" style={{ textAlign: "center" }}>
              <h1>User Registration</h1>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>
                      User Name:<span className="errmsg"> *</span>
                    </label>
                    <input value={id} onChange={e=>idchange(e.target.value)} className="form-control"></input>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>
                      Email:<span className="errmsg"> *</span>
                    </label>
                    <input value={email} onChange={e=>emailchange(e.target.value)} className="form-control"></input>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>
                      Password:<span className="errmsg"> *</span>
                    </label>
                    <input type="password" value={password} onChange={e=>passwordchange(e.target.value)} className="form-control"></input>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button
                type="submit"
                style={{  width: "40%",
                textAlign: "center",
                marginLeft: "8%",
                marginRight: "5%", }}
                className="btn btn-primary"><Link to="/login"></Link>
                Register
              </button>
              <Link
                className="btn btn-success"
                to={"/login"}
                style={{ width: "40%", textAlign: "center" }}
              >
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
