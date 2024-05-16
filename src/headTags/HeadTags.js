"use server";

import Helmet from "react-helmet";
import Avtar from "../assets/Images/user.png";
import { useEffect } from "react";

const HeadTags = (props) => {
  console.log("props", props.headTag);

  useEffect(() => {
    console.log("Props changed:", props.headTag);
  }, [props.headTag]);

  return (
    <div>
      <Helmet>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta property="og:title" content={props.headTag.description} />
        <meta property="og:title" key="og:title" content="Aqrableek" />
        <meta property="og:locale" key="og:locale" content="en_US" />
        <meta charSet="utf-8" />
        <meta property="og:type" key="og:type" content="website" />
        <meta
          property="og:description"
          key="og:description"
          content={props.headTag.description}
        />

        {/* <link rel="icon" href={`${props.headTag?.user?.profilePic}`} /> */}
        <meta
          property="og:image"
          content={props.headTag?.user?.profilePic || Avtar}
        />
        <meta
          property="og:url"
          content={`https://aqrableek.com/posts/${props.headTag.id}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Aqrableek" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.headTag.description} />
        <meta name="twitter:description" content={props.headTag.description} />
        <meta
          name="twitter:image"
          content={props.headTag?.user?.profilePic || Avtar}
        />
        <meta
          name="twitter:url"
          content={`https://aqrableek.com/posts/${props.id}`}
        />
      </Helmet>
    </div>
  );
};

export default HeadTags;
