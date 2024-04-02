import moment from "moment";

export const formatTimeDifference = (createdAt) => {
  const postDate = moment.utc(createdAt);
  const currentDate = moment.utc();

  const duration = moment.duration(currentDate.diff(postDate));

  const days = Math.floor(duration.asDays());
  const hours = Math.floor(duration.asHours()) % 24;
  const minutes = Math.floor(duration.asMinutes()) % 60;
  const seconds = Math.floor(duration.asSeconds()) % 60;

  if (days >= 1) {
    if (days === 1) {
      return "1 day ago";
    } else if (days <= 2) {
      return `${days} days ago`;
    } else if (days <= 365) {
      return postDate.format("MMMM DD");
    } else {
      return postDate.format("MMMM DD YYYY");
    }
  } else if (hours >= 1) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (minutes >= 1) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else {
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  }
};
