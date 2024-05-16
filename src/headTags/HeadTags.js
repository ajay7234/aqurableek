import Helmet from "react-helmet";
import Avtar from "../assets/Images/user.png";

const HeadTags = (props) => {
  console.log("props", props.headTag);
  return (
    // <Helmet>
    //   <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    //   <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    //   <meta name="description" key="description" content={props.description} />
    //   <meta name="title" key="title" content={title} />
    //   <meta property="og:title" key="og:title" content={title} />
    //   <meta property="og:locale" key="og:locale" content="en_US" />
    //   <meta charSet="utf-8" />
    //   <meta property="og:type" key="og:type" content="website" />
    //   <meta
    //     property="og:description"
    //     key="og:description"
    //     content={metaDescription}
    //   />
    //   <meta
    //     property="og:image"
    //     key="og:image"
    //     content={`${process.env.BASE_URL}/images/frontend.jpeg`}
    //   />
    // </Helmet>

    <Helmet>
      <meta property="og:title" content={props.headTag.description} />
      <meta property="og:description" content={props.headTag.description} />
      <meta
        property="og:image"
        content={props.headTag?.user?.profilePic || Avtar}
      />
      {/* <meta
        property="og:url"
        content={`https://aqrableek.com/posts/${props.headTag.id}`}
      /> */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Aqrableek" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={props.headTag.description} />
      <meta name="twitter:description" content={props.headTag.description} />
      <meta
        name="twitter:image"
        content={props.headTag?.user?.profilePic || Avtar}
      />
      {/* <meta
        name="twitter:url"
        content={`https://aqrableek.com/posts/${props.id}`}
      /> */}
    </Helmet>
  );
};

export default HeadTags;
