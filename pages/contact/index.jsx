import React from "react";
import DevCard from "../../components/DevCard";
import PageInfo from "../../components/PageInfo";

function Contact() {
  return (
    <div className="flex flex-col space-y-12 md:flex-row md:justify-between md:space-x-6">
      <PageInfo />
      <DevCard />
    </div>
  );
}

export default Contact;
