import React from "react";
import "../styles/TopBody.css";

function TopBody(props) {
  if (props.visibility) {
    return (
      <section className="shop-feature bg-gray grid">
        <div>
          <p className="fs-montserrat text-black">
            Home <span aria-haspopup="true" className="margin"></span>
            {props.name}
          </p>
        </div>
        <h2 className="fs-poppins fs-300 bold-700">{props.name}</h2>
      </section>
    );
  } else {
    return null;
  }
}

export default TopBody;
