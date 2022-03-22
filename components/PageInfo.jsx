import React, { useRef } from "react";
import ContactAccordion from "./ContactAccordion";

const datas = [
  {
    title: "What is this website?",
    info: "This is a blog platform catered to users who just want to share what they think of literally anything. Various sorts of topics could be posted and can be search through via the user interface.",
  },
  {
    title: "Why try this website?",
    info: "Why not?, this could be a way to market and just share your information to the world. This website has SEO potential because of the kit used to build this from the ground.",
  },
  {
    title: "How did this start?",
    info: 'It started with just practicing the kit, then as the initial plan was built, the developer then impulsively thought "FINE, I COULD JUST TRY AND MANAGE".',
  },
];

function PageInfo() {
  const tab1 = useRef();
  return (
    <div className="space-y-10 ">
      <div className="space-y-4 flex flex-col items-center md:items-start">
        <h2 className="text-6xl font-bold">
          About <span className="text-orange-400 italic">Readis</span>
        </h2>
        <p className="max-w-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
          consequatur animi obcaecati necessitatibus dolor, incidunt beatae
          sequi officiis sit! Facilis aperiam magni minima. Itaque, at.
        </p>
      </div>
      <div className="space-y-4 flex flex-col items-center md:items-start">
        {datas.map((data) => (
          <ContactAccordion key={Math.random() * 8723} {...data} />
        ))}
      </div>
    </div>
  );
}

export default PageInfo;
